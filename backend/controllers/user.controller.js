import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

import PDFDocument from "pdfkit";
import fs from "fs";
import Connection from "../models/connections.model.js";

export function generateResume(data) {
  const outputPath = crypto.randomBytes(16).toString("hex") + ".pdf";
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream("uploads/" + outputPath));

  if (data.userId.profilePicture) {
    try {
      doc.image(data.userId.profilePicture, 50, 40, {
        width: 80,
        height: 80,
        fit: [80, 80],
        align: "center",
      });
    } catch (err) {
      console.log("Error loading image:", err.message);
    }
  }

  doc
    .fontSize(22)
    .fillColor("#333")
    .text(
      data.userId.name || "Unknown Name",
      data.profilePicture ? 150 : 50,
      50,
    );
  doc
    .fontSize(12)
    .fillColor("#777")
    .text(
      data.location || "Location not provided",
      data.profilePicture ? 150 : 50,
      80,
    );

  doc.moveDown(2);
  drawLine(doc);

  doc.fontSize(16).fillColor("#111").text("Skills");
  doc.moveDown(0.5);
  const skillsText =
    data.skills && data.skills.length
      ? data.skills.join(", ")
      : "No skills provided";
  doc.fontSize(12).fillColor("#444").text(skillsText);
  doc.moveDown(1.5);
  drawLine(doc);

  doc.fontSize(16).fillColor("#111").text("Education");
  doc.moveDown(0.5);
  if (data.education && data.education.length > 0) {
    data.education.forEach((edu) => {
      doc.fontSize(13).fillColor("#000").text(`${edu.degree} - ${edu.school}`);
      doc
        .fontSize(11)
        .fillColor("#555")
        .text(
          `${edu.startDate.toLocaleDateString("en-GB")} - ${
            edu.endDate.toLocaleDateString("en-GB") || "Present"
          }`,
        );
      doc.moveDown(1);
    });
  } else {
    doc.text("No education details provided.");
  }
  drawLine(doc);

  doc.fontSize(16).fillColor("#111").text("Experience");
  doc.moveDown(0.5);
  if (data.workExperience && data.workExperience.length > 0) {
    data.workExperience.forEach((exp) => {
      doc
        .fontSize(13)
        .fillColor("#000")
        .text(`${exp.position} at ${exp.company}`);
      doc
        .fontSize(11)
        .fillColor("#555")
        .text(
          `${exp.startDate.toLocaleDateString("en-GB")} - ${
            exp.endDate.toLocaleDateString("en-GB") || "Present"
          }`,
        );
      if (exp.description) {
        doc
          .moveDown(0.3)
          .fontSize(11)
          .fillColor("#333")
          .text(exp.description, { align: "justify" });
      }
      doc.moveDown(1);
    });
  } else {
    doc.text("No work experience provided.");
  }

  doc.end();
  return outputPath;
}

function drawLine(doc) {
  doc
    .strokeColor("#cccccc")
    .lineWidth(1)
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .stroke();
  doc.moveDown(1);
}

export const registerUser = async (req, res) => {
  try {
    let { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exitingUser = await User.findOne({ username });

    if (exitingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }
    const exitingEmail = await User.findOne({ email });

    if (exitingEmail) {
      return res.status(409).json({ message: "email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });
    await user.save();
    const profile = new Profile({
      userId: user._id,
    });
    await profile.save();
    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = crypto.randomBytes(32).toString("hex");
    user.token = token;
    await user.save();
    return res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    const user = req.user; // from verifyUserToken

    if (!req.file) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    // ✅ multer ne file already local me save kar di
    const mediaUrl = `/profile/${req.file.filename}`;

    user.ProfilePicture = mediaUrl;
    await user.save();

    return res.status(200).json({
      message: "Profile picture uploaded successfully",
      profilePicture: mediaUrl,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...updateUserData } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, email } = updateUserData;

    const exitingUser = await User.findOne($or[{ username, email }]);

    if (exitingUser) {
      if (exitingUser || String(updateUserData._id !== String(user._id))) {
        return res.status(302).json({ message: "User Already Exists" });
      }
    }

    Object.assign(user, updateUserData);

    await user.save();

    return res.status(200).json({ message: "User Update Successfully" });
  } catch (error) {
    console.error("Error in Update User_profile", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const User_profile = await Profile.findOne({ userId })
      .populate("userId", "name username email ProfilePicture")
      .lean();
    if (!User_profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    return res.status(200).json({ User_profile });
  } catch (error) {
    console.error("Error in get User profile", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { ...profileData } = req.body;

    const profile = await Profile.findOne({ userId });

    Object.assign(profile, profileData);
    await profile.save();

    return res.status(200).json("profile updated");
  } catch (error) {
    console.error("Error in update profile", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllProfile = async (req, res) => {
  try {
    const allProfile = await Profile.find({}).populate(
      "userId",
      "name username email ProfilePicture",
    );
    return res.status(200).json({ allProfile });
  } catch (error) {
    console.error("Error in Get allUsers profile", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const downloadResume = async (req, res) => {
  try {
    const userId = req.query.Id;

    const UserData = await Profile.findById(userId).populate(
      "userId",
      "name ProfilePicture",
    );
    const url = await generateResume(UserData);
    return res.status(201).json(url);
  } catch (error) {
    console.error("Error in download resume", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const SendConnectionRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;

    const requesterId = req.user._id;

    const exixtingUser = await Connection.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId },
      ],
    });

    if (exixtingUser) {
      return res.status(302).json({ message: "connection already exist" });
    }

    const request = new Connection({
      requester: requesterId,
      recipient: recipientId,
    });
    await request.save();

    res.status(200).json({ message: "connection Request Send" });
  } catch (error) {
    console.error("Error in Send Connection Request", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const MyConnections = async (req, res) => {
  try {
    const userId = req.user._id;

    const connections = await Connection.find({
      $or: [{ requester: userId }, { recipient: userId }],
    })
      .select("requester recipient status")
      .populate("requester", "name username ProfilePicture")
      .populate("recipient", "name username ProfilePicture ");

    res.status(200).json({ connections });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const receivedConnectionRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const receivedRequests = await Connection.find({
      recipient: userId,
      status: "pending",
    }).populate("requester", "name username email ProfilePicture");
    if (!receivedRequests) {
      return res
        .status(404)
        .json({ message: "No connection requsts received" });
    }
    res.status(200).json({ receivedRequests });
  } catch (error) {
    console.error("Error in received Connection Request", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptOrReject = async (req, res) => {
  try {
    const { action_type, requesterId } = req.body;
    const userId = req.user._id;

    const connection = await Connection.findOne({
      requester: requesterId,
      recipient: userId,
      status: "pending",
    });

    if (!connection) {
      return res
        .status(404)
        .json({ message: "Connection request not found or already handled." });
    }

    if (action_type === "accept") {
      connection.status = "accepted";
    } else if (action_type === "reject") {
      connection.status = "rejected";
    } else {
      return res
        .status(400)
        .json({ message: "Invalid action type specified." });
    }

    await connection.save();

    return res.json({
      message: `Request successfully ${connection.status}.`,
      connection: connection,
    });
  } catch (error) {
    console.error("Error in acceptOrReject Request", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserProfileFormUserName = async (req, res) => {
  try {
    const { username } = req.query;

    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: "user Not found" });
    }
    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username ProfilePicture",
    );

    return res.json({ userProfile });
  } catch (error) {
    console.error("Error in acceptOrReject Request", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
