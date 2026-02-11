const mongoose = require("mongoose");

const themes = new mongoose.Schema(
  {
    themeName: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    themeData: { type: Map, of: String, required: true },
    createdBy: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("themes", themes);
