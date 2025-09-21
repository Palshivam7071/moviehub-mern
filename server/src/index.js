// server/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');

const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');

connectDB(); // Connect to MongoDB

const app = express();
const PORT = process.env.PORT || 5001;

// app.use(cors());
app.use(cors({
  origin: "https://movie-chat-nj7a.onrender.com/",
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => res.send('MovieHub API Running'));

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));