import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    parkingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parking",
      required: true,
    },

    slotNumber: {
      type: String,
      required: true,
    },

    floor: {
      type: Number,
      default: 1,
    },

    type: {
      type: String,
    },

    isBooked: {
      type: Boolean,
      default: false,
    },

    pricePerHour: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Slot", slotSchema);