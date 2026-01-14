const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const session = require("express-session");

dotenv.config();
connectDB();

const app = express();

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- SESSION (MUST BE BEFORE ROUTES) ----------
app.use(session({
  name: "glitchgone.sid",
  secret: process.env.SESSION_SECRET || "glitchgone_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,     // true only in HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

// ---------- AUTH GUARD ----------
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login-signup.html");
  }
  next();
};

// ---------- ROUTES ----------
app.use("/api/auth", require("./routes/auth.routes"));

// ---------- PUBLIC PAGE ----------
app.get("/", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/index.html");
  }
  res.sendFile(path.join(__dirname, "../public/login-signup.html"));
});

// ---------- PROTECTED PAGES ----------
app.get("/index.html", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// ---------- STATIC FILES ----------
app.use(express.static(path.join(__dirname, "../public")));

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;
const HOST = 'http://localhost';

app.listen(PORT, () => {
  console.log(`🚀 Server running at ${HOST}:${PORT}`);
});
