import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label="Toggle dark/light mode"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun size={20} className="theme-icon sun-icon" />
      ) : (
        <Moon size={20} className="theme-icon moon-icon" />
      )}
    </button>
  );
};

export default ThemeToggle;
