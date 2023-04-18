import { Schema, model } from "mongoose";
import { IPost } from "../interfaces/PostInterface";

const postSchema = new Schema<IPost>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: [true, "Please add title"],
  },
  description: {
    type: String,
    required: [true, "Please add title description"],
  },
});

export default model<IPost>("Post", postSchema);
