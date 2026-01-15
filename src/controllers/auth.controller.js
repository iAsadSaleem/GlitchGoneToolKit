const User = require("../models/User");
const bcrypt = require("bcrypt");

// SIGNUP
// SIGNUP
exports.signup = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // Normalize email and name to lower case for checking
    const emailLower = email.toLowerCase();
    const nameLower = name.toLowerCase();

    // Check if email exists (case-insensitive)
    const existingEmail = await User.findOne({
      email: { $regex: `^${email}$`, $options: "i" } // i = case-insensitive
    });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if name exists (case-insensitive)
    const existingName = await User.findOne({
      name: { $regex: `^${name}$`, $options: "i" }
    });

    if (existingName) {
      return res.status(400).json({ message: "Name already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    console.log("User created:", user);
    res.json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Save user in session
    req.session.userId = user._id;

    res.json({ message: "Login successful" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.getProfile = async (req, res) => {
  try {
    // Check session
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.session.userId)
      .select("name email"); // only what you need

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }

    res.clearCookie("connect.sid"); // default session cookie
    res.json({ message: "Logged out successfully" });
  });
};