const mongoose = require('mongoose');

// Sub-schemas
const statSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: String,
  members: { type: Number, default: 0 },
  location: String,
  sdg: { type: Number, min: 1, max: 17 },
  progress: { type: Number, default: 0 },
  category: String
}, { _id: false });

const eventSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  date: String,
  time: String,
  type: { type: String, enum: ["Virtual", "In-Person", "Hybrid"], default: "Virtual" },
  attendees: { type: Number, default: 0 },
  sdg: { type: Number, min: 1, max: 17 }
}, { _id: false });

const videoSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: String,
  thumbnail: String,
  videoUrl: { type: String },
  duration: String,
  views: { type: Number, default: 0 },
  category: String,
  featured: { type: Boolean, default: false }
}, { _id: false });

const testimonialSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  role: String,
  organization: String,
  message: String,
  avatar: String,
  sdg: { type: Number, min: 1, max: 17 }
}, { _id: false });

// Main Community schema
const communitySchema = new mongoose.Schema({
  stats: [statSchema],
  projects: [projectSchema],
  events: [eventSchema],
  videos: [videoSchema],
  testimonials: [testimonialSchema]
}, { timestamps: true });

const Community = mongoose.model('Community', communitySchema);

module.exports = Community;
