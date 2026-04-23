import Parking from "./parking.model.js";

export const createParking = async (data) => {
  return Parking.create(data);
};

export const getAllParkings = async () => {
  return Parking.find();
};

export const getParkingById = async (id) => {
  return Parking.findById(id);
};

export const updateParking = async (id, data) => {
  return Parking.findByIdAndUpdate(id, data, { new: true });
};

export const deleteParking = async (id) => {
  return Parking.findByIdAndDelete(id);
};