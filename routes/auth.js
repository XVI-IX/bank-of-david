const express = require("express");
const router = express.Router();

const { login, signup, testing } = require("../controllers/auth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/testing", testing);

module.exports = router;