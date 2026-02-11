const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const connectDB = require("./config/db");



dotenv.config();
connectDB();

const app = express();

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1); // REQUIRED for Vercel

// ---------- SESSION (MUST BE BEFORE ROUTES) ----------
// app.use(session({
//   name: "glitchgone.sid",
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   proxy: true,
//   cookie: {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production", // ✅ FIX
//     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//     maxAge: 1000 * 60 * 60 * 24 * 7
//   }
// }));
connectDB().then(() => {
  console.log("MongoDB Connected");

  app.set("trust proxy", 1);

  app.use(session({
    name: "glitchgone.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    store: MongoStore.create({
      client: mongoose.connection.getClient(), // Use mongoose client
      collectionName: "sessions"
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  }));

  // Start server here
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("Failed to connect MongoDB:", err);
});
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});
// ---------- AUTH GUARD ----------
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login-signup.html");
  }
  next();
};
// Set EJS as template engine
app.set("view engine", "ejs");

// Set the views folder (where your EJS templates will live)
app.set("views", path.join(__dirname, "../public/views"));
// ---------- ROUTES ----------
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/theme", require("./routes/themes-route"));

// ---------- PUBLIC PAGE ----------
app.get("/", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/index");
  }
  res.sendFile(path.join(__dirname, "../public/login-signup.html"));
});

// ---------- PROTECTED PAGES ----------
// app.get("/index.html", isAuthenticated, (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/index.html"));
// });

const themeController = require("./controllers/theme.controller");

// Render homepage with dynamic themes
app.get("/index", isAuthenticated, themeController.index);
app.get("/theme-settings/:id",isAuthenticated,themeController.themeSettings);
app.get("/dashboard", isAuthenticated, (req, res) => {res.render("dashboard");});
// ---------- STATIC FILES ----------
app.use(express.static(path.join(__dirname, "../public")));

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;
const HOST = 'http://localhost';

app.listen(PORT, () => {
  console.log(`🚀 Server running at ${HOST}:${PORT}`);
});
  