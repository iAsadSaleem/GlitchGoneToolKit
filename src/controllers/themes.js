const themes = require("../models/theme");


exports.themes = async (req, res) => {
  try {
    console.log('API hit');
    const allThemes = await themes.find(); // get all documents
    console.log(allThemes,'API hit');
    res.status(200).json({
      success: true,
      data: allThemes
    });
  } catch (error) {
    console.error("Error fetching themes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllThemes = async (req, res) => {
  try {
    const themesdata = await themes.find().select("themeName imageUrl isActive").sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: themesdata
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
exports.getActiveTheme = async (req, res) => {
  try {
    const theme = await themes.findOne({ isActive: true });

    if (!theme) {
      return res.status(404).json({
        success: false,
        message: "No active theme found"
      });
    }

    res.status(200).json({
      success: true,
      data: theme
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
exports.createTheme = async (req, res) => {
  try {
    const { themeName, imageUrl, themeData, isActive } = req.body;

    if (!themeName || !imageUrl || !themeData) {
      return res.status(400).json({
        success: false,
        message: "themeName, imageUrl and themeData are required"
      });
    }

    // 🔥 If new theme is active → deactivate all others
    if (isActive === true) {
      await themes.updateMany({}, { isActive: false });
    }

    const theme = await themes.create({
      themeName,
      imageUrl,
      themeData,
      isActive: isActive || false
    });

    res.status(201).json({
      success: true,
      message: "Theme created successfully",
      data: theme
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
exports.updateTheme = async (req, res) => {
  try {
    const { id } = req.params;
    const { themeName, imageUrl, themeData, isActive } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Theme ID required" });
    }

    // 🔥 Handle active theme logic
    if (isActive === true) {
      await themes.updateMany({}, { isActive: false });
    }

    const updatedTheme = await themes.findByIdAndUpdate(
      id,
      {
        ...(themeName && { themeName }),
        ...(imageUrl && { imageUrl }),
        ...(themeData && { themeData }),
        ...(typeof isActive === "boolean" && { isActive })
      },
      { new: true }
    );

    if (!updatedTheme) {
      return res.status(404).json({ message: "Theme not found" });
    }

    res.status(200).json({
      success: true,
      message: "Theme updated successfully",
      data: updatedTheme
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
exports.activateTheme = async (req, res) => {
  try {
    const { id } = req.params;

    await themes.updateMany({}, { isActive: false });

    const theme = await themes.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!theme) {
      return res.status(404).json({ message: "Theme not found" });
    }

    res.status(200).json({
      success: true,
      message: "Theme activated successfully",
      data: theme
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
