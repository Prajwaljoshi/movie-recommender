const MOODS = [
  { id: '35', emoji: '🎭', label: 'Need a laugh', tooltip: 'Discover hilarious comedies' },
  { id: '53|28', emoji: '🎢', label: 'Thrilling', tooltip: 'Action-packed and suspenseful' },
  { id: '18|99|878', emoji: '🧠', label: 'Thought-provoking', tooltip: 'Deep dramas and sci-fi' },
  { id: '10749', emoji: '❤️', label: 'Romantic', tooltip: 'Heartwarming love stories' },
  { id: '10751|16', emoji: '🌟', label: 'Feel-good', tooltip: 'Family-friendly and uplifting' },
  { id: '27|9648', emoji: '👻', label: 'Spooky', tooltip: 'Horror and chilling mysteries' }
];

const MoodSelector = ({ selectedMood, onMoodSelect }) => {
  return (
    <div className="mood-container">
      <h3 className="mood-heading">What are you in the mood for?</h3>
      <div className="mood-selector">
        {MOODS.map(mood => (
          <button
            key={mood.id}
            className={`mood-pill ${selectedMood === mood.id ? 'active' : ''}`}
            onClick={() => onMoodSelect(mood.id)}
            title={mood.tooltip}
          >
            <span className="mood-emoji">{mood.emoji}</span>
            <span className="mood-label">{mood.label}</span>
            {/* Custom tooltip for non-native display (optional via CSS) */}
            <span className="mood-tooltip">{mood.tooltip}</span>
          </button>
        ))}
        {selectedMood && (
          <button 
            className="mood-pill clear-mood"
            onClick={() => onMoodSelect('')}
            title="Clear mood selection"
          >
            ✕ Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default MoodSelector;
