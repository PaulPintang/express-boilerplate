import { Request, Response, NextFunction } from "express";
const Post = require("../models/postModel");

const getPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

const addPost = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description } = req.body;
  try {
    const post = await Post.create({
      title,
      description,
    });
    res.json(post);
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    res.json({ DELETED: post });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      title: req.body.title,
    });
    res.json(post);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPost,
  addPost,
  deletePost,
  updatePost,
};
