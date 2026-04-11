const mongoose = require("mongoose");
const User = require("../models/user");

// GET: /user - return the authenticated user's data including profile
const getProfile = async (req, res) => {
  try {
    const q = await User.findById(req.user._id).select("-hash -salt").exec();

    if (q) {
      return res.status(200).json(q);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error, please try again" });
  }
};

// PUT: /users/profile - update the authenticated user's profile preferences
const updateProfile = async (req, res) => {
  // Only allow valid profile fields through
  const allowedFields = [
    "climate",
    "activityType",
    "budgetRange",
    "tripDuration",
  ];
  const update = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      update[`profile.${field}`] = req.body[field];
    }
  }

  if (Object.keys(update).length === 0) {
    return res
      .status(400)
      .json({ message: "No valid profile fields provided" });
  }

  try {
    const q = await User.findByIdAndUpdate(
      req.user._id,
      { $set: update },
      { returnDocument: "after", runValidators: true },
    ).exec();

    if (q) {
      return res.status(200).json({ profile: q.profile });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error, please try again" });
  }
};

module.exports = { getProfile, updateProfile };
