const mongoose = require("mongoose");
// Define the trip schema
const tripSchema = new mongoose.Schema({
  code: { type: String, required: true, index: true },
  name: { type: String, required: true, index: true },
  length: { type: String, required: true },
  start: { type: Date, required: true },
  resort: { type: String, required: true },
  perPerson: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
   tags: {
    climate: String,
    activityType: String,
    budgetRange: String,
    tripDuration: String
  }
});
const Trip = mongoose.model("Trip", tripSchema); // had to change to 'Trip' to match mongoose.model usage
module.exports = Trip;
