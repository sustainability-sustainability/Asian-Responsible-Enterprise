const mongoose = require('mongoose');

// ========================================
// Article Schema
// ========================================
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: true },   // ✅ indexed for faster search
  excerpt: { type: String },
  description: { type: String, required: true },
  author: { type: String, trim: true },
  date: { type: Date, required: true, index: true },                  // ✅ indexed for sorting/filtering
  image: { type: String },
  category: { type: String, required: true, index: true },
  tags: [{ type: String, index: true }],                              // ✅ indexed for tag-based queries
  sdg: { type: Number, min: 1, max: 17, index: true },
  link: { type: String }
}, { timestamps: true });

// Compound index for common queries (category + date)
articleSchema.index({ category: 1, date: -1 });

// ========================================
// Featured Video Schema
// ========================================
const featuredVideoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: true },
  description: { type: String, required: true },
  videoUrl: { type: String },
  thumbnail: { type: String, required: true },
  duration: { type: Number },                                         // ✅ changed from String to Number
  category: { type: String, index: true },
  link: { type: String }
}, { timestamps: true });

// ========================================
// Featured Story Schema
// ========================================
const featuredStorySchema = new mongoose.Schema({
  title: { type: String, trim: true, index: true },
  excerpt: { type: String },
  date: { type: Date, index: true },
  readTime: { type: String },
  category: { type: String, index: true },
  sdg: { type: Number, min: 1, max: 17, index: true },
  featured: { type: Boolean, default: false, index: true },
  image: { type: String },
  useCustomImage: { type: Boolean, default: false },
  link: { type: String }
}, { timestamps: true });

// Compound index for featured stories (featured + date)
featuredStorySchema.index({ featured: 1, date: -1 });

// ========================================
// Models
// ========================================
const Article = mongoose.model('Article', articleSchema);
const FeaturedVideo = mongoose.model('FeaturedVideo', featuredVideoSchema);
const FeaturedStory = mongoose.model('FeaturedStory', featuredStorySchema);

module.exports = { Article, FeaturedVideo, FeaturedStory };
