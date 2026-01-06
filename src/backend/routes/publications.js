// ========================================
// PUBLICATIONS API ROUTES
// ========================================
// MONGODB: Uncomment when ready to connect to database

const express = require('express');
const router = express.Router();
const { validateObjectId } = require('../middleware/validation');

// MONGODB: Uncomment to import Publication model
 const Publication = require('../models/Publication');

// ========================================
// GET ALL PUBLICATIONS
// ========================================
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 9 } = req.query;
    
 
    const publications = await Publication.find()
      .sort({ year: -1, order: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Publication.countDocuments();
    
    res.json({
      publications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching publications:', error);
    res.status(500).json({ error: 'Failed to fetch publications', message: error.message });
  }
});

// ========================================
// GET PUBLICATION BY ID
// ========================================
router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const { id } = req.params;
    
  
    const publication = await Publication.findById(id);
    if (!publication) {
      return res.status(404).json({ error: 'Publication not found' });
    }
    res.json(publication);
   
  } catch (error) {
    console.error('Error fetching publication:', error);
    res.status(500).json({ error: 'Failed to fetch publication', message: error.message });
  }
});

// ========================================
// CREATE NEW PUBLICATION
// ========================================
router.post('/', async (req, res) => {
  try {
    const { _id, id, ...publicationData } = req.body;

    
 
    const newPublication = new Publication(publicationData);
    const savedPublication = await newPublication.save();
    
    res.status(201).json({
      message: 'Publication created successfully',
      data: savedPublication
    });
   
  } catch (error) {
    console.error('Error creating publication:', error);
    res.status(500).json({ error: 'Failed to create publication', message: error.message });
  }
});

// ========================================
// UPDATE PUBLICATION
// ========================================
router.put('/:id', validateObjectId, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
  
    const updatedPublication = await Publication.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedPublication) {
      return res.status(404).json({ error: 'Publication not found' });
    }
    
    res.json({
      message: 'Publication updated successfully',
      data: updatedPublication
    });
  
  } catch (error) {
    console.error('Error updating publication:', error);
    res.status(500).json({ error: 'Failed to update publication', message: error.message });
  }
});

// ========================================
// DELETE PUBLICATION
// ========================================
router.delete('/:id', validateObjectId, async (req, res) => {
  try {
    const { id } = req.params;
    

    const deletedPublication = await Publication.findByIdAndDelete(id);
    
    if (!deletedPublication) {
      return res.status(404).json({ error: 'Publication not found' });
    }
    
    res.json({
      message: 'Publication deleted successfully',
      data: deletedPublication
    });
   
  } catch (error) {
    console.error('Error deleting publication:', error);
    res.status(500).json({ error: 'Failed to delete publication', message: error.message });
  }
});

module.exports = router;