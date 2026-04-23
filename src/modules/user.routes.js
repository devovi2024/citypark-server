import express from "express";
import {
  registerUser,
  loginUser,
  updateUserController,
  getUser,
  deleteUserController,
} from "./user.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", protect, getUser);
router.put("/update", protect, updateUserController);
router.delete("/delete", protect, deleteUserController);

export default router;