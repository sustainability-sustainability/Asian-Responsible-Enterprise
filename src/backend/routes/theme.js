// ========================================
// THEME API ROUTES
// ========================================
// MONGODB: Uncomment when ready to connect to database

const express = require('express');
const router = express.Router();

// MONGODB: Uncomment to import Theme model
 const Theme = require('../models/Theme');

// ========================================
// GET THEME SETTINGS
// ========================================
router.get('/', async (req, res) => {
  try {

    const theme = await Theme.findOne().sort({ updatedAt: -1 });
    if (!theme) {
      return res.status(404).json({ error: 'Theme settings not found' });
    }
    res.json(theme);
   
  } catch (error) {
    console.error('Error fetching theme settings:', error);
    res.status(500).json({ error: 'Failed to fetch theme settings', message: error.message });
  }
});

// ========================================
// UPDATE THEME SETTINGS
// ========================================
router.put('/', async (req, res) => {
  try {
    const themeData = req.body;
    

    let theme = await Theme.findOne();
    
    if (!theme) {
      // Create new if doesn't exist
      theme = new Theme(themeData);
    } else {
      // Update existing
      Object.assign(theme, themeData);
    }
    
    const savedTheme = await theme.save();
    
    res.json({
      message: 'Theme settings updated successfully',
      data: savedTheme
    });
   
  } catch (error) {
    console.error('Error updating theme settings:', error);
    res.status(500).json({ error: 'Failed to update theme settings', message: error.message });
  }
});

module.exports = router;
