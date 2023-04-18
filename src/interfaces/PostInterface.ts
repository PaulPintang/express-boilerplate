import { Schema } from "mongoose";

export interface IPost {
  user: Schema.Types.ObjectId;
  title: string;
  description: string;
}
