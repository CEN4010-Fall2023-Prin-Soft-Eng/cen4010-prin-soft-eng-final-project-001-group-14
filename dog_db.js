const mongoose = require('mongoose');

// Enhanced dog schema for database
const dogSchema = new mongoose.Schema({
    dogId: { type: String, required: true, unique: true }, // ID from Petfinder
    name: String,
    breed: {
        primary: String,
        secondary: String,
        mixed: Boolean,
        unknown: Boolean
    },
    age: String,
    gender: String,
    size: String,
    color: {
        primary: String,
        secondary: String,
        tertiary: String
    },
    coat: String,
    attributes: {
        spayed_neutered: Boolean,
        house_trained: Boolean,
        declawed: Boolean,
        special_needs: Boolean,
        shots_current: Boolean
    },
    environment: {
        children: Boolean,
        dogs: Boolean,
        cats: Boolean
    },
    tags: [String],
    description: String,
    photos: [{
        small: String,
        medium: String,
        large: String,
        full: String
    }],
    videos: [{
        embed: String
    }],
    status: String,
    status_changed_at: Date,
    published_at: Date,
    organization_id: String,
    url: String
});

// dog model for database
const Dog = mongoose.model('Dog', dogSchema);

module.exports = Dog;
