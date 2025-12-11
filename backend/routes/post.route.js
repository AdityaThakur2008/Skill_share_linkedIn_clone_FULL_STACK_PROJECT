import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPost,
  increment_likes,
  deleteComment,
  get_comments_by_post,
  write_comment,
} from "../controllers/post.controller.js";
import multer from "multer";
import verifyUserToken from "../middelWare/verifytoken.js";

const router = Router();


const upload = multer({ dest: "uploads/" });

router
  .route("/create_post")
  .post(upload.single("media"), verifyUserToken, createPost);
router.route("/posts").get(getAllPost);
router.route("/delete_post").delete(verifyUserToken, deletePost);
router.route("/write_comment").post(verifyUserToken, write_comment);
router.route("/get_comments").get(get_comments_by_post);
router.route("/delete_comment").delete(verifyUserToken, deleteComment);
router.route("/increment_like").post(verifyUserToken, increment_likes);

export default router;
