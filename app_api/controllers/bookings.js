const mongoose = require('mongoose');
require('../models/bookings');
const Booking = mongoose.model('Booking');
const Trip = require('../models/travlr');

// POST: /bookings - create a new booking for the authenticated user
const bookingsCreate = async (req, res) => {
    // Validate required fields
    if (!req.body.tripId || !req.body.travelDate) {
        return res
            .status(400)
            .json({ message: 'tripId and travelDate are required' });
    }

    // Check that the referenced trip exists
    const trip = await Trip.findById(req.body.tripId).exec();
    if (!trip) {
        return res
            .status(404)
            .json({ message: 'Trip not found' });
    }

    const newBooking = new Booking({
        userId:     req.user._id,
        tripId:     req.body.tripId,
        travelDate: req.body.travelDate,
        status:     'pending'
    });

    try {
        const q = await newBooking.save();
        if (q) {
            // Populate trip details before returning
            const populated = await q.populate('tripId', 'name description perPerson');
            return res
                .status(201)
                .json(populated);
        } else {
            return res
                .status(400)
                .json({ message: 'Booking could not be created' });
        }
    } catch (err) {
        // Handle duplicate booking (compound unique index violation)
        if (err.code === 11000) {
            return res
                .status(409)
                .json({ message: 'You already have a booking for this trip on that date' });
        }
        console.error(err);
        return res
            .status(500)
            .json({ message: 'Server error, please try again' });
    }
};

// GET: /bookings/mine - return all bookings for the authenticated user
const bookingsMine = async (req, res) => {
    const q = await Booking
        .find({ userId: req.user._id })
        .populate('tripId', 'name description perPerson image')
        .exec();

    if (!q || q.length === 0) {
        return res
            .status(404)
            .json({ message: 'No bookings found' });
    } else {
        return res
            .status(200)
            .json(q);
    }
};

// GET: /bookings/all - return all bookings (admin only)
const bookingsAll = async (req, res) => {
    const q = await Booking
        .find()
        .populate('userId', 'email')
        .populate('tripId', 'name perPerson')
        .exec();

    if (!q || q.length === 0) {
        return res
            .status(404)
            .json({ message: 'No bookings found' });
    } else {
        return res
            .status(200)
            .json(q);
    }
};

// PATCH: /bookings/:id/cancel - cancel a booking (owner or admin only)
const bookingsCancel = async (req, res) => {
    const q = await Booking
        .findById(req.params.id)
        .exec();

    if (!q) {
        return res
            .status(404)
            .json({ message: 'Booking not found' });
    }

    // Allow only the booking owner or an admin to cancel
    if (q.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res
            .status(403)
            .json({ message: 'Forbidden' });
    }

    q.status = 'cancelled';

    try {
        const saved = await q.save();
        return res
            .status(200)
            .json(saved);
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: 'Server error, please try again' });
    }
};

module.exports = { bookingsCreate, bookingsMine, bookingsAll, bookingsCancel };
