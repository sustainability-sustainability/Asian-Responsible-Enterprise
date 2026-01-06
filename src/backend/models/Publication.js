const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    required: true
  },
  pdfFile: {
    type: String,
    required: false
  },
  readOnlineUrl: {
    type: String,
    required: false
  },
  downloadUrl: {
    type: String,
    required: false
  },
  year: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  pages: {
    type: Number,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  tableOfContents: {
    type: [String],
    default: []
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
publicationSchema.index({ year: -1, order: 1 });

const Publication = mongoose.model('Publication', publicationSchema);

module.exports = Publication;
