import express from "express";
import {
  createParkingController,
  getParkings,
  getParking,
  updateParkingController,
  deleteParkingController,
} from "./parking.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createParkingController);

router.get("/", getParkings);
router.get("/:id", getParking);

router.put("/:id", protect, updateParkingController);
router.delete("/:id", protect, deleteParkingController);

export default router;