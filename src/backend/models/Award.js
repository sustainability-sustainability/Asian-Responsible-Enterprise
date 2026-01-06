const mongoose = require('mongoose');

const awardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  organization: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  sdg: {
    type: Number,
    min: 1,
    max: 17
  },
  color: {
    type: String,
    default: 'from-yellow-400 to-yellow-600'
  },
  image: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
awardSchema.index({ year: -1, order: 1 });

const Award = mongoose.model('Award', awardSchema);

module.exports = Award;
