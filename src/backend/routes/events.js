// ========================================
// EVENTS API ROUTES
// ========================================

const express = require('express');
const router = express.Router();
const { validateObjectId } = require('../middleware/validation');
const Event = require('../models/Event');

// ========================================
// GET ALL EVENTS
// ========================================
// GET ALL EVENTS
router.get('/', async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = {};
    if (month) query.month = month;
    if (year) query.year = parseInt(year);

    const events = await Event.find(query).sort({ year: -1, month: -1 });

    // ✅ Fallback: if no events exist, return a placeholder
    if (!events || events.length === 0) {
      return res.json([{
        _id: null,
        month: 'N/A',
        year: new Date().getFullYear(),
        title: 'No events available',
        description: 'There are currently no events in the database.',
        photos: []
      }]);
    }

    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events', message: error.message });
  }
});

// ========================================
// GET EVENT BY ID
// ========================================
router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event', message: error.message });
  }
});

// ========================================
// CREATE NEW EVENT
// ========================================
router.post('/', async (req, res) => {
  try {
    const { _id, id, ...eventData } = req.body; // strip out bad IDs
    const newEvent = new Event({
      ...eventData,
      photos: eventData.photos || [] // ensure photos is always an array
    });
    const savedEvent = await newEvent.save();

    res.status(201).json({
      message: 'Event created successfully',
      data: savedEvent
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event', message: error.message });
  }
});

// ========================================
// UPDATE EVENT
// ========================================
router.put('/:id', validateObjectId, async (req, res) => {
  try {
    const { _id, id: bodyId, ...updateData } = req.body; // strip out bad IDs

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event', message: error.message });
  }
});

// ========================================
// DELETE EVENT
// ========================================
router.delete('/:id', validateObjectId, async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      message: 'Event deleted successfully',
      data: deletedEvent
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event', message: error.message });
  }
});

module.exports = router;
