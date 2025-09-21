import React, { useState } from 'react';
import api from '../../services/api';
import formStyles from '../../styles/Forms.module.css';
import styles from './SuggestMovieForm.module.css';

const SuggestMovieForm = ({ onMovieAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
        setError('Title and description are required.');
        return;
    }
    setError('');
    try {
      await api.post('/movies', { title, description });
      setTitle('');
      setDescription('');
      onMovieAdded();
    } catch (err) {
      setError('Failed to suggest movie. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Recommend a Movie</h2>
      <form onSubmit={handleSubmit}>
        <div className={formStyles.formGroup}>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Movie Title" className={formStyles.input} required />
        </div>
        <div className={formStyles.formGroup}>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Why should we watch it?" className={formStyles.textarea} required></textarea>
        </div>
        <button type="submit" className={formStyles.button}>Submit Recommendation</button>
        {error && <p className={formStyles.errorMessage}>{error}</p>}
      </form>
    </div>
  );
};

export default SuggestMovieForm;