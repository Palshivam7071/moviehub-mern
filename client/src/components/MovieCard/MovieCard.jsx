import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { formatDistanceToNow } from 'date-fns';
import styles from './MovieCard.module.css';

const MovieCard = ({ movie, onAction }) => {
  const { user, isAuthenticated } = useContext(AuthContext);

  const handleVote = async (voteType) => {
    if (!isAuthenticated) return alert('Please login to vote.');
    try {
      await api.post(`/movies/${movie._id || movie.id}/vote`, { voteType });
      onAction();
    } catch (error) {
      console.error('Failed to vote', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${movie.title}"?`)) return;
    try {
      await api.delete(`/movies/${movie._id || movie.id}`);
      onAction();
    } catch (error) {
      console.error('Failed to delete movie', error);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(movie.createdAt || movie.created_at), { addSuffix: true });

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
          <span>{timeAgo}</span>
        </footer>
      </div>
      {user?.role === 'ADMIN' && (
        <button onClick={handleDelete} className={styles.deleteButton} aria-label="Delete Movie">
          &times;
        </button>
      )}
    </div>
  );
};

export default MovieCard;