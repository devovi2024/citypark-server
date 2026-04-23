import * as userService from "./user.service.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

/* ---------------- REGISTER ---------------- */
export const registerUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- LOGIN ---------------- */
export const loginUser = async (req, res) => {
  try {
    const user = await userService.findUserByEmail(req.body.email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- GET USER ---------------- */
export const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- UPDATE USER ---------------- */
export const updateUserController = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(
      req.user.id,
      req.body
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------- DELETE USER ---------------- */
export const deleteUserController = async (req, res) => {
  try {
    await userService.deleteUser(req.user.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};