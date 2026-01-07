const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true              // ✅ faster search by title
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
    type: String
  },
  readOnlineUrl: {
    type: String
  },
  downloadUrl: {
    type: String
  },
  year: {
    type: Number,            // ✅ changed from String to Number for proper sorting/filtering
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    index: true              // ✅ faster category queries
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
    default: 0,
    index: true              // ✅ useful for custom ordering
  }
}, {
  timestamps: true
});

// ✅ Compound indexes
publicationSchema.index({ year: -1, order: 1 }); // sort by year descending, then order ascending
publicationSchema.index({ category: 1, year: -1 }); // common query: publications per category by year

// ✅ Prevent duplicate entries for same title + year
publicationSchema.index({ title: 1, year: 1 }, { unique: true });

const Publication = mongoose.model('Publication', publicationSchema);

module.exports = Publication;
