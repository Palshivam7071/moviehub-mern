// src/components/AddCommentForm/AddCommentForm.jsx
import React, { useState } from 'react';
import api from '../../services/api';
import formStyles from '../../styles/Forms.module.css';

const AddCommentForm = ({ movieId, onCommentAdded }) => {
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    try {
      await api.post(`/movies/${movieId}/comments`, { body });
      setBody('');
      onCommentAdded(); // This will trigger a refetch in the parent
    } catch (err) {
      setError('Failed to post comment.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <textarea
        className={formStyles.textarea}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add a comment..."
        rows="2"
        required
      />
      <button
        type="submit"
        className={formStyles.button}
        style={{ marginTop: '0.5rem', width: 'auto', padding: '0.5rem 1rem' }}
      >
        Post Comment
      </button>
      {error && <p className={formStyles.errorMessage}>{error}</p>}
    </form>
  );
};

export default AddCommentForm;