const express = require("express");
const router = express.Router();

const { signup, login ,logout,getProfile} = require("../controllers/auth.controller");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getprofile", getProfile);


module.exports = router;
