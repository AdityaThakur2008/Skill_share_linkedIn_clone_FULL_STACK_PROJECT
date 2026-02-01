import { Console } from "console";
import cloudinary from "./cloudinary.js";
import fs from "fs";

export const uploadPostMedia = async (filePath) => {
  try {
    console.log(filePath);
    const res = await cloudinary.uploader.upload(filePath, {
      folder: "posts",
      resource_type: "auto",
    });
    fs.unlinkSync(filePath);
    return res.secure_url;
  } catch (err) {
    console.log("Post media upload error:", err);
    return null;
  }
};
