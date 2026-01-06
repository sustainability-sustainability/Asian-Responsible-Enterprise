// ========================================
// COMMUNITY API ROUTES
// ========================================

const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require("multer");
const fs = require("fs");

// Multer setup (temp storage)
const upload = multer({ dest: "uploads/", limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB


// Cloudinary config (make sure env vars are set)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// MONGODB: Community model
const Community = require('../models/Community');

// ========================================
// GET COMMUNITY DATA
// ========================================
router.get('/', async (req, res) => {
  try {
    const community = await Community.findOne().sort({ updatedAt: -1 });
    if (!community) {
      return res.status(404).json({ error: 'Community data not found' });
    }
    res.json(community);
  } catch (error) {
    console.error('Error fetching community data:', error);
    res.status(500).json({ error: 'Failed to fetch community data', message: error.message });
  }
});

// ========================================
// UPDATE COMMUNITY DATA
// ========================================
router.put('/', async (req, res) => {
  try {
    // ✅ Sanitize videos payload before saving
    const cleanData = {
      ...req.body,
      videos: (req.body.videos || []).map(v => ({
        id: v.id,
        title: v.title,
        description: v.description,
        thumbnail: v.thumbnail && v.thumbnail.startsWith("http") ? v.thumbnail : null,
        videoUrl: v.videoUrl && v.videoUrl.startsWith("http") ? v.videoUrl : null,
        duration: v.duration,
        views: v.views,
        category: v.category,
        featured: v.featured,
      }))
    };

    let community = await Community.findOne();

    if (!community) {
      community = new Community(cleanData);
    } else {
      Object.assign(community, cleanData);
    }

    const savedCommunity = await community.save();

    res.json({
      message: 'Community data updated successfully',
      data: savedCommunity
    });
  } catch (error) {
    console.error('Error updating community data:', error);
    res.status(500).json({ error: 'Failed to update community data', message: error.message });
  }
});


// ========================================
// ADD TESTIMONIAL
// ========================================
router.post('/testimonial', async (req, res) => {
  try {
    const testimonialData = req.body;

    let community = await Community.findOne();
    if (!community) {
      community = new Community({ testimonials: [] });
    }

    community.testimonials.push(testimonialData);
    const savedCommunity = await community.save();

    res.status(201).json({
      message: 'Testimonial added successfully',
      data: savedCommunity
    });
  } catch (error) {
    console.error('Error adding testimonial:', error);
    res.status(500).json({ error: 'Failed to add testimonial', message: error.message });
  }
});

// ========================================
// UPDATE TESTIMONIAL
// ========================================
router.put('/testimonial/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const testimonialData = req.body;

    const community = await Community.findOne();
    if (!community) {
      return res.status(404).json({ error: 'Community data not found' });
    }

    const testimonialIndex = community.testimonials.findIndex(t => t.id.toString() === id);
    if (testimonialIndex === -1) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    community.testimonials[testimonialIndex] = {
      ...community.testimonials[testimonialIndex],
      ...testimonialData
    };

    const savedCommunity = await community.save();

    res.json({
      message: 'Testimonial updated successfully',
      data: savedCommunity
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ error: 'Failed to update testimonial', message: error.message });
  }
});

// ========================================
// DELETE TESTIMONIAL
// ========================================
router.delete('/testimonial/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const community = await Community.findOne();
    if (!community) {
      return res.status(404).json({ error: 'Community data not found' });
    }

    community.testimonials = community.testimonials.filter(t => t.id.toString() !== id);
    const savedCommunity = await community.save();

    res.json({
      message: 'Testimonial deleted successfully',
      data: savedCommunity
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Failed to delete testimonial', message: error.message });
  }
});

// ========================================
// UPLOAD VIDEO TO CLOUDINARY
// ========================================
// UPLOAD VIDEO TO CLOUDINARY
// ========================================
// UPLOAD VIDEO TO CLOUDINARY
// ========================================
router.post("/upload-video", upload.single("video"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No video file uploaded" });
    }

    // Upload to Cloudinary as a video
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "video",
    });

    // Clean up temp file
    try {
      fs.unlinkSync(file.path);
    } catch (e) {
      console.warn("Cleanup failed:", e);
    }

    // Return only the Cloudinary URL (send once!)
    return res.json({ videoUrl: result.secure_url });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res
      .status(500)
      .json({ error: "Video upload failed", message: error.message });
  }
});


// ========================================
// UPLOAD IMAGE TO CLOUDINARY
// ========================================
router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    console.log("Received file:", req.file);
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "image",
    });

    try { fs.unlinkSync(file.path); } catch (e) { console.warn("Cleanup failed:", e); }

    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error("Cloudinary image upload error:", error);
    res.status(500).json({ error: "Image upload failed", message: error.message });
  }
});


module.exports = router;
