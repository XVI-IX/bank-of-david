const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/verify-email");
router.post('/forgotPassword');
router.post('/validateResetToken');
router.put('/resetPassword');
router.post("/changePin/:id")
// router.get("/testing", testing);

module.exports = router;