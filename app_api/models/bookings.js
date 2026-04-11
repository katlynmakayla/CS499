const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  tripId:     { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
  status:     { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending", required: true },
  travelDate: { type: Date, required: true },
  createdAt:  { type: Date, default: Date.now }
});

// Prevents a user from booking the same trip on the same date twice
bookingSchema.index({ userId: 1, tripId: 1, travelDate: 1 }, { unique: true });

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
