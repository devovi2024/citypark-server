import Slot from "./slot.model.js";
import Parking from "../parkings/parking.model.js";

// CREATE SLOT
export const createSlot = async (data) => {
  const slot = await Slot.create(data);

  await Parking.findByIdAndUpdate(data.parkingId, {
    $inc: { totalSlots: 1, availableSlots: 1 },
  });

  return slot;
};

// GET ALL
export const getAllSlots = async () => {
  return Slot.find().populate("parkingId");
};

// GET BY ID
export const getSlotById = async (id) => {
  return Slot.findById(id).populate("parkingId");
};

// GET BY PARKING
export const getSlotsByParking = async (parkingId) => {
  return Slot.find({ parkingId });
};

// UPDATE
export const updateSlot = async (id, data) => {
  return Slot.findByIdAndUpdate(id, data, { new: true });
};

// DELETE
export const deleteSlot = async (id) => {
  const slot = await Slot.findByIdAndDelete(id);

  if (slot) {
    await Parking.findByIdAndUpdate(slot.parkingId, {
      $inc: { totalSlots: -1, availableSlots: -1 },
    });
  }

  return slot;
};

// BOOK SLOT
export const bookSlot = async (id) => {
  const slot = await Slot.findByIdAndUpdate(
    id,
    { isBooked: true },
    { new: true }
  );

  if (slot) {
    await Parking.findByIdAndUpdate(slot.parkingId, {
      $inc: { availableSlots: -1 },
    });
  }

  return slot;
};

// UNBOOK SLOT
export const unbookSlot = async (id) => {
  const slot = await Slot.findByIdAndUpdate(
    id,
    { isBooked: false },
    { new: true }
  );

  if (slot) {
    await Parking.findByIdAndUpdate(slot.parkingId, {
      $inc: { availableSlots: 1 },
    });
  }

  return slot;
};