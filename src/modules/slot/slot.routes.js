import express from "express";
import {
  getSlotsByParkingController,
  bookSlotController,
  unbookSlotController,
} from "./slot.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// GET
router.get("/parking/:parkingId", getSlotsByParkingController);

// BOOK SLOT
router.patch("/:id/book", protect, bookSlotController);

// UNBOOK SLOT
router.patch("/:id/unbook", protect, unbookSlotController);

export default router;