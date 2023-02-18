const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  generateOTP,
  getMe,
} = require("../controllers/userController");
const protected = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/recover", generateOTP);
router.get("/me", protected, getMe);

module.exports = router;
