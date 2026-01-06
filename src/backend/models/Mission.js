const mongoose = require('mongoose');

const pillarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'from-yellow-500 to-yellow-600'
  }
}, { _id: false });

const objectiveSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'from-yellow-500 to-yellow-600'
  }
}, { _id: false });

const missionSchema = new mongoose.Schema({
  content: {
    heroTitle: {
      type: String,
      required: true,
      trim: true
    },
    heroSubtitle: {
      type: String,
      required: true
    },
    pillars: [pillarSchema],
    objectives: [objectiveSchema]
  }
}, {
  timestamps: true
});

const Mission = mongoose.model('Mission', missionSchema);

module.exports = Mission;
