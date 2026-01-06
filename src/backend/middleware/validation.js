// ========================================
// VALIDATION MIDDLEWARE
// ========================================
// Validates ObjectId format for MongoDB

const mongoose = require('mongoose');

/**
 * Middleware to validate MongoDB ObjectId
 * Use this on routes that accept :id parameter
 */
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  
  // Check if id is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ 
      error: 'Invalid ID format',
      message: `The ID "${id}" is not a valid MongoDB ObjectId. MongoDB IDs must be 24 hex characters.`,
      validExample: '507f1f77bcf86cd799439011'
    });
  }
  
  next();
};

/**
 * Helper function to check if a string is a valid ObjectId
 * Use this in your code without middleware
 */
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Helper function to convert string to ObjectId
 * Use with caution - validates first
 */
const toObjectId = (id) => {
  if (!isValidObjectId(id)) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
  return new mongoose.Types.ObjectId(id);
};

module.exports = {
  validateObjectId,
  isValidObjectId,
  toObjectId
};
