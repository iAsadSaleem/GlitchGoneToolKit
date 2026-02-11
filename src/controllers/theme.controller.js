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
// POST /api/theme/select
exports.selectTheme = async (req, res) => {
  const { themeId } = req.body;

  if (!themeId) return res.status(400).json({ message: "Theme ID required" });

  try {
    // Deactivate all themes first
    await Theme.updateMany({}, { isActive: false });

    // Activate the selected theme
    const selectedTheme = await Theme.findByIdAndUpdate(themeId, { isActive: true }, { new: true });

    return res.json({
      message: "Theme selected successfully",
      theme: selectedTheme
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
