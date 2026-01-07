const mongoose = require('mongoose');

const eventPhotoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    required: true
  }
}, { _id: false });

const eventSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
    enum: ['January', 'February', 'March', 'April', 'May', 'June', 
           'July', 'August', 'September', 'October', 'November', 'December']
  },
  year: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  photos: [eventPhotoSchema]
}, {
  timestamps: true
});

// Index for faster queries
eventSchema.index({ year: -1, month: -1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
