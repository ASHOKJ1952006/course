import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      className={`theme-toggle ${className}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <div className="theme-toggle-container">
        <div className={`theme-toggle-track ${isDarkMode ? 'dark' : 'light'}`}>
          <div className="theme-toggle-thumb">
            <span className="theme-icon">
              {isDarkMode ? '🌙' : '☀️'}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;