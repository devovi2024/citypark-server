import express from "express";
import cors from "cors";

/* ROUTES */
import userRoutes from "./src/modules/user.routes.js";
import parkingRoutes from "./src/modules/parkings/parking.routes.js";
import slotRoutes from "./src/modules/slot/slot.routes.js";
import bookingRoutes from "./src/modules/bookings/booking.routes.js";
import paymentRoutes from "./src/modules/payment/payment.routes.js";
import adminRoute from "./src/modules/admin/admin.routes.js";

const app = express();

/* WEBHOOK FIRST (IMPORTANT) */
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

/* CORS */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://citypark-smartpark-system-client.vercel.app",
    ],
    credentials: true,
  })
);

/* BODY PARSER */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* HEALTH */
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

/* ROUTES */
app.use("/api/users", userRoutes);
app.use("/api/parkings", parkingRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoute);

/* 404 */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ERROR HANDLER */
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;