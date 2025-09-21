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

router.get('/', getAllMovies);
router.post('/', protect, suggestMovie);
router.delete('/:id', protect, admin, deleteMovie);

router.post('/:id/vote', protect, voteOnMovie);
router.post('/:id/comments', protect, addComment);

router.delete('/comments/:id', protect, admin, deleteComment);

module.exports = router;