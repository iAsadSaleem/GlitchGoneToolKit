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
exports.themeSettings = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId)
    const themeId = req.params.id;

    const theme = await Theme.findById(themeId);

    if (!theme) {
      return res.status(404).send("Theme not found");
    }

    res.render("theme-settings", {
      theme,user
    });
  } catch (error) {
    console.error("Theme settings error:", error);
    res.status(500).send("Server error");
  }
};