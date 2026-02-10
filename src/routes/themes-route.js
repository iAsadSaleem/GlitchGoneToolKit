const express = require("express");
const router = express.Router();

const { themes,getAllThemes,activateTheme,updateTheme,createTheme,getActiveTheme }  = require("../controllers/themes");

router.get("/themes", themes);
router.get("/", getAllThemes);

router.put("/activate/:id", activateTheme);

router.put("/:id", updateTheme);

router.post("/", createTheme);

router.get("/active", getActiveTheme);

module.exports = router;