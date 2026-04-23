import express from "express";
import {
  createSession,
  webhook,
  verifyPayment,
} from "./payment.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* CREATE SESSION */
router.post("/create-session", protect, createSession);

/* VERIFY */
router.get("/verify/:sessionId", protect, verifyPayment);

/* WEBHOOK */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhook
);

export default router;