import * as slotService from "./slot.service.js";

export const createSlotController = async (req, res) => {
  try {
    const slot = await slotService.createSlot(req.body);
    res.status(201).json(slot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSlots = async (req, res) => {
  const slots = await slotService.getAllSlots();
  res.json(slots);
};

export const getSlot = async (req, res) => {
  const slot = await slotService.getSlotById(req.params.id);
  res.json(slot);
};

export const getSlotsByParkingController = async (req, res) => {
  const slots = await slotService.getSlotsByParking(
    req.params.parkingId
  );
  res.json(slots);
};

export const updateSlotController = async (req, res) => {
  const slot = await slotService.updateSlot(
    req.params.id,
    req.body
  );
  res.json(slot);
};

export const deleteSlotController = async (req, res) => {
  await slotService.deleteSlot(req.params.id);
  res.json({ message: "Slot deleted" });
};

export const bookSlotController = async (req, res) => {
  const slot = await slotService.bookSlot(req.params.id);
  res.json(slot);
};

export const unbookSlotController = async (req, res) => {
  const slot = await slotService.unbookSlot(req.params.id);
  res.json(slot);
};