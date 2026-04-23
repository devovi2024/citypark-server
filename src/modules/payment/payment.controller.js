import Booking from "../bookings/booking.model.js";
import Payment from "./payment.model.js";
import {
  createCheckoutSession,
} from "./payment.service.js";

/* ================= CREATE SESSION ================= */
export const createSession = async (req, res) => {
  try {
    const { bookingId } = req.body;

    console.log("User:", req.user);
    console.log("BookingId:", bookingId);

    if (!bookingId) {
      return res.status(400).json({ message: "bookingId missing" });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!booking.totalPrice) {
      return res.status(400).json({ message: "Price missing" });
    }

    const session = await createCheckoutSession(booking, req.user);

    return res.json({ url: session.url });
  } catch (err) {
    console.error("CREATE SESSION ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= VERIFY ================= */
export const verifyPayment = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    const payment = await Payment.findOne({
      stripeSessionId: sessionId,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    return res.json({
      status: payment.status,
      amount: payment.amount,
      bookingId: payment.bookingId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= WEBHOOK ================= */
export const webhook = async (req, res) => {
  try {
    const event = req.body;

    const { handleWebhook } = await import("./payment.service.js");
    await handleWebhook(event);

    res.json({ received: true });
  } catch (err) {
    console.error(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};