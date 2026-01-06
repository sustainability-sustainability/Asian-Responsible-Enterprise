const express = require('express');
const router = express.Router();
const Mission = require('../models/Mission');

// ========================================
// GET MISSION DATA
// ========================================
router.get('/', async (req, res) => {
  try {
    const mission = await Mission.findOne().sort({ updatedAt: -1 });
    if (!mission) {
      return res.json({
        content: null
      });
    }
    res.json(mission);
  } catch (error) {
    console.error('Error fetching mission data:', error);
    res.status(500).json({ error: 'Failed to fetch mission data', message: error.message });
  }
});

// ========================================
// UPDATE MISSION DATA
// ========================================
router.put('/', async (req, res) => {
  try {
    const missionData = req.body;
    
    let mission = await Mission.findOne();
    
    if (!mission) {
      // Create new if doesn't exist
      mission = new Mission(missionData);
    } else {
      // Update existing
      Object.assign(mission, missionData);
    }
    
    const savedMission = await mission.save();
    
    res.json({
      message: 'Mission data updated successfully',
      data: savedMission
    });
  } catch (error) {
    console.error('Error updating mission data:', error);
    res.status(500).json({ error: 'Failed to update mission data', message: error.message });
  }
});

module.exports = router;
