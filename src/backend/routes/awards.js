const express = require('express');
const router = express.Router();
const { validateObjectId } = require('../middleware/validation');
const Award = require('../models/Award');
const Stats = require('../models/Stats');

// ========================================
// GET ALL AWARDS (with stats from DB)
// ========================================
router.get('/', async (req, res) => {
  try {
    const awards = await Award.find().sort({ year: -1, order: 1 });

    // Load stats from DB
    const stats = await Stats.find({});

    res.json({
      awards,
      stats
    });
  } catch (error) {
    console.error('Error fetching awards:', error);
    res.status(500).json({ error: 'Failed to fetch awards', message: error.message });
  }
});

// ========================================
// GET ACHIEVEMENT STATS
// ========================================
router.get('/stats', async (req, res) => {
  try {
    const stats = await Stats.find({});
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats', message: error.message });
  }
});

// ========================================
// UPDATE ACHIEVEMENT STATS
// ========================================
router.put('/stats', async (req, res) => {
  try {
    const { stats } = req.body;

    // Clear old stats and insert new ones
    await Stats.deleteMany({});
    await Stats.insertMany(stats);

    res.json({ message: 'Stats updated successfully', data: stats });
  } catch (error) {
    console.error('Error updating stats:', error);
    res.status(500).json({ error: 'Failed to update stats', message: error.message });
  }
});

// ========================================
// GET AWARD BY ID
// ========================================
router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const { id } = req.params;
    const award = await Award.findById(id);
    if (!award) {
      return res.status(404).json({ error: 'Award not found' });
    }
    res.json(award);
  } catch (error) {
    console.error('Error fetching award:', error);
    res.status(500).json({ error: 'Failed to fetch award', message: error.message });
  }
});

// ========================================
// CREATE NEW AWARD
// ========================================
router.post('/', async (req, res) => {
  try {
    const awardData = req.body;
    const newAward = new Award(awardData);
    const savedAward = await newAward.save();
    res.status(201).json({ message: 'Award created successfully', data: savedAward });
  } catch (error) {
    console.error('Error creating award:', error);
    res.status(500).json({ error: 'Failed to create award', message: error.message });
  }
});

// ========================================
// UPDATE AWARD
// ========================================
router.put('/:id', validateObjectId, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedAward = await Award.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedAward) {
      return res.status(404).json({ error: 'Award not found' });
    }
    res.json({ message: 'Award updated successfully', data: updatedAward });
  } catch (error) {
    console.error('Error updating award:', error);
    res.status(500).json({ error: 'Failed to update award', message: error.message });
  }
});

// ========================================
// DELETE AWARD
// ========================================
router.delete('/:id', validateObjectId, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAward = await Award.findByIdAndDelete(id);
    if (!deletedAward) {
      return res.status(404).json({ error: 'Award not found' });
    }
    res.json({ message: 'Award deleted successfully', data: deletedAward });
  } catch (error) {
    console.error('Error deleting award:', error);
    res.status(500).json({ error: 'Failed to delete award', message: error.message });
  }
});

// ========================================
// BULK UPDATE AWARDS (for reordering)
// ========================================
router.put('/bulk/update', async (req, res) => {
  try {
    const { awards } = req.body;
    const updatePromises = awards.map(award =>
      Award.findByIdAndUpdate(award._id, award, { new: true })
    );
    const updatedAwards = await Promise.all(updatePromises);
    res.json({ message: 'Awards updated successfully', data: updatedAwards });
  } catch (error) {
    console.error('Error bulk updating awards:', error);
    res.status(500).json({ error: 'Failed to bulk update awards', message: error.message });
  }
});

module.exports = router;
