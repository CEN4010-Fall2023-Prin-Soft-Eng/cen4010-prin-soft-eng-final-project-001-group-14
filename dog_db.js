const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    age: Number,
    zipCode: Number,
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 8);
    next();
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Enhanced dog schema for database
const dogSchema = new mongoose.Schema({
    dogId: { type: String, required: true, unique: true }, // ID from Petfinder
});

// Create dog model
const Dog = mongoose.model('Dog', dogSchema);
// Create user model
const User = mongoose.model('User', userSchema);

module.exports = { User, Dog };
