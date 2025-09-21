// server/scripts/seed.js
// const path = require('path');
// require('dotenv').config({ path: '../.env' });
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/userModel');
const Movie = require('../models/movieModel');
const Vote = require('../models/voteModel');
const Comment = require('../models/commentModel');

connectDB();

const seedData = async () => {
  try {
    // Clear existing data
    await Comment.deleteMany();
    await Vote.deleteMany();
    await Movie.deleteMany();
    await User.deleteMany();

    console.log('Data cleared!');

    // Create users
    const admin = await User.create({
        name: 'Admin User',
        email: 'admin@moviehub.com',
        password: 'adminpass',
        role: 'ADMIN',
    });
    
    const user = await User.create({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
    });
    
    console.log('Users created!');

    // Create movies
    const movie1 = await Movie.create({ title: 'Inception', description: 'Mind-bending thriller', user: user._id });
    const movie2 = await Movie.create({ title: 'The Matrix', description: 'Classic sci-fi', user: admin._id });

    console.log('Movies created!');

    // Add votes
    await Vote.create({ user: user._id, movie: movie2._id, vote_type: 'UP' });
    await Vote.create({ user: admin._id, movie: movie1._id, vote_type: 'UP' });
    
    console.log('Data seeded!');
    process.exit();

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();