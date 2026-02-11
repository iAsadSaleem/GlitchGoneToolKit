const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const connectDB = require("./config/db");
const themeController = require("./controllers/theme.controller");

dotenv.config();

const app = express();

// ---------- MIDDLEWARE ----------
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1); // REQUIRED for Vercel

// ---------- AUTH GUARD ----------
const isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.redirect("/login-signup.html");
  }
  next();
};

// ---------- STATIC FILES ----------
app.use(express.static(path.join(__dirname, "../public")));

// ---------- EJS SETUP ----------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../public/views"));

// ---------- CACHE CONTROL ----------
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// ---------- CONNECT TO MONGODB AND SET SESSION ----------
connectDB().then(() => {
  // Session Middleware (must be AFTER MongoDB connected)
  app.use(session({
    name: "glitchgone.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      collectionName: "sessions"
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true only in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  }));

  // ---------- ROUTES ----------

  // Public
  app.get("/", (req, res) => {
    if (req.session && req.session.userId) {
      return res.redirect("/index");
    }
    res.sendFile(path.join(__dirname, "../public/login-signup.html"));
  });

  // Auth APIs
  app.use("/api/auth", require("./routes/auth.routes"));
  app.use("/api/theme", require("./routes/themes-route"));

  // Protected Pages
  app.get("/index", isAuthenticated, themeController.index);
  app.get("/theme-settings/:id", isAuthenticated, themeController.themeSettings);
  app.get("/dashboard", isAuthenticated, (req, res) => res.render("dashboard"));

  // ---------- 404 PAGE ----------
  app.use((req, res, next) => {
    res.status(404);

    // If you have a custom EJS 404 page
    if (req.accepts('html')) {
      return res.render('404'); // Make a 404.ejs inside your views folder
    }

    // If client expects JSON
    if (req.accepts('json')) {
      return res.json({ error: "404 Not Found" });
    }

    // Default plain text
    res.type('txt').send('404 Not Found');
  });

  // ---------- START SERVER ----------
  const PORT = process.env.PORT || 5000;
  const HOST = 'http://localhost';
  app.listen(PORT, () => {
    console.log(`🚀 Server running at ${HOST}:${PORT}`);
  });

}).catch(err => {
  console.error("Failed to connect MongoDB:", err);
});
