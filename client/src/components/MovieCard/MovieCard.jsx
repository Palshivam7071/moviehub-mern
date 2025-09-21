import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { formatDistanceToNow } from 'date-fns';
import styles from './MovieCard.module.css';
import Comment from '../Comment/Comment';
import AddCommentForm from '../AddCommentForm/AddCommentForm';

const MovieCard = ({ movie, onAction }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [showComments, setShowComments] = useState(false);

  const handleVote = async (voteType) => {
    if (!isAuthenticated) return alert('Please login to vote.');
    try {
      await api.post(`/movies/${movie._id}/vote`, { voteType });
      onAction();
    } catch (error) {
      console.error('Failed to vote', error);
    }
  };

  const handleDeleteMovie = async () => {
    if (!window.confirm(`Are you sure you want to delete "${movie.title}"?`)) return;
    try {
      await api.delete(`/movies/${movie._id}`);
      onAction();
    } catch (error) {
      console.error('Failed to delete movie', error);
    }
  };

  const handleCommentDeleted = async (commentId) => {
    try {
      await api.delete(`/movies/comments/${commentId}`);
      onAction(); // Trigger refetch in parent
    } catch (error) {
      console.error('Failed to delete comment', error);
      alert('Failed to delete comment.');
    }
  };

  const timeAgo = formatDistanceToNow(new Date(movie.createdAt), { addSuffix: true });
  const commentCount = movie.comments?.length || 0;

  return (
    <div className={styles.card}>
      <div className={styles.voteWrapper}>
        <button onClick={() => handleVote('UP')} className={`${styles.voteButton} ${styles.upvote}`} aria-label="Upvote">▲</button>
        <span className={styles.score}>{movie.score}</span>
        <button onClick={() => handleVote('DOWN')} className={`${styles.voteButton} ${styles.downvote}`} aria-label="Downvote">▼</button>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{movie.title}</h3>
        <p className={styles.description}>{movie.description}</p>
        <footer className={styles.footer}>
          <span>Suggested by <strong>{movie.user.name}</strong></span>
          <div className={styles.footerActions}>
            <button className={styles.commentToggle} onClick={() => setShowComments(!showComments)}>
              {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
            </button>
            <span>{timeAgo}</span>
          </div>
        </footer>

        {showComments && (
          <div className={styles.commentsSection}>
            {isAuthenticated && <AddCommentForm movieId={movie._id} onCommentAdded={onAction} />}
            <div className={styles.commentList}>
              {commentCount > 0 ? (
                movie.comments.map(comment => (
                  <Comment key={comment._id} comment={comment} onCommentDeleted={handleCommentDeleted} />
                ))
              ) : (
                <p className={styles.noComments}>No comments yet.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {user?.role === 'ADMIN' && (
        <button onClick={handleDeleteMovie} className={styles.deleteButton} aria-label="Delete Movie">&times;</button>
      )}
    </div>
  );
};

export default MovieCard;