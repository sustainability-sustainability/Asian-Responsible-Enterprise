const mongoose = require('mongoose');

// Sub-schemas
const statSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: String,
  members: { type: Number, default: 0 },
  location: String,
  sdg: { type: Number, min: 1, max: 17, index: true },
  progress: { type: Number, default: 0 },
  category: { type: String, index: true }
}, { _id: false });

const eventSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true, index: true },
  title: { type: String, required: true },
  date: { type: Date, required: true, index: true },   // ✅ changed from String to Date
  time: { type: String },
  type: { type: String, enum: ["Virtual", "In-Person", "Hybrid"], default: "Virtual" },
  attendees: { type: Number, default: 0 },
  sdg: { type: Number, min: 1, max: 17, index: true }
}, { _id: false });

const videoSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: String,
  thumbnail: String,
  videoUrl: { type: String },
  duration: { type: Number },   // ✅ changed from String to Number
  views: { type: Number, default: 0 },
  category: { type: String, index: true },
  featured: { type: Boolean, default: false, index: true }
}, { _id: false });

const testimonialSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true, index: true },
  name: { type: String, required: true },
  role: String,
  organization: String,
  message: String,
  avatar: String,
  sdg: { type: Number, min: 1, max: 17, index: true }
}, { _id: false });

// Main Community schema
const communitySchema = new mongoose.Schema({
  stats: [statSchema],
  projects: [projectSchema],
  events: [eventSchema],
  videos: [videoSchema],
  testimonials: [testimonialSchema]
}, { timestamps: true });

// Create indexes at the top level if needed
communitySchema.index({ "projects.id": 1 });
communitySchema.index({ "events.date": 1 });
communitySchema.index({ "videos.featured": 1 });
communitySchema.index({ "testimonials.sdg": 1 });

const Community = mongoose.model('Community', communitySchema);

module.exports = Community;
