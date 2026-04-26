const multer = require('multer');
const { storage } = require('../config/cloudinary');

// Isko hum routes mein use karenge image handle karne ke liye
const upload = multer({ storage: storage });

module.exports = upload;