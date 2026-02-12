const express = require("express");
const router = express.Router();
const themeController = require("../controllers/theme.controller");

const { themes,getAllThemes,activateTheme,updateTheme,createTheme,getActiveTheme, }  = require("../controllers/themes");

router.get("/themes", themes);
router.get("/", getAllThemes);

router.put("/activate/:id", activateTheme);

router.put("/:id", updateTheme);

router.post("/", createTheme);

router.get("/active", getActiveTheme);
router.post("/select", themeController.selectTheme);
router.post("/draft", themeController.saveDraft);
router.post("/publish", themeController.publishTheme);


module.exports = router;