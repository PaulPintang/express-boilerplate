import express from "express";
import { Protected } from "../middleware/authMiddleware";
const router = express.Router();
import {
  getPost,
  addPost,
  deletePost,
  updatePost,
} from "../controllers/postController";

router.get("/", Protected, getPost);
router.post("/add", Protected, addPost);
router.route("/:id").put(Protected, updatePost).delete(Protected, deletePost);

module.exports = router;
