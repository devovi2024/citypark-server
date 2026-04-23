import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

console.log("STRIPE:", process.env.STRIPE_SECRET_KEY ? "OK" : "MISSING");
console.log("MONGO_URI:", process.env.MONGO_URI ? "OK" : "MISSING");
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("DB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB Error:", err.message);
  });