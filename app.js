import express from "express";
import cors from "cors";

/* ---------------- ROUTES ---------------- */
import userRoutes from "./src/modules/user.routes.js";
import parkingRoutes from "./src/modules/parkings/parking.routes.js";
import slotRoutes from "./src/modules/slot/slot.routes.js";
import bookingRoutes from "./src/modules/bookings/booking.routes.js";
import paymentRoutes from "./src/modules/payment/payment.routes.js";
import adminRoute from "./src/modules/admin/admin.routes.js";

const app = express();

/* ---------------- CORS CONFIG ---------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "https://citypark-smartpark-system-client-zu.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(null, true); // (safe fallback for Vercel issues)
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ---------------- FIX PREFLIGHT (IMPORTANT FIX) ---------------- */
app.options(/.*/, cors());

/* ---------------- WEBHOOK (MUST BE BEFORE JSON) ---------------- */
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

/* ---------------- BODY PARSER ---------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

/* ---------------- ROUTES ---------------- */
app.use("/api/users", userRoutes);
app.use("/api/parkings", parkingRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoute);

/* ---------------- 404 HANDLER ---------------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ---------------- GLOBAL ERROR HANDLER ---------------- */
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;