import * as adminService from './admin.service.js';

// Dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Users
export const getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await adminService.getAllUsers({ search }, page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await adminService.updateUserRole(userId, role);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const toggleUserBlock = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await adminService.toggleUserBlock(userId);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Parks
export const getAllParks = async (req, res) => {
  try {
    const { search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await adminService.getAllParks({ search }, page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPark = async (req, res) => {
  try {
    const park = await adminService.createPark(req.body);
    res.status(201).json(park);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePark = async (req, res) => {
  try {
    const { parkId } = req.params;
    const park = await adminService.updatePark(parkId, req.body);
    res.json(park);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deletePark = async (req, res) => {
  try {
    const { parkId } = req.params;
    await adminService.deletePark(parkId);
    res.json({ message: 'Park deleted successfully' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Slots
export const getAllSlots = async (req, res) => {
  try {
    const { parkingId, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await adminService.getAllSlots({ parkingId, search }, page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSlot = async (req, res) => {
  try {
    const slot = await adminService.createSlot(req.body);
    res.status(201).json(slot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const slot = await adminService.updateSlot(slotId, req.body);
    res.json(slot);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteSlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    await adminService.deleteSlot(slotId);
    res.json({ message: 'Slot deleted successfully' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Bookings
export const getAllBookings = async (req, res) => {
  try {
    const { userId, parkingId, status, paymentStatus, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await adminService.getAllBookings({ userId, parkingId, status, paymentStatus, search }, page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, paymentStatus } = req.body;
    if (!status && !paymentStatus) {
      return res.status(400).json({ message: 'At least one field (status or paymentStatus) is required' });
    }
    const booking = await adminService.updateBookingStatus(bookingId, status, paymentStatus);
    res.json(booking);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Payments
export const getAllPayments = async (req, res) => {
  try {
    const { status } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await adminService.getAllPayments({ status }, page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Analytics
export const getBookingTrends = async (req, res) => {
  try {
    const trends = await adminService.getBookingTrends();
    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};