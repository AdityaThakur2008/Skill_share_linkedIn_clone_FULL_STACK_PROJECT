import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const parseCookies = (cookieHeader) => {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader
      .split("; ")
      .filter(Boolean)
      .map((cookie) => {
        const [name, ...value] = cookie.split("=");
        return [name, decodeURIComponent(value.join("="))];
      }),
  );
};

const verifyUserToken = async (req, res, next) => {
  try {
    const cookies = parseCookies(req.headers.cookie || "");
    let token = cookies.token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Authentication token required" });
    }

    const secret = process.env.JWT_SECRET || "default_jwt_secret";
    let payload;

    try {
      payload = jwt.verify(token, secret);
    } catch (verifyError) {
      return res
        .status(401)
        .json({ message: "Invalid or expired authentication token" });
    }

    const user = await User.findById(payload.id);
    if (!user || user.token !== token) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    if (!user.active) {
      return res.status(403).json({ message: "User account is inactive" });
    }

    const allowedOrigins = [process.env.FRONTEND_URL || "http://localhost:3000"];
    if (req.headers.origin && !allowedOrigins.includes(req.headers.origin)) {
      return res.status(403).json({ message: "Forbidden origin" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Error in verifyUserToken middleware:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export default verifyUserToken;
