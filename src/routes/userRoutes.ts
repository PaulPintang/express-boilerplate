import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  generateOTP,
  profile,
  verifyOTP,
  resetPassword,
  uploadPicture,
  deleteAccount,
} from "../controllers/userController";
import { Protected } from "../middleware/authMiddleware";

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/recover", generateOTP);
router.get("/verify", verifyOTP);
router.put("/reset", resetPassword);
router.get("/profile", Protected, profile);
router.put("/profile/update", Protected, uploadPicture);
router.delete("/profile/:id", Protected, deleteAccount);

module.exports = router;
