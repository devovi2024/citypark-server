import * as parkingService from "./parking.service.js";

export const createParkingController = async (req, res) => {
  try {
    const parking = await parkingService.createParking(req.body);
    res.status(201).json(parking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getParkings = async (req, res) => {
  const data = await parkingService.getAllParkings();
  res.json(data);
};

export const getParking = async (req, res) => {
  const data = await parkingService.getParkingById(req.params.id);
  res.json(data);
};

export const updateParkingController = async (req, res) => {
  const data = await parkingService.updateParking(
    req.params.id,
    req.body
  );
  res.json(data);
};

export const deleteParkingController = async (req, res) => {
  await parkingService.deleteParking(req.params.id);
  res.json({ message: "Parking deleted" });
};