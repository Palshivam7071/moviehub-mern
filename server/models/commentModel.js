// server/models/commentModel.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    body: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    movie: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Movie' },
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;