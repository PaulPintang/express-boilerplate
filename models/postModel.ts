import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
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

export default mongoose.model("Post", postSchema);
