const mongoose = require('mongoose');
require('../models/travlr'); 
require('../models/user');
const Trip = mongoose.model('Trip');
const User = mongoose.model('users');

const getRecommendations = async (req, res) => {
    try {
        // Fetch User Profile using req.user._id from JWT
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ "message": "User not found" });

        // Get All Trips
        const trips = await Trip.find({});
        const profile = user.profile;

        // Define Algorithm Weights
        const weights = { budgetRange: 4, activityType: 3, climate: 2, tripDuration: 1 };

        // Score each trip
        const scoredTrips = trips.map(trip => {
            let score = 0;
            const matches = [];
            //console.log(`User Profile Budget Range: ${profile.budgetRange} vs Trip Tag: ${trip.tags?.budgetRange}`);
            //console.log(`User Profile Activity Type: ${profile.activityType} vs Trip Tag: ${trip.tags?.activityType}`);
            //console.log(`User Profile Climate: ${profile.climate} vs Trip Tag: ${trip.tags?.climate}`);
            //console.log(`User Profile Trip Duration: ${profile.tripDuration} vs Trip Tag: ${trip.tags?.tripDuration}`);
            for (const field in weights) {
                if (trip.tags && trip.tags[field] === profile[field]) {
                    score += weights[field];
                    matches.push(field);
                }
            }
            return { ...trip.toObject(), score, matches };
        });

        // Sort and Return Top 5
        const topResults = scoredTrips
            .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
            .slice(0, 5);
        console.log("Top 5 Scored Trips:", topResults.map(t => ({ name: t.name, score: t.score })));

        return res.status(200).json(topResults);
    } catch (err) {
        return res.status(500).json(err);
    }
};

module.exports = { getRecommendations };
