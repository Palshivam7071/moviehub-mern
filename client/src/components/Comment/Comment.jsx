// src/components/Comment/Comment.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import styles from './Comment.module.css';
import { formatDistanceToNow } from 'date-fns';

const Comment = ({ comment, onCommentDeleted }) => {
  const { user } = useContext(AuthContext);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    // The actual delete logic will be called from the parent (MovieCard)
    onCommentDeleted(comment._id);
  };

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });
  const canDelete = user?.role === 'ADMIN' || user?.id === comment.user._id;

  return (
    <div className={styles.comment}>
      <div className={styles.header}>
        <span className={styles.author}>{comment.user.name}</span>
        <span className={styles.timestamp}>{timeAgo}</span>
      </div>
      <p className={styles.body}>{comment.body}</p>
      {canDelete && (
        <button onClick={handleDelete} className={styles.deleteButton}>
          Delete
        </button>
      )}
    </div>
  );
};

export default Comment;