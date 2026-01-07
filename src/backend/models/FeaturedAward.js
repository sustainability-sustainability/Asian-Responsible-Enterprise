const mongoose = require('mongoose');

const featuredAwardSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: true },   // ✅ indexed for faster search
  organization: { type: String, required: true, trim: true, index: true },
  category: { 
    type: String, 
    required: true, 
    trim: true, 
    enum: ['Community', 'Environment', 'Innovation', 'Leadership'], // ✅ optional: restrict to known categories
    index: true
  },
  year: { 
    type: Number,   // ✅ changed from String to Number for proper sorting/filtering
    required: true,
    index: true
  },
  description: { type: String, required: true },
  sdg: { type: Number, min: 1, max: 17, index: true }, // ✅ index for SDG-based queries
  color: { type: String, default: 'from-yellow-400 to-yellow-600' },
  image: { type: String, default: '' },
  order: { type: Number, default: 0, index: true }
}, { timestamps: true });

// ✅ Compound indexes
featuredAwardSchema.index({ year: -1, order: 1 }); // sort by year descending, then order ascending
featuredAwardSchema.index({ title: 1, organization: 1, year: 1 }, { unique: true }); // prevent duplicates

const FeaturedAward = mongoose.model('FeaturedAward', featuredAwardSchema);

module.exports = FeaturedAward;
