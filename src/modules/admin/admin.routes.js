import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";
import * as adminController from "./admin.controller.js";

const router = express.Router();

router.use(protect, adminOnly);

// Dashboard
router.get("/dashboard/stats", adminController.getDashboardStats);
router.get("/analytics/trends", adminController.getBookingTrends);

// Users
router.get("/users", adminController.getAllUsers);
router.put("/users/:userId/role", adminController.updateUserRole);
router.patch("/users/:userId/block", adminController.toggleUserBlock);

// Parks
router.get("/parks", adminController.getAllParks);
router.post("/parks", adminController.createPark);
router.put("/parks/:parkId", adminController.updatePark);
router.delete("/parks/:parkId", adminController.deletePark);

// Slots
router.get("/slots", adminController.getAllSlots);
router.post("/slots", adminController.createSlot);
router.put("/slots/:slotId", adminController.updateSlot);
router.delete("/slots/:slotId", adminController.deleteSlot);

// Bookings
router.get("/bookings", adminController.getAllBookings);
router.patch("/bookings/:bookingId/status", adminController.updateBookingStatus);

// Payments
router.get("/payments", adminController.getAllPayments);

export default router;