const express = require("express");
const router = express.Router();
const eventModel = require("../models/eventModel");

// Get all events
router.get("/events", async (req, res) => {
  try {
    const events = await eventModel.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single event by ID
router.get("/events/:id", async (req, res) => {
  try {
    const event = await eventModel.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create event (admin only - for now, anyone can create)
router.post("/events", async (req, res) => {
  try {
    const { name, description, date, location, payRate, volunteersRequired, category, image } = req.body;

    const event = new eventModel({
      name,
      description,
      date,
      location,
      payRate,
      volunteersRequired,
      category,
      image,
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Apply for event
router.post("/events/:id/apply", async (req, res) => {
  try {
    const event = await eventModel.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if already at capacity
    if (event.volunteersApplied >= event.volunteersRequired) {
      return res.status(400).json({ error: "Event is at full capacity" });
    }

    event.volunteersApplied += 1;
    await event.save();
    res.json({ message: "Successfully applied", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
