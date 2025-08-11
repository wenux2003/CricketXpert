// In models/userModel.js

const mongoose = require('mongoose');

// Define the schema for the users collection
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true }, // User's login name, must be unique [cite: 7, 202]
    email: { type: String, unique: true, required: true }, // User's email, must be unique [cite: 8, 203]
    passwordHash: { type: String, required: true }, // The encrypted password [cite: 9, 204]
    role: {
        type: String,
        // Role must be one of the values in this list [cite: 10, 207]
        enum: ['admin', 'coach', 'player', 'supplier', 'order_manager', 'ground_manager', 'service_manager', 'delivery_staff'],
        default: 'player' // If no role is specified, it defaults to 'player' [cite: 208]
    },
    firstName: String, // User's first name [cite: 11, 210]
    lastName: String, // User's last name [cite: 12, 211]
    contactNumber: String, // User's phone number [cite: 13, 212]
    address: String, // User's address [cite: 14, 213]
    profileImageURL: String, // URL for the user's profile picture [cite: 15, 214]
    status: {
        type: String,
        enum: ['active', 'suspended', 'deactivated'], // Status must be one of these values [cite: 16, 215]
        default: 'active' // New users are 'active' by default [cite: 215]
    },
    salary: Number, // Optional field for staff members [cite: 17, 216]
    createdAt: { type: Date, default: Date.now }, // Sets the creation date automatically [cite: 18, 217]
    updatedAt: Date, // Will be updated by the middleware before saving [cite: 19, 218]
});

// Middleware to automatically update the 'updatedAt' field before any save operation [cite: 220]
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now(); // Sets updatedAt to the current time [cite: 221]
    next(); // Proceeds to the next step (saving the document) [cite: 222]
});

// Create the 'User' model from the schema
const User = mongoose.model('User', userSchema);

// Export the model to be used in other files
module.exports = User;