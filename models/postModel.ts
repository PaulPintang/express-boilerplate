import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add title"],
  },
  description: {
    type: String,
    required: [true, "Please add title description"],
  },
});

module.exports = mongoose.model("Post", postSchema);
