import MovieCard from './MovieCard';

const MovieGrid = ({ movies, isLoading, onMovieClick }) => {
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="empty-state">
        <p>No movies found. Try adjusting your search.</p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map((movie, index) => (
        <MovieCard key={movie.id} movie={movie} index={index} onClick={onMovieClick} />
      ))}
    </div>
  );
};

export default MovieGrid;
