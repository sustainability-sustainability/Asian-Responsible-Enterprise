const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
const { validateObjectId } = require('../middleware/validation');
const { Article, FeaturedVideo, FeaturedStory } = require('../models/News');

// ========================================
// GET ALL NEWS (articles + videos + stories)
// ========================================
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find().sort({ date: -1 });
    const videos = await FeaturedVideo.find().sort({ createdAt: -1 });
    const stories = await FeaturedStory.find().sort({ date: -1 });

    res.json({ articles, videos, stories });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news', message: error.message });
  }
});

// ========================================
// ARTICLE CRUD
// ========================================
router.get('/articles', async (req, res) => {
  try {
    const articles = await Article.find().sort({ date: -1 });
    res.json({ articles });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles', message: error.message });
  }
});

router.get('/article/:id', validateObjectId, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch article', message: error.message });
  }
});

router.post('/article', async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    const saved = await newArticle.save();
    res.status(201).json({ message: 'Article added successfully', data: saved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add article', message: error.message });
  }
});

router.put('/article/:id', validateObjectId, async (req, res) => {
  try {
    const updated = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Article not found' });
    res.json({ message: 'Article updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update article', message: error.message });
  }
});

router.delete('/article/:id', validateObjectId, async (req, res) => {
  try {
    const deleted = await Article.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Article not found' });
    res.json({ message: 'Article deleted successfully', data: deleted });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete article', message: error.message });
  }
});

// ========================================
// VIDEO CRUD
// ========================================
router.get('/videos', async (req, res) => {
  try {
    const videos = await FeaturedVideo.find().sort({ createdAt: -1 });
    res.json({ videos });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos', message: error.message });
  }
});

router.get('/video/:id', validateObjectId, async (req, res) => {
  try {
    const video = await FeaturedVideo.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch video', message: error.message });
  }
});

router.post('/video', async (req, res) => {
  try {
    const newVideo = new FeaturedVideo(req.body);
    const saved = await newVideo.save();
    res.status(201).json({ message: 'Video added successfully', data: saved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add video', message: error.message });
  }
});

router.put('/video/:id', validateObjectId, async (req, res) => {
  try {
    const updated = await FeaturedVideo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Video not found' });
    res.json({ message: 'Video updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update video', message: error.message });
  }
});

router.delete('/video/:id', validateObjectId, async (req, res) => {
  try {
    const deleted = await FeaturedVideo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Video not found' });
    res.json({ message: 'Video deleted successfully', data: deleted });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete video', message: error.message });
  }
});

// ========================================
// STORY CRUD
// ========================================
router.get('/stories', async (req, res) => {
  try {
    const stories = await FeaturedStory.find().sort({ date: -1 });
    res.json({ stories });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stories', message: error.message });
  }
});

router.get('/story/:id', validateObjectId, async (req, res) => {
  try {
    const story = await FeaturedStory.findById(req.params.id);
    if (!story) return res.status(404).json({ error: 'Story not found' });
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch story', message: error.message });
  }
});

router.post('/story', async (req, res) => {
  try {
    const newStory = new FeaturedStory(req.body);
    const saved = await newStory.save();
    res.status(201).json({ message: 'Story added successfully', data: saved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add story', message: error.message });
  }
});

router.put('/story/:id', validateObjectId, async (req, res) => {
  try {
    const updated = await FeaturedStory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Story not found' });
    res.json({ message: 'Story updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update story', message: error.message });
  }
});

router.delete('/story/:id', validateObjectId, async (req, res) => {
  try {
    const deleted = await FeaturedStory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Story not found' });
    res.json({ message: 'Story deleted successfully', data: deleted });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete story', message: error.message });
  }
});

// ========================================
// BULK UPDATE NEWS (articles + videos + stories)
// ========================================
router.put('/all', async (req, res) => {
  let { articles = [], videos = [], stories = [] } = req.body;
  const errors = {};

  // ✅ Sanitize _id fields before insert
  articles = articles.map(a => {
    if (!mongoose.isValidObjectId(a._id)) {
      delete a._id;
    }
    return a;
  });
  videos = videos.map(v => {
    if (!mongoose.isValidObjectId(v._id)) {
      delete v._id;
    }
    return v;
  });
  stories = stories.map(s => {
    if (!mongoose.isValidObjectId(s._id)) {
      delete s._id;
    }
    return s;
  });

  // Articles
  try {
    await Article.deleteMany({});
    if (articles.length) await Article.insertMany(articles);
  } catch (err) {
    console.error('Article insert failed:', err.message);
    errors.articles = err.message;
  }

  // Videos
  try {
    await FeaturedVideo.deleteMany({});
    if (videos.length) await FeaturedVideo.insertMany(videos);
  } catch (err) {
    console.error('Video insert failed:', err.message);
    errors.videos = err.message;
  }

  // Stories
  try {
    await FeaturedStory.deleteMany({});
    if (stories.length) await FeaturedStory.insertMany(stories);
  } catch (err) {
    console.error('Story insert failed:', err.message);
    errors.stories = err.message;
  }

  res.json({ message: 'News update attempted', errors });
});
module.exports = router;
