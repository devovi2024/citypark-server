import User from "../modules/user.model.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your_secret_key";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // 🔥 full DB user object

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};