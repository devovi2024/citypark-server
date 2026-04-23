import Booking from "./booking.model.js";
import Slot from "../slot/slot.model.js";
import Parking from "../parkings/parking.model.js";

// CREATE
export const createBooking = async (data) => {
  const slot = await Slot.findById(data.slotId);

  if (!slot || slot.isBooked) {
    throw new Error("Slot not available");
  }

  const start = new Date(data.startTime);
  const end = new Date(data.endTime);

  const hours = Math.max((end - start) / (1000 * 60 * 60), 1);
  const totalPrice = hours * slot.pricePerHour;

  const booking = await Booking.create({
    ...data,
    totalPrice,
  });

  await Slot.findByIdAndUpdate(data.slotId, { isBooked: true });

  await Parking.findByIdAndUpdate(data.parkingId, {
    $inc: { availableSlots: -1 },
  });

  return booking;
};

// GET USER BOOKINGS
export const getUserBookings = async (userId) => {
  return Booking.find({ userId })
    .populate("parkingId")
    .populate("slotId")
    .sort({ createdAt: -1 });
};

// CANCEL
export const cancelBooking = async (id) => {
  const booking = await Booking.findById(id);

  if (!booking) throw new Error("Booking not found");

  booking.status = "cancelled";
  await booking.save();

  await Slot.findByIdAndUpdate(booking.slotId, { isBooked: false });

  await Parking.findByIdAndUpdate(booking.parkingId, {
    $inc: { availableSlots: 1 },
  });

  return booking;
};