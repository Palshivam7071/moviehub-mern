// server/models/voteModel.js
const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  movie: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Movie' },
  vote_type: { type: String, enum: ['UP', 'DOWN'], required: true },
}, { timestamps: true });

// Ensure a user can only vote once per movie
voteSchema.index({ user: 1, movie: 1 }, { unique: true });

const Vote = mongoose.model('Vote', voteSchema);
module.exports = Vote;