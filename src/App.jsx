import { useState, useEffect, useCallback } from 'react';
import { Film, TrendingUp, Sparkles, Filter } from 'lucide-react';
import SearchBar from './components/SearchBar';
import MovieGrid from './components/MovieGrid';
import MovieModal from './components/MovieModal';
import FilterBar from './components/FilterBar';
import MoodSelector from './components/MoodSelector';
import Pagination from './components/Pagination';
import { discoverMovies, searchMovies, getGenres } from './api/tmdb';
import './index.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  
  // New state for filters and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedMood, setSelectedMood] = useState('');

  // Fetch genres once on mount
  useEffect(() => {
    const fetchGenres = async () => {
      const genresData = await getGenres();
      setGenres(genresData);
    };
    fetchGenres();
  }, []);

  // Centralized movie fetching logic
  const loadMovies = useCallback(async () => {
    setIsLoading(true);
    let data;

    if (isSearching && searchQuery.trim()) {
      // Use search API (ignores genre and language filters by design)
      data = await searchMovies(searchQuery, currentPage);
    } else {
      // Use discover API (supports filters)
      const effectiveGenre = selectedMood || selectedGenre;
      data = await discoverMovies(currentPage, effectiveGenre, selectedLanguage);
    }

    setMovies(data.results);
    // Limit to 500 pages (TMDB API max limit)
    setTotalPages(Math.min(data.total_pages, 500));
    setIsLoading(false);
    
    // Scroll to top when new page loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, isSearching, searchQuery, selectedGenre, selectedLanguage, selectedMood]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMovies();
  }, [loadMovies]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page
    setSelectedMood(''); // Clear mood
    if (query.trim()) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, []);

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
    setCurrentPage(1);
    setIsSearching(false); // Clear search mode when filtering
    setSearchQuery('');
    if (genreId) {
      setSelectedMood(''); // Clear mood if manual genre is selected
    }
  };

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
    setCurrentPage(1);
    setIsSearching(false);
    setSearchQuery('');
    if (moodId) {
      setSelectedGenre(''); // Clear manual genre if mood is selected
    }
  };

  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode);
    setCurrentPage(1);
    setIsSearching(false); // Clear search mode when filtering
    setSearchQuery('');
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo-container">
          <Film className="logo-icon" size={32} />
          <h1 className="gradient-text">CineMagic</h1>
        </div>
        <div className="header-controls">
          <SearchBar onSearch={handleSearch} />
          <FilterBar 
            genres={genres}
            selectedGenre={selectedGenre}
            onGenreChange={handleGenreChange}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />
        </div>
      </header>

      <main>
        <MoodSelector selectedMood={selectedMood} onMoodSelect={handleMoodSelect} />
        
        <div className="section-title">
          {isSearching && searchQuery ? (
            <>
              <Sparkles className="logo-icon" size={24} />
              Results for "{searchQuery}"
            </>
          ) : selectedMood ? (
            <>
              <Sparkles className="logo-icon" size={24} />
              Curated for your mood
            </>
          ) : selectedGenre || selectedLanguage ? (
            <>
              <Filter className="logo-icon" size={24} />
              Filtered Results
            </>
          ) : (
            <>
              <TrendingUp className="logo-icon" size={24} />
              Trending Now
            </>
          )}
        </div>
        
        <MovieGrid movies={movies} isLoading={isLoading} onMovieClick={setSelectedMovieId} />
        
        {!isLoading && totalPages > 1 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
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
