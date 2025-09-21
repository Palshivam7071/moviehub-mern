import React, { useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

import MovieCard from '../components/MovieCard/MovieCard';
import SuggestMovieForm from '../components/SuggestMovieForm/SuggestMovieForm';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/movies');
      setMovies(response.data);
    } catch (error) {
      console.error('Failed to fetch movies', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return (
    <div>
      {isAuthenticated && <SuggestMovieForm onMovieAdded={fetchMovies} />}
      
      <h1 style={{ marginTop: '2rem' }}>Recommendations</h1>
      
      {loading ? (
        <LoadingSpinner />
      ) : movies.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {movies.map(movie => (
            <MovieCard key={movie._id || movie.id} movie={movie} onAction={fetchMovies} />
          ))}
        </div>
      ) : (
        <p>No movies have been recommended yet. Be the first!</p>
      )}
    </div>
  );
};

export default HomePage;