import comments from "../models/comments.model.js";
import Post from "../models/post.model.js";
import { uploadPostMedia } from "../utils/upload.js";

export const createPost = async (req, res) => {
  try {
    const userId = req.user._id;
    let mediaUrl = "";
    let fileType = "";

    if (req.file !== undefined) {
      const uploadUrl = await uploadPostMedia(req.file.path);
      mediaUrl = uploadUrl;
      fileType = req.file.mimetype.split("/")[1];
    }

    const newPost = new Post({
      userId,
      body: req.body.body,
      media: req.file !== undefined ? mediaUrl : "",
      filetype: req.file !== undefined ? req.file.mimetype.split("/")[1] : "",
    });

    await newPost.save();
    return res.status(201).json({ message: "post Created" });
  } catch (error) {
    console.log("Something Went Wrong In Create post", error.message);
    return res.status(500).json({ message: "Server Side Error" });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      " username name email ProfilePicture"
    );
    return res.json({ posts });
  } catch (error) {
    console.log("Something Went Wrong In Get all post", error);
    return res.status(500).json({ message: "Server Side Error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.body;

    const post = await Post.findById(postId);

    if (post.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    await post.deleteOne();

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log("Something Went Wrong In delete post", error);
    return res.status(500).json({ message: "Server Side Error" });
  }
};

export const get_comments_by_post = async (req, res) => {
  try {
    const postId = req.query.postId;

    const allcomments = await comments
      .find({ postId })
      .populate("userId", "username name");
    return res.json( allcomments.reverse() );
  } catch (error) {
    console.log("Something Went Wrong in get comments by  post", error);
    return res.status(500).json({ message: "Server Side Error" });
  }
};

export const write_comment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId, body } = req.body;

    const comment = new comments({
      userId,
      postId,
      body,
    });

    await comment.save();

    return res.status(201).json({
      message: "Comment added successfully",
    });
  } catch (error) {
    console.log("Something Went Wrong in write comment", error);
    return res.status(500).json({ message: "Server Side Error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { commentId } = req.body;

    const comment = await comments.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this comment" });
    }

    await comment.deleteOne();

    return res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.log("Something Went Wrong in delete comment", error);
    return res.status(500).json({ message: "Server Side Error" });
  }
};

export const increment_likes = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    const alreadyLiked = await post.likedBy.includes(userId);

    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
      post.likes -= 1;
      await post.save();

      return res.status(200).json({
        message: "Post unliked",
        likes: post.likes,
      });
    } else {
      post.likedBy.push(userId);
      post.likes += 1;
      await post.save();

      return res.status(200).json({
        message: "Post liked",
        likes: post.likes,
      });
    }
  } catch (error) {
    console.log("Something Went Wrong in increment likes", error);
    return res.status(500).json({ message: "Server Side Error" });
  }
};
