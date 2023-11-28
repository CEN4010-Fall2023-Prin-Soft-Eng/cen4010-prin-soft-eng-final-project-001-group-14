const mongoose = require('mongoose');

// dog schema for database
const dogSchema = new mongoose.Schema({
    dogId: { type: String, required: true, unique: true }, // ID from Petfinder
    name: String,
    breed: String,
    age: String,
    gender: String,
    size: String,
    color: String,
});

// dog model for database
const Dog = mongoose.model('Dog', dogSchema);

module.exports = Dog;
