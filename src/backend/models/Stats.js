const mongoose = require('mongoose');

const StatSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
});

// This will create a "stats" collection in MongoDB
module.exports = mongoose.model('Stats', StatSchema);
