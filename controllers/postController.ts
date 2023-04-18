import { Request, Response, NextFunction } from "express";
import Post from "../models/postModel";

export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await Post.find({ user: res.locals.user._id });
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const addPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description } = req.body;
  try {
    const post = await Post.create({
      user: res.locals.user._id,
      title,
      description,
    });
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    res.json({ DELETED: post });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (
  req: Request<{ id: string }, {}, { title: string; description: string }, {}>,
  res: Response,
  next: NextFunction
) => {
  const { title, description } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
      },
      {
        new: true,
      }
    );
    res.json(post);
  } catch (error) {
    next(error);
  }
};
