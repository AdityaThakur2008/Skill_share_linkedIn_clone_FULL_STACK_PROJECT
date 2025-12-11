import { request } from "express";
import mongoose from "mongoose";
import { type } from "os";
import { ref } from "process";

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [{ type: mongoose.Schema.ObjectId, ref: "User", required: true }],
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
  media: {
    type: String,
    default: "",
  },
  active: {
    type: Boolean,
    default: true,
  },
  filetype: {
    type: String,
    default: "",
  },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
