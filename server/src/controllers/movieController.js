// src/controllers/movieController.js
const Movie = require('../../models/movieModel');
const Vote = require('../../models/voteModel');
const Comment = require('../../models/commentModel');

// GET /api/movies
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.aggregate([
      {
        $lookup: { // Join with votes collection
          from: 'votes',
          localField: '_id',
          foreignField: 'movie',
          as: 'votes'
        }
      },
      {
        $addFields: { // Calculate score
          score: {
            $subtract: [
              { $size: { $filter: { input: '$votes', as: 'vote', cond: { $eq: ['$$vote.vote_type', 'UP'] } } } },
              { $size: { $filter: { input: '$votes', as: 'vote', cond: { $eq: ['$$vote.vote_type', 'DOWN'] } } } }
            ]
          }
        }
      },
      { $sort: { score: -1, createdAt: -1 } } // Sort by score, then by date
    ]);

    // Mongoose aggregation doesn't automatically populate, so we do it manually
    await Movie.populate(movies, { path: 'user', select: 'name' });

    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/movies
exports.suggestMovie = async (req, res) => {
  const { title, description } = req.body;
  try {
    const movie = await Movie.create({ title, description, user: req.user.userId });
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ error: 'Could not suggest movie' });
  }
};

// POST /api/movies/:id/vote
exports.voteOnMovie = async (req, res) => {
  const { voteType } = req.body; // 'UP' or 'DOWN'
  try {
    const existingVote = await Vote.findOne({ user: req.user.userId, movie: req.params.id });
    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        await existingVote.deleteOne();
        res.json({ message: 'Vote removed' });
      } else {
        existingVote.vote_type = voteType;
        await existingVote.save();
        res.json(existingVote);
      }
    } else {
      const newVote = await Vote.create({ user: req.user.userId, movie: req.params.id, vote_type: voteType });
      res.status(201).json(newVote);
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// ADMIN routes
exports.deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ error: 'Movie not found' });
        
        // Also delete associated votes and comments
        await Vote.deleteMany({ movie: movie._id });
        await Comment.deleteMany({ movie: movie._id });
        await movie.deleteOne();
        
        res.json({ message: 'Movie removed' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// (Comment controllers would follow a similar pattern)
// POST /api/movies/:id/comments - Add a comment
exports.addComment = async (req, res) => {
    const movieId = parseInt(req.params.id);
    const userId = req.user.userId;
    const { body } = req.body;

    try {
        const comment = await prisma.comment.create({
            data: { body, userId, movieId },
            include: { user: { select: { name: true } } }
        });
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ error: 'Could not add comment' });
    }
};

// DELETE /api/comments/:id - Delete a comment (Admin only)
exports.deleteComment = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.comment.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: 'Comment not found' });
    }
};