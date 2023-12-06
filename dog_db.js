const mongoose = require('mongoose');

// Enhanced dog schema for database
const dogSchema = new mongoose.Schema({
    dogId: { type: String, required: true, unique: true }, // ID from Petfinder
});

// Create dog model
const Dog = mongoose.model('Dog', dogSchema);

module.exports = Dog;
