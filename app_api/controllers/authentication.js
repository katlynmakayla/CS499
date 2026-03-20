const mongoose = require("mongoose");
const User = require("../models/user");
const passport = require("passport");

const register = async (req, res) => {
  // Validate message to ensure that all parameters are correct
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: "All fields required" });
  }

  // adding try catch block to handle duplicate user info
try {
  const user = new User({
    name: req.body.name, // set user name
    email: req.body.email, // set email address
    password: "", // start with empty password
  });
  user.setPassword(req.body.password); // set user password
  const q = await user.save();
  //inverted logic per code standards
  if (q) {
    // return new user token
    const token = user.generateJWT();
    return res.status(200).json(token);
  } else {
    // database returned no data
    return res.status(400).json(err);
  }
  } catch (err) {
    // Handle Mongo duplicate key error
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(409).json({ message: "User already exists" });
    }
    console.error(err);
    return res.status(500).json({ message: "Server error, please try again" });
  }
};

const login = (req, res) => {
  // Validate message to ensure that email and password are present.
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "All fields required" });
  }
  // Delegate authentication to passport module
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      // Error in Authentication Process
      return res.status(404).json(err);
    }
    if (user) {
      // Auth succeeded - generate JWT and return to caller
      const token = user.generateJWT();
      res.status(200).json({ token });
    } else {
      // Auth failed return error
      res.status(401).json(info);
    }
  })(req, res);
};
module.exports = {
  register,
  login,
};
