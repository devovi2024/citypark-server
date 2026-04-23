import Stripe from "stripe";
import Payment from "./payment.model.js";
import Booking from "../bookings/booking.model.js";

/* ================= SAFE STRIPE GETTER ================= */
const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    console.error("❌ STRIPE_SECRET_KEY missing in .env");
    return null;
  }

  return new Stripe(key, {
    apiVersion: "2024-06-20",
  });
};

/* ================= CREATE CHECKOUT ================= */
export const createCheckoutSession = async (booking, user) => {
  const stripe = getStripe();

  if (!stripe) {
    throw new Error("Stripe is not initialized (check .env)");
  }

  if (!booking) throw new Error("Booking not found");
  if (!user?._id) throw new Error("User not found");

  const price = Number(booking.totalPrice);

  if (!price || price <= 0) {
    throw new Error("Invalid booking price");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",

    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Parking Booking - ${booking._id}`,
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: 1,
      },
    ],

    success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,

    metadata: {
      bookingId: booking._id.toString(),
      userId: user._id.toString(),
    },
  });

  await Payment.create({
    bookingId: booking._id,
    userId: user._id,
    amount: price,
    stripeSessionId: session.id,
    status: "pending",
  });

  return session;
};

/* ================= VERIFY ================= */
export const verifyCheckoutSession = async (sessionId) => {
  const payment = await Payment.findOne({ stripeSessionId: sessionId });

  if (!payment) {
    throw new Error("Payment not found");
  }

  return payment;
};

/* ================= WEBHOOK ================= */
export const handleWebhook = async (event) => {
  try {
    const session = event.data.object;

    if (event.type === "checkout.session.completed") {
      await Payment.findOneAndUpdate(
        { stripeSessionId: session.id },
        { status: "paid" }
      );

      const bookingId = session.metadata?.bookingId;

      if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, {
          status: "confirmed",
          paymentStatus: "paid",
        });
      }
    }

    if (event.type === "checkout.session.expired") {
      await Payment.findOneAndUpdate(
        { stripeSessionId: session.id },
        { status: "failed" }
      );
    }
  } catch (err) {
    console.error("Webhook Error:", err.message);
  }
};