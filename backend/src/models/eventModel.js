const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  payRate: {
    type: Number,
    required: true,
    description: "Pay per hour or per event",
  },
  volunteersRequired: {
    type: Number,
    required: true,
  },
  volunteersApplied: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    enum: ["Concert", "Sports", "Festival", "Conference", "Other"],
    default: "Other",
  },
  image: {
    type: String,
    default: "https://via.placeholder.com/300x200?text=Event",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", eventSchema);
