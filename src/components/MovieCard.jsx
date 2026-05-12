import React from 'react';
import { Star } from 'lucide-react';

const MovieCard = ({ movie, index, onClick }) => {
  const { title, poster_path, vote_average, release_date } = movie;
  const posterUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';
  
  const year = release_date ? release_date.substring(0, 4) : 'N/A';

  return (
    <div 
      className="movie-card animate-fade-in" 
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={() => onClick && onClick(movie.id)}
    >
      <img src={posterUrl} alt={title} className="movie-poster" loading="lazy" />
      <div className="movie-overlay">
        <h3 className="movie-title">{title}</h3>
        <div className="movie-info">
          <span>{year}</span>
          <div className="movie-rating">
            <Star size={14} fill="currentColor" />
            <span>{vote_average ? vote_average.toFixed(1) : 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
