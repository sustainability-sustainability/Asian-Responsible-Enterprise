const mongoose = require('mongoose');

const eventPhotoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true
  },
  caption: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const eventSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
    enum: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    index: true // ✅ faster month-based queries
  },
  year: {
    type: Number,
    required: true,
    index: true // ✅ faster year-based queries
  },
  title: {
    type: String,
    required: true,
    trim: true,
    index: true // ✅ useful if you search events by title
  },
  description: {
    type: String,
    required: true
  },
  photos: [eventPhotoSchema]
}, {
  timestamps: true
});

// ✅ Compound index for sorting/filtering by year + month
eventSchema.index({ year: -1, month: -1 });

// ✅ Prevent duplicate events for same title/year/month
eventSchema.index({ title: 1, year: 1, month: 1 }, { unique: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
