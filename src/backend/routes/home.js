// ========================================
// HOME API ROUTES
// ========================================
// MONGODB: Uncomment when ready to connect to database

const express = require('express');
const router = express.Router();

// MONGODB: Uncomment to import Home model
 const Home = require('../models/Home');

// ========================================
// GET HOME PAGE DATA
// ========================================
router.get('/', async (req, res) => {
  try {
 
    const home = await Home.findOne().sort({ updatedAt: -1 });
    if (!home) {
      return res.status(404).json({ error: 'Home page data not found' });
    }
    res.json(home);
   
  } catch (error) {
    console.error('Error fetching home page data:', error);
    res.status(500).json({ error: 'Failed to fetch home page data', message: error.message });
  }
});

// ========================================
// UPDATE HOME PAGE DATA
// ========================================
router.put('/', async (req, res) => {
  try {
    const homeData = req.body;

    let home = await Home.findOne();
    
    if (!home) {
      // Create new if doesn't exist
      home = new Home(homeData);
    } else {
      // Update existing
      Object.assign(home, homeData);
    }
    
    const savedHome = await home.save();
    
    res.json({
      message: 'Home page data updated successfully',
      data: savedHome
    });
   
  } catch (error) {
    console.error('Error updating home page data:', error);
    res.status(500).json({ error: 'Failed to update home page data', message: error.message });
  }
});

module.exports = router;
