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
    trim: true,
    enum: ['Community', 'Environment', 'Innovation', 'Leadership'] // ✅ optional: restrict to known categories
  },
  year: {
    type: Number,              // ✅ changed from String to Number for better sorting/filtering
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  sdg: {
    type: Number,
    min: 1,
    max: 17,
    index: true                // ✅ index for faster SDG-based queries
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

// ✅ Indexes
awardSchema.index({ year: -1, order: 1 }); // sort by year descending, then order ascending
awardSchema.index({ category: 1 });        // faster category queries
awardSchema.index({ sdg: 1 });             // faster SDG queries
awardSchema.index(
  { title: 1, organization: 1, year: 1 }, 
  { unique: true }                         // prevent duplicate awards for same title/org/year
);

const Award = mongoose.model('Award', awardSchema);

module.exports = Award;
