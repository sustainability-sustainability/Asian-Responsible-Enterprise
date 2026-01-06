// ========================================
// USER MODEL (for authentication)
// ========================================
// MONGODB: Uncomment when ready to connect to database

 const mongoose = require('mongoose')
 const userSchema = new mongoose.Schema({
   email: {
     type: String,
     required: true,
     unique: true,
     trim: true,
     lowercase: true
   },
   password: {
     type: String,
     // Not required if using Google OAuth
     required: function() {
       return !this.googleId;
     }
   },
   name: {
     type: String,
     required: true,
     trim: true
   },
   googleId: {
     type: String,
     unique: true,
     sparse: true // Allows null values but ensures uniqueness when set
   },
   profilePicture: {
     type: String
   },
   authProvider: {
     type: String,
     enum: ['email', 'google'],
     default: 'email'
   },
   role: {
     type: String,
     enum: ['admin', 'editor', 'viewer'],
     default: 'admin'
   },
   isActive: {
     type: Boolean,
     default: true
   },
   lastLogin: {
     type: Date
   }
 }, {
   timestamps: true
 })
 // Index for faster queries
 userSchema.index({ email: 1 });
 userSchema.index({ googleId: 1 })
 const User = mongoose.model('User', userSchema)
 module.exports = User;