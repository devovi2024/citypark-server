import mongoose from "mongoose";

const parkingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Image URL (link)
    image: {
      required: true,
      type: String,
    },

    location: {
      address: {
        type: String,
        trim: true,
        required: true,
      },
      city: {
        type: String,
        trim: true,
        required: true,
      },
      lat: {
        type: Number,

      },
      lng: {
        type: Number,
      },
    },

    type: {
      type: String,
      enum: ["garage", "street", "premium", "private"],
      default: "street",
      
    },

    totalSlots: {
      type: Number,
      min: 0,
    },

    availableSlots: {
      type: Number,
      min: 0,
    },

    pricePerHour: {
      type: Number,
      min: 0,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Parking", parkingSchema);