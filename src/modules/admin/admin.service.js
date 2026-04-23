// services/admin.service.js
import User from '../user.model.js';
import Parking from '../parkings/parking.model.js';
import Slot from '..//slot/slot.model.js';
import Booking from '../bookings/booking.model.js';
import Payment from '../payment/payment.model.js';
import mongoose from 'mongoose';

// ---------- Dashboard Stats ----------
export const getDashboardStats = async () => {
  const totalUsers = await User.countDocuments();
  const totalParks = await Parking.countDocuments();
  const totalSlots = await Slot.countDocuments();
  const totalBookings = await Booking.countDocuments();

  const revenueAgg = await Booking.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);
  const totalRevenue = revenueAgg[0]?.total || 0;

  const activeBookings = await Booking.countDocuments({ status: 'confirmed' });
  const pendingPayments = await Booking.countDocuments({ paymentStatus: 'pending' });

  return {
    totalUsers,
    totalParks,
    totalSlots,
    totalBookings,
    totalRevenue,
    activeBookings,
    pendingPayments
  };
};

// ---------- User Management ----------
export const getAllUsers = async (filters = {}, page = 1, limit = 10) => {
  const query = {};
  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { email: { $regex: filters.search, $options: 'i' } }
    ];
  }
  const skip = (page - 1) * limit;
  const users = await User.find(query).skip(skip).limit(limit).select('-password');
  const total = await User.countDocuments(query);
  return { users, total, page, pages: Math.ceil(total / limit) };
};

export const updateUserRole = async (userId, role) => {
  const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
  if (!user) throw new Error('User not found');
  return user;
};

export const toggleUserBlock = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  user.isBlocked = !user.isBlocked; // assuming you have isBlocked field; if not, add it to schema
  await user.save();
  return user;
};

// ---------- Parking Management ----------
export const getAllParks = async (filters = {}, page = 1, limit = 10) => {
  const query = {};
  if (filters.search) {
    query.name = { $regex: filters.search, $options: 'i' };
  }
  const skip = (page - 1) * limit;
  const parks = await Parking.find(query).skip(skip).limit(limit);
  const total = await Parking.countDocuments(query);
  return { parks, total, page, pages: Math.ceil(total / limit) };
};

export const createPark = async (data) => {
  const park = new Parking(data);
  await park.save();
  return park;
};

export const updatePark = async (parkId, data) => {
  const park = await Parking.findByIdAndUpdate(parkId, data, { new: true, runValidators: true });
  if (!park) throw new Error('Park not found');
  return park;
};

export const deletePark = async (parkId) => {
  const park = await Parking.findByIdAndDelete(parkId);
  if (!park) throw new Error('Park not found');
  // Optionally delete associated slots
  await Slot.deleteMany({ parkingId });
  return park;
};

// ---------- Slot Management ----------
export const getAllSlots = async (filters = {}, page = 1, limit = 10) => {
  const query = {};
  if (filters.parkingId) query.parkingId = filters.parkingId;
  if (filters.search) {
    query.slotNumber = { $regex: filters.search, $options: 'i' };
  }
  const skip = (page - 1) * limit;
  const slots = await Slot.find(query).populate('parkingId', 'name').skip(skip).limit(limit);
  const total = await Slot.countDocuments(query);
  return { slots, total, page, pages: Math.ceil(total / limit) };
};

export const createSlot = async (data) => {
  const slot = new Slot(data);
  await slot.save();
  // Update parking totalSlots if needed? Usually you manage totalSlots separately.
  return slot;
};

export const updateSlot = async (slotId, data) => {
  const slot = await Slot.findByIdAndUpdate(slotId, data, { new: true, runValidators: true });
  if (!slot) throw new Error('Slot not found');
  return slot;
};

export const deleteSlot = async (slotId) => {
  const slot = await Slot.findByIdAndDelete(slotId);
  if (!slot) throw new Error('Slot not found');
  return slot;
};

// ---------- Booking Management (with status updates) ----------
export const getAllBookings = async (filters = {}, page = 1, limit = 10) => {
  const query = {};
  if (filters.userId) query.userId = filters.userId;
  if (filters.parkingId) query.parkingId = filters.parkingId;
  if (filters.status) query.status = filters.status;
  if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;
  if (filters.search) {
    // search by user name or parking name - we'll use aggregation or populate + match
    // For simplicity, we'll do two-step or use lookup. Let's keep simple and just use userId/parkingId search
    // Better: use aggregation with $lookup. But for brevity, we'll skip complex search.
  }
  const skip = (page - 1) * limit;
  const bookings = await Booking.find(query)
    .populate('userId', 'name email')
    .populate('parkingId', 'name')
    .populate('slotId', 'slotNumber')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  const total = await Booking.countDocuments(query);
  return { bookings, total, page, pages: Math.ceil(total / limit) };
};

export const updateBookingStatus = async (bookingId, status, paymentStatus = null) => {
  const updateData = { status };
  if (paymentStatus) updateData.paymentStatus = paymentStatus;
  const booking = await Booking.findByIdAndUpdate(bookingId, updateData, { new: true });
  if (!booking) throw new Error('Booking not found');
  return booking;
};

// ---------- Payment Management ----------
export const getAllPayments = async (filters = {}, page = 1, limit = 10) => {
  const query = {};
  if (filters.status) query.status = filters.status;
  const skip = (page - 1) * limit;
  const payments = await Payment.find(query)
    .populate('userId', 'name email')
    .populate('bookingId')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  const total = await Payment.countDocuments(query);
  return { payments, total, page, pages: Math.ceil(total / limit) };
};

// ---------- Additional Analytics ----------
export const getBookingTrends = async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const trends = await Booking.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 },
        revenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$totalPrice', 0] } }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  return trends;
};