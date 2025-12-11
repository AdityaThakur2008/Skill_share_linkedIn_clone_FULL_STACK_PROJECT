import User from "../models/user.model.js";

const verifyUserToken = async (req, res, next) => {
  try {
    let token = req.body?.token;

    if (!token) {
      token = req.query?.token;
    }

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error("Error in verifyUserToken middleware:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export default verifyUserToken;
