import express from "express";
import {
  createBookingController,
  getUserBookingsController,
  cancelBookingController,
} from "./booking.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createBookingController);
router.get("/me", protect, getUserBookingsController);
router.patch("/:id/cancel", protect, cancelBookingController);

export default router;