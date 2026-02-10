const Theme = require("../models/theme");
const User = require("../models/User");

exports.index = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId)
    const themes = await Theme.find();
    const activeTheme = themes.find(t => t.isActive) || themes[0];
    res.render("index", { themes, activeTheme ,user});
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
