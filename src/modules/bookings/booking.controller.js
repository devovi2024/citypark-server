import * as bookingService from "./booking.service.js";

// CREATE BOOKING
export const createBookingController = async (req, res) => {
  try {
    const booking = await bookingService.createBooking({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET MY BOOKINGS
export const getUserBookingsController = async (req, res) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user.id);

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// CANCEL BOOKING
export const cancelBookingController = async (req, res) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id);

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};