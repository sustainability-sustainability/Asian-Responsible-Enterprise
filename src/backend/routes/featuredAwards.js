const express = require('express');
const router = express.Router();
const FeaturedAward = require('../models/FeaturedAward');

// GET all featured awards
router.get('/', async (req, res) => {
  const awards = await FeaturedAward.find().sort({ year: -1, order: 1 });
  res.json(awards);
});

// CREATE featured award
router.post('/', async (req, res) => {
  const newAward = new FeaturedAward(req.body);
  const saved = await newAward.save();
  res.status(201).json(saved);
});

// UPDATE featured award
router.put('/:id', async (req, res) => {
  const updated = await FeaturedAward.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE featured award
router.delete('/:id', async (req, res) => {
  const deleted = await FeaturedAward.findByIdAndDelete(req.params.id);
  res.json(deleted);
});

module.exports = router;
