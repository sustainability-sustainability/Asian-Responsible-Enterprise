// ========================================
// THEME MODEL
// ========================================
// MONGODB: Uncomment when ready to connect to database

 const mongoose = require('mongoose')
 const themeSchema = new mongoose.Schema({
   designTheme: {
     type: String,
     enum: ['playful', 'corporate'],
     default: 'playful'
   },
   defaultThemeMode: {
     type: String,
     enum: ['light', 'dark'],
     default: 'light'
   },
   primaryColor: {
     type: String,
     default: '#fbbf24' // Gold/Yellow
   },
   secondaryColor: {
     type: String,
     default: '#3b82f6' // Blue
   },
   accentColor: {
     type: String,
     default: '#10b981' // Green
   }
 }, {
   timestamps: true
 })
 const Theme = mongoose.model('Theme', themeSchema)
 module.exports = Theme