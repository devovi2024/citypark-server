import app from "../app.js";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

/* ---- prevent multiple connections (IMPORTANT) ---- */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  cached.conn = await mongoose.connect(MONGO_URI);
  console.log("DB Connected (Vercel)");
  return cached.conn;
}

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}