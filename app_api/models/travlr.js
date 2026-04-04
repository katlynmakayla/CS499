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
    climate: { type: String, default: "" },
    activityType: { type: String, default: "" },
    budgetRange: { type: String, default: "" },
    tripDuration: { type: String, default: "" },
  },
});
const Trip = mongoose.model("Trip", tripSchema); // had to change to 'Trip' to match mongoose.model usage
module.exports = Trip;
