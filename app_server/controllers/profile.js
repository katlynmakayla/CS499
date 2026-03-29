const mongoose = require('mongoose');
const User = mongoose.model('users');

// GET /profile - Render the profile page
const profile = (req, res) => {
    res.render('profile');
};

// GET /api/user - Retrieve the current user's profile
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.auth._id).select('-hash -salt');
        
        if (!user) {
            return res.status(404).json({ "message": "User not found" });
        }
        
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
};

// PUT /api/user/profile - Update the user's travel preferences
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.auth._id);
        
        if (!user) {
            return res.status(404).json({ "message": "User not found" });
        }

        user.profile = {
            climate:      req.body.climate,
            activityType: req.body.activityType,
            budgetRange:  req.body.budgetRange  || user.profile?.budgetRange  || 'moderate',
            tripDuration: req.body.tripDuration || user.profile?.tripDuration || 'week'
        };

        await user.save();
        return res.status(200).json(user.profile);
    } catch (err) {
        return res.status(400).json({ "message": "Error updating profile", "error": err });
    }
};

module.exports = {
    profile,
    getUser,
    updateProfile
};