const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  video: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: false });

const homeSchema = new mongoose.Schema({
  heroTitle: {
    type: String,
    required: true,
    trim: true
  },
  heroDescription: {
    type: String,
    required: true
  },
  heroImage: {
    type: String,
    required: true
  },
  heroVideo: {
    type: String
  },
  sections: [sectionSchema]
}, {
  timestamps: true
});

const Home = mongoose.model('Home', homeSchema);

module.exports = Home;
