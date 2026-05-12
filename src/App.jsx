import React, { useState, useEffect, useCallback } from 'react';
import { Film, TrendingUp, Sparkles } from 'lucide-react';
import SearchBar from './components/SearchBar';
import MovieGrid from './components/MovieGrid';
import MovieModal from './components/MovieModal';
import { getPopularMovies, searchMovies } from './api/tmdb';
import './index.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const fetchInitialMovies = async () => {
    setIsLoading(true);
    const data = await getPopularMovies();
    setMovies(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInitialMovies();
  }, []);

  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setIsSearching(false);
      fetchInitialMovies();
      return;
    }

    setIsSearching(true);
    setIsLoading(true);
    const data = await searchMovies(query);
    setMovies(data);
    setIsLoading(false);
  }, []);

  return (
    <div className="app-container">
      <header>
        <div className="logo-container">
          <Film className="logo-icon" size={32} />
          <h1 className="gradient-text">CineMagic</h1>
        </div>
        <SearchBar onSearch={handleSearch} />
      </header>

      <main>
        <div className="section-title">
          {isSearching && searchQuery ? (
            <>
              <Sparkles className="logo-icon" size={24} />
              Results for "{searchQuery}"
            </>
          ) : (
            <>
              <TrendingUp className="logo-icon" size={24} />
              Trending Now
            </>
          )}
        </div>
        
        <MovieGrid movies={movies} isLoading={isLoading} onMovieClick={setSelectedMovieId} />
      </main>

      {selectedMovieId && (
        <MovieModal 
          movieId={selectedMovieId} 
          onClose={() => setSelectedMovieId(null)} 
        />
      )}
    </div>
  );
}

export default App;
