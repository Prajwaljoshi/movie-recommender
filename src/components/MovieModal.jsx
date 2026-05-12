import { useEffect, useState } from 'react';
import { X, Star, Clock, Calendar } from 'lucide-react';
import { getMovieDetails } from '../api/tmdb';

const MovieModal = ({ movieId, onClose }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const data = await getMovieDetails(movieId);
      setMovie(data);
      setLoading(false);
    };

    if (movieId) {
      fetchDetails();
    }
  }, [movieId]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!movieId) return null;

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : movie ? (
          <div className="modal-body">
            <div className="modal-poster-container">
              <img 
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'} 
                alt={movie.title} 
                className="modal-poster"
              />
            </div>
            
            <div className="modal-info">
              <h2 className="modal-title gradient-text">{movie.title}</h2>
              
              <div className="modal-meta">
                {movie.release_date && (
                  <span className="meta-item">
                    <Calendar size={16} /> {movie.release_date.substring(0, 4)}
                  </span>
                )}
                {movie.runtime > 0 && (
                  <span className="meta-item">
                    <Clock size={16} /> {movie.runtime} min
                  </span>
                )}
                <span className="meta-item rating-high">
                  <Star size={16} fill="currentColor" /> {movie.vote_average?.toFixed(1)}
                </span>
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div className="modal-genres">
                  {movie.genres.map(g => (
                    <span key={g.id} className="genre-tag">{g.name}</span>
                  ))}
                </div>
              )}

              <div className="modal-synopsis">
                <h3>Synopsis</h3>
                <p>{movie.overview || "No synopsis available."}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p>Failed to load movie details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieModal;
