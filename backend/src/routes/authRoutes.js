const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

router.post("/signup", authController.signup);
router.post("/verify-email", authController.verifyEmail);
router.post("/signin", authController.signin);
router.get("/me", requireAuth, authController.me);

module.exports = router;
