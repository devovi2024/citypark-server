import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    amount: Number,

    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    stripeSessionId: String,
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);