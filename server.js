import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app.js";

const MONGO_URI = process.env.MONGO_URI;

console.log("MONGO:", MONGO_URI ? "OK" : "MISSING");
console.log("STRIPE:", process.env.STRIPE_SECRET_KEY ? "OK" : "MISSING");

/* ---------------- DB CONNECT ---------------- */
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.error("DB Error:", err.message);
  });

export default app;