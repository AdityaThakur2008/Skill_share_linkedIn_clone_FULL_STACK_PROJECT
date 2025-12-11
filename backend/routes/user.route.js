import { Router } from "express";
import multer from "multer";
import {
  registerUser,
  loginUser,
  uploadProfilePicture,
  updateUserProfile,
  getUserAndProfile,
  updateProfile,
  downloadResume,
  getAllProfile,
  SendConnectionRequest,
  receivedConnectionRequests,
  connectionSendByMe,
  acceptOrReject,
} from "../controllers/user.controller.js";
import verifyUserToken from "../middelWare/verifytoken.js";
const router = Router();

const upload = multer({ dest: "uploads/" });
router
  .route("/update_profile_picture")
  .post(upload.single("profile_picture"),verifyUserToken, uploadProfilePicture);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/update_userProfile").post(updateUserProfile);
router.route("/get_user_and_profile").get(verifyUserToken, getUserAndProfile);
router.route("/update_profile").post(verifyUserToken, updateProfile);
router.route("/user/get_all_usersProfile").get(getAllProfile);
router.route("/user/download_resume").get(downloadResume);
router
  .route("/user/send_connection_request")
  .post(verifyUserToken, SendConnectionRequest);
router
  .route("/user/getConnectionRequests")
  .get(verifyUserToken, receivedConnectionRequests);
router
  .route("/user/user_connection_request")
  .get(verifyUserToken, connectionSendByMe);
router
  .route("/user/accept_connection_request")
  .post(verifyUserToken, acceptOrReject);

export default router;
