// server/src/routes/movieRoutes.js
const express = require('express');
const {
  getAllMovies,
  suggestMovie,
  deleteMovie,
  voteOnMovie,
  addComment,
  deleteComment,
} = require('../controllers/movieController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Routes for movies
router.route('/')
  .get(getAllMovies)
  .post(protect, suggestMovie);

router.route('/:id')
  .delete(protect, admin, deleteMovie);

// Route for voting
router.route('/:id/vote')
  .post(protect, voteOnMovie);

// Routes for comments
router.route('/:id/comments')
  .post(protect, addComment);
  
router.route('/comments/:id')
  .delete(protect, deleteComment);

module.exports = router;