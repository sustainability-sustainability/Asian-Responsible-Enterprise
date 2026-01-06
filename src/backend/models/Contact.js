const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  contactInfo: [
    {
      title: String,
      content: String,
      description: String,
      color: String
    }
  ],
  quickLinks: [
    {
      id: Number,
      label: String,
      url: String,
      active: Boolean
    }
  ],
  location: {
    address: String,
    city: String,
    businessHours: {
      monday: String,
      tuesday: String,
      wednesday: String,
      thursday: String,
      friday: String,
      saturday: String,
      sunday: String
    },
    mapEmbedUrl: String,
    googleMapsLink: String
  },
  faqs: [
    {
      id: Number,
      question: String,
      answer: String,
      category: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Contact', ContactSchema);
