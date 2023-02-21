const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  generateOTP,
  getMe,
  verifyOTP,
  resetPassword,
} = require("../controllers/userController");
const { Protected } = require("../middleware/authMiddleware");
const sendEmail = require("../services/sendEmail");

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/recover", generateOTP);
router.get("/verify", verifyOTP);
router.put("/reset", resetPassword);
router.get("/me", Protected, getMe);

module.exports = router;
