import express from "express";
const router = express.Router();
const {
  registerUser,
  loginUser,
  generateOTP,
  profile,
  verifyOTP,
  resetPassword,
  uploadPicture,
  deleteAccount,
} = require("../controllers/userController");
const { Protected } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/recover", generateOTP);
router.get("/verify", verifyOTP);
router.put("/reset", resetPassword);
router.get("/me", Protected, profile);
router.delete("/me/:id", Protected, deleteAccount);
router.put("/upload", uploadPicture);

module.exports = router;
