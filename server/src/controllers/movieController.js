// server/src/controllers/movieController.js
const Movie = require('../../models/movieModel');
const Vote = require('../../models/voteModel');
const Comment = require('../../models/commentModel');

// GET /api/movies
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find({})
      .populate('user', 'name')
      .populate({
        path: 'comments',
        options: { sort: { createdAt: -1 } },
        populate: { path: 'user', select: 'name' }
      })
      .lean();

    const moviesWithScores = await Promise.all(
      movies.map(async (movie) => {
        const upvotes = await Vote.countDocuments({ movie: movie._id, vote_type: 'UP' });
        const downvotes = await Vote.countDocuments({ movie: movie._id, vote_type: 'DOWN' });
        return { ...movie, score: upvotes - downvotes };
      })
    );

    moviesWithScores.sort((a, b) => b.score - a.score);
    res.json(moviesWithScores);
  } catch (error) {
    console.error('Error in getAllMovies:', error); // Log the actual error on the server
    res.status(500).json({ error: error.message });
  }
};

// POST /api/movies/:id/comments
exports.addComment = async (req, res) => {
    const { body } = req.body;
    try {
        const comment = await Comment.create({
            body,
            movie: req.params.id,
            user: req.user.userId,
        });

        // **IMPORTANT FIX**: Link the comment back to the movie
        await Movie.findByIdAndUpdate(req.params.id, { $push: { comments: comment._id } });

        const populatedComment = await Comment.findById(comment._id).populate('user', 'name');
        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(400).json({ error: 'Could not add comment' });
    }
};

// ... (The other functions are correct, but are included here for completeness) ...

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
  const { voteType } = req.body;
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

// DELETE /api/movies/:id
exports.deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ error: 'Movie not found' });
        
        await Vote.deleteMany({ movie: movie._id });
        await Comment.deleteMany({ movie: movie._id });
        await movie.deleteOne();
        
        res.json({ message: 'Movie removed' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// DELETE /api/comments/:id
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        if (comment.user.toString() !== req.user.userId && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'User not authorized' });
        }
        
        // **IMPORTANT FIX**: Also remove the comment reference from the movie
        await Movie.findByIdAndUpdate(comment.movie, { $pull: { comments: comment._id } });

        await comment.deleteOne();
        res.json({ message: 'Comment removed' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};