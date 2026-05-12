import { Filter } from 'lucide-react';

const LANGUAGES = [
  { code: '', name: 'All Languages' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'hi', name: 'Hindi' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' }
];

const FilterBar = ({ genres, selectedGenre, onGenreChange, selectedLanguage, onLanguageChange }) => {
  return (
    <div className="filter-bar">
      <div className="filter-icon">
        <Filter size={20} />
      </div>
      
      <div className="filter-group">
        <select 
          className="filter-select"
          value={selectedGenre} 
          onChange={(e) => onGenreChange(e.target.value)}
        >
          <option value="">All Genres</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        
        <select 
          className="filter-select"
          value={selectedLanguage} 
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
