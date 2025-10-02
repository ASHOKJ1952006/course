import React, { useState, useEffect, useRef } from 'react';
import '../styles/professional-theme.css';

const SearchSystem = ({ onSearch, onFilterChange, placeholder = "Search courses, skills, or topics..." }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    duration: 'all',
    price: 'all',
    rating: 'all',
    language: 'all',
    skills: [],
    instructor: '',
    sortBy: 'relevance'
  });
  
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Sample suggestions based on popular searches
  const allSuggestions = [
    { type: 'course', text: 'AI-Powered Full Stack Development', category: 'Programming' },
    { type: 'course', text: 'Data Science with Python', category: 'Data Science' },
    { type: 'course', text: 'Blockchain Development', category: 'Blockchain' },
    { type: 'skill', text: 'React.js', category: 'Frontend' },
    { type: 'skill', text: 'Machine Learning', category: 'AI/ML' },
    { type: 'skill', text: 'Node.js', category: 'Backend' },
    { type: 'skill', text: 'Python', category: 'Programming' },
    { type: 'skill', text: 'JavaScript', category: 'Programming' },
    { type: 'topic', text: 'Web Development', category: 'Programming' },
    { type: 'topic', text: 'Artificial Intelligence', category: 'AI/ML' },
    { type: 'topic', text: 'Cloud Computing', category: 'DevOps' },
    { type: 'instructor', text: 'Dr. Sarah Chen', category: 'AI Expert' },
    { type: 'instructor', text: 'Prof. Maria Garcia', category: 'Data Science' }
  ];

  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = allSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query = searchQuery) => {
    onSearch?.(query, filters);
    setShowSuggestions(false);
  };

  const handleFilterUpdate = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSkillToggle = (skill) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter(s => s !== skill)
      : [...filters.skills, skill];
    handleFilterUpdate('skills', newSkills);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  const clearFilters = () => {
    const defaultFilters = {
      category: 'all',
      level: 'all',
      duration: 'all',
      price: 'all',
      rating: 'all',
      language: 'all',
      skills: [],
      instructor: '',
      sortBy: 'relevance'
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'course': return '📚';
      case 'skill': return '🎯';
      case 'topic': return '💡';
      case 'instructor': return '👨‍🏫';
      default: return '🔍';
    }
  };

  const popularSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Machine Learning',
    'AI', 'Blockchain', 'Cloud Computing', 'DevOps', 'Data Science'
  ];

  return (
    <div className="search-system">
      {/* Main Search Bar */}
      <div className="search-container" ref={searchRef}>
        <div className="search-input-wrapper">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
          />
          <div className="search-actions">
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => {
                  setSearchQuery('');
                  setShowSuggestions(false);
                }}
              >
                ×
              </button>
            )}
            <button
              className="search-submit btn btn-primary btn-sm"
              onClick={() => handleSearch()}
            >
              Search
            </button>
          </div>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="search-suggestions" ref={suggestionsRef}>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="suggestion-icon">
                  {getSuggestionIcon(suggestion.type)}
                </div>
                <div className="suggestion-content">
                  <div className="suggestion-text">{suggestion.text}</div>
                  <div className="suggestion-category">{suggestion.category}</div>
                </div>
                <div className="suggestion-type">
                  {suggestion.type}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Advanced Filters Toggle */}
      <div className="search-controls">
        <button
          className={`btn btn-ghost btn-sm ${isAdvancedOpen ? 'active' : ''}`}
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
        >
          🎛️ Advanced Filters
          {isAdvancedOpen ? ' ▲' : ' ▼'}
        </button>
        
        {Object.values(filters).some(v => v !== 'all' && v !== '' && (Array.isArray(v) ? v.length > 0 : true)) && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={clearFilters}
          >
            🗑️ Clear Filters
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {isAdvancedOpen && (
        <div className="advanced-filters animate-fade-in">
          <div className="filters-grid">
            {/* Category Filter */}
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <select
                className="form-select"
                value={filters.category}
                onChange={(e) => handleFilterUpdate('category', e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Programming">Programming</option>
                <option value="Data Science">Data Science</option>
                <option value="AI/ML">AI & Machine Learning</option>
                <option value="Blockchain">Blockchain</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="DevOps">DevOps & Cloud</option>
                <option value="Design">UI/UX Design</option>
                <option value="Business">Business & Marketing</option>
              </select>
            </div>

            {/* Level Filter */}
            <div className="filter-group">
              <label className="filter-label">Difficulty Level</label>
              <select
                className="form-select"
                value={filters.level}
                onChange={(e) => handleFilterUpdate('level', e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            {/* Duration Filter */}
            <div className="filter-group">
              <label className="filter-label">Course Duration</label>
              <select
                className="form-select"
                value={filters.duration}
                onChange={(e) => handleFilterUpdate('duration', e.target.value)}
              >
                <option value="all">Any Duration</option>
                <option value="short">Short (0-10 hours)</option>
                <option value="medium">Medium (10-30 hours)</option>
                <option value="long">Long (30+ hours)</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="filter-group">
              <label className="filter-label">Price Range</label>
              <select
                className="form-select"
                value={filters.price}
                onChange={(e) => handleFilterUpdate('price', e.target.value)}
              >
                <option value="all">Any Price</option>
                <option value="free">Free</option>
                <option value="under-50">Under $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100-200">$100 - $200</option>
                <option value="over-200">Over $200</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div className="filter-group">
              <label className="filter-label">Minimum Rating</label>
              <select
                className="form-select"
                value={filters.rating}
                onChange={(e) => handleFilterUpdate('rating', e.target.value)}
              >
                <option value="all">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
                <option value="3.0">3.0+ Stars</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select
                className="form-select"
                value={filters.sortBy}
                onChange={(e) => handleFilterUpdate('sortBy', e.target.value)}
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Highest Rated</option>
                <option value="popularity">Most Popular</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>

          {/* Skills Filter */}
          <div className="skills-filter">
            <label className="filter-label">Skills & Technologies</label>
            <div className="skills-grid">
              {popularSkills.map(skill => (
                <button
                  key={skill}
                  className={`skill-tag ${filters.skills.includes(skill) ? 'active' : ''}`}
                  onClick={() => handleSkillToggle(skill)}
                >
                  {skill}
                  {filters.skills.includes(skill) && ' ✓'}
                </button>
              ))}
            </div>
          </div>

          {/* Instructor Filter */}
          <div className="filter-group full-width">
            <label className="filter-label">Instructor Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Search by instructor name..."
              value={filters.instructor}
              onChange={(e) => handleFilterUpdate('instructor', e.target.value)}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .search-system {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }

        .search-container {
          position: relative;
          margin-bottom: var(--space-4);
        }

        .search-input-wrapper {
          display: flex;
          align-items: center;
          background: var(--bg-secondary);
          border: 2px solid var(--border-secondary);
          border-radius: var(--radius-xl);
          padding: var(--space-2);
          transition: all var(--transition-base);
          box-shadow: var(--shadow-sm);
        }

        .search-input-wrapper:focus-within {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px rgb(14 165 233 / 0.1);
        }

        .search-icon {
          padding: var(--space-3);
          color: var(--text-secondary);
          font-size: 1.125rem;
        }

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 1rem;
          color: var(--text-primary);
          padding: var(--space-3) var(--space-2);
        }

        .search-input::placeholder {
          color: var(--text-tertiary);
        }

        .search-actions {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .search-clear {
          width: 1.5rem;
          height: 1.5rem;
          border: none;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-secondary);
          transition: all var(--transition-base);
        }

        .search-clear:hover {
          background: var(--bg-quaternary);
          color: var(--text-primary);
        }

        .search-suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          z-index: var(--z-dropdown);
          max-height: 300px;
          overflow-y: auto;
          margin-top: var(--space-2);
        }

        .suggestion-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          cursor: pointer;
          transition: all var(--transition-base);
          border-bottom: 1px solid var(--border-primary);
        }

        .suggestion-item:last-child {
          border-bottom: none;
        }

        .suggestion-item:hover {
          background: var(--bg-tertiary);
        }

        .suggestion-icon {
          font-size: 1rem;
          flex-shrink: 0;
        }

        .suggestion-content {
          flex: 1;
          min-width: 0;
        }

        .suggestion-text {
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: var(--space-1);
        }

        .suggestion-category {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        .suggestion-type {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: capitalize;
          background: var(--bg-tertiary);
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-md);
        }

        .search-controls {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-4);
        }

        .search-controls .btn.active {
          background: var(--primary-50);
          color: var(--primary-600);
        }

        .advanced-filters {
          background: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          box-shadow: var(--shadow-sm);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-4);
          margin-bottom: var(--space-6);
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .filter-group.full-width {
          grid-column: 1 / -1;
        }

        .filter-label {
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--text-primary);
        }

        .skills-filter {
          margin-bottom: var(--space-4);
        }

        .skills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          margin-top: var(--space-3);
        }

        .skill-tag {
          padding: var(--space-2) var(--space-3);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .skill-tag:hover {
          background: var(--bg-quaternary);
          border-color: var(--border-primary);
        }

        .skill-tag.active {
          background: var(--primary-500);
          color: white;
          border-color: var(--primary-500);
        }

        @media (max-width: 768px) {
          .search-input-wrapper {
            flex-direction: column;
            align-items: stretch;
            gap: var(--space-2);
          }

          .search-actions {
            justify-content: flex-end;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }

          .skills-grid {
            gap: var(--space-1);
          }

          .skill-tag {
            font-size: 0.75rem;
            padding: var(--space-1) var(--space-2);
          }
        }
      `}</style>
    </div>
  );
};

export default SearchSystem;
