// ========================================
// CONTACT API ROUTES
// ========================================

const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const ContactSubmission = require('../models/ContactSubmission');

// ========================================
// GET CONTACT DATA
// ========================================
router.get('/', async (req, res) => {
  try {
    const contact = await Contact.findOne().sort({ updatedAt: -1 });
    if (!contact) {
      return res.status(404).json({ error: 'Contact data not found' });
    }
    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact data:', error);
    res.status(500).json({ error: 'Failed to fetch contact data', message: error.message });
  }
});

// ========================================
// UPDATE CONTACT DATA (partial or full)
// ========================================
router.put('/', async (req, res) => {
  try {
    const updates = req.body; // could be full contactData or just one section
    let contact = await Contact.findOne();

    if (!contact) {
      // Create new if doesn't exist
      contact = new Contact(updates);
    } else {
      // Merge only provided fields
      Object.assign(contact, updates);
    }

    const savedContact = await contact.save();
    res.json({
      message: 'Contact data updated successfully',
      data: savedContact
    });
  } catch (error) {
    console.error('Error updating contact data:', error);
    res.status(500).json({ error: 'Failed to update contact data', message: error.message });
  }
});

// ========================================
// SUBMIT CONTACT FORM (for public submissions)
// ========================================
router.post('/submit', async (req, res) => {
  try {
    const formData = req.body;

    const submission = new ContactSubmission({
      name: formData.name,
      email: formData.email,
      organization: formData.organization,
      subject: formData.subject,
      message: formData.message,
      submittedAt: new Date()
    });

    await submission.save();

    // TODO: Send email notification

    res.status(201).json({
      message: 'Contact form submitted successfully',
      data: submission
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Failed to submit contact form', message: error.message });
  }
});

module.exports = router;
