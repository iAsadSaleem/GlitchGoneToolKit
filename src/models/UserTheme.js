const mongoose = require("mongoose");

const userThemeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    themeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "themes",
      required: true
    },

    // User customized theme data
    customData: {
      type: Map,
      of: String
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft"
    },

    isActive: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserTheme", userThemeSchema);
