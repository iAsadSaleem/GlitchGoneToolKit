const Theme = require("../models/theme");
const User = require("../models/User");
const UserTheme = require("../models/UserTheme");

exports.index = async (req, res) => {
  try {
    const userId = req.session.userId;

    const user = await User.findById(userId);

    // all available themes (master templates)
    const themes = await Theme.find();

    // active theme for this user
    const activeUserTheme = await UserTheme.findOne({
      userId,
      isActive: true
    }).populate("themeId");

    const activeTheme = activeUserTheme
      ? activeUserTheme.themeId
      : themes[0];

    const activeThemeId = activeUserTheme
      ? activeUserTheme.themeId._id.toString()
      : null;

    res.render("index", {
      themes,
      activeTheme,
      activeThemeId,
      user
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).send("Server error");
  }
};
exports.themeSettings = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId)
    const themeId = req.params.id;

    const theme = await Theme.findById(themeId);
    const userTheme = await UserTheme.findOne({
      userId: req.session.userId,
      themeId: req.params.id
    });
    if (!theme) {
      return res.status(404).send("Theme not found");
    }

    res.render("theme-settings", {
      theme,user,userTheme
    });
  } catch (error) {
    console.error("Theme settings error:", error);
    res.status(500).send("Server error");
  }
};
  exports.selectTheme = async (req, res) => {
  const { themeId } = req.body;
  const userId = req.session.userId;

  if (!themeId) {
    return res.status(400).json({ message: "Theme ID required" });
  }

  try {
    const userTheme = await UserTheme.findOneAndUpdate(
      { userId },                // find by user only
      { themeId, isActive: true },
      { new: true, upsert: true } // create if not exists
    ).populate("themeId");

    res.json({
      message: "Theme selected successfully",
      theme: userTheme.themeId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.saveDraft = async (req, res) => {
  try {
    const { themeId, customData } = req.body;
    const userId = req.session.userId;

    await UserTheme.findOneAndUpdate(
      { userId, themeId },
      {
        customData,
        status: "draft"
      },
      { upsert: true, new: true }
    );

    res.json({ message: "Draft saved successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save draft" });
  }
};
exports.publishTheme = async (req, res) => {
  try {
    const { themeId, customData } = req.body;
    const userId = req.session.userId;

    // deactivate other themes
    await UserTheme.updateMany(
      { userId },
      { isActive: false }
    );

    await UserTheme.findOneAndUpdate(
      { userId, themeId },
      {
        customData,
        status: "published",
        isActive: true
      },
      { upsert: true, new: true }
    );

    res.json({ message: "Theme published successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to publish theme" });
  }
};
