import React, { useState, useEffect, useRef } from 'react';
import '../styles/AdvancedSearch.css';

const AdvancedSearch = ({ onSearchResults, onFiltersChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    duration: '',
    rating: '',
    price: '',
    language: '',
    instructor: '',
    tags: []
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    fetchFilterOptions();
    loadSearchHistory();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.length > 2) {
        fetchSuggestions();
        performSearch();
      } else if (searchQuery.length === 0) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, filters]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const [categoriesRes, instructorsRes, tagsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/instructors'),
        fetch('/api/tags/popular')
      ]);

      const [categoriesData, instructorsData, tagsData] = await Promise.all([
        categoriesRes.json(),
        instructorsRes.json(),
        tagsRes.json()
      ]);

      setCategories(categoriesData);
      setInstructors(instructorsData);
      setPopularTags(tagsData);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const performSearch = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        q: searchQuery,
        ...Object.fromEntries(
          Object.entries(filters).filter(([key, value]) => 
            value && (Array.isArray(value) ? value.length > 0 : true)
          )
        )
      });

      const response = await fetch(`/api/search/courses?${queryParams}`);
      if (response.ok) {
        const results = await response.json();
        onSearchResults(results);
        
        // Save to search history
        if (searchQuery.trim()) {
          saveToSearchHistory(searchQuery);
        }
      }
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSearchHistory = () => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history.slice(0, 5)); // Keep only last 5 searches
  };

  const saveToSearchHistory = (query) => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const updatedHistory = [query, ...history.filter(h => h !== query)].slice(0, 10);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    setSearchHistory(updatedHistory.slice(0, 5));
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleTagToggle = (tag) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    handleFilterChange('tags', newTags);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      level: '',
      duration: '',
      rating: '',
      price: '',
      language: '',
      instructor: '',
      tags: []
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const selectSuggestion = (suggestion) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);
    if (suggestion.type === 'course') {
      // Navigate to course detail or add to filters
      if (suggestion.category) {
        handleFilterChange('category', suggestion.category);
      }
    }
  };

  const selectFromHistory = (query) => {
    setSearchQuery(query);
    setShowSuggestions(false);
  };

  const renderSuggestions = () => {
    if (!showSuggestions) return null;

    const hasResults = suggestions.length > 0 || searchHistory.length > 0;

    return (
      <div className="search-suggestions" ref={suggestionsRef}>
        {searchHistory.length > 0 && searchQuery.length === 0 && (
          <div className="suggestions-section">
            <div className="suggestions-header">Recent Searches</div>
            {searchHistory.map((query, index) => (
              <div
                key={index}
                className="suggestion-item history-item"
                onClick={() => selectFromHistory(query)}
              >
                <span className="suggestion-icon">🕒</span>
                <span className="suggestion-text">{query}</span>
              </div>
            ))}
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="suggestions-section">
            <div className="suggestions-header">Suggestions</div>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => selectSuggestion(suggestion)}
              >
                <span className="suggestion-icon">
                  {suggestion.type === 'course' ? '📚' : 
                   suggestion.type === 'instructor' ? '👨‍🏫' : '🏷️'}
                </span>
                <span className="suggestion-text">{suggestion.text}</span>
                {suggestion.category && (
                  <span className="suggestion-category">{suggestion.category}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {!hasResults && searchQuery.length > 2 && (
          <div className="no-suggestions">
            No suggestions found for "{searchQuery}"
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="advanced-search">
      <div className="search-container">
        <div className="search-input-wrapper" ref={searchRef}>
          <input
            type="text"
            placeholder="Search courses, instructors, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="search-input"
          />
          <button 
            className="search-btn"
            onClick={performSearch}
            disabled={loading}
          >
            {loading ? '⏳' : '🔍'}
          </button>
          {renderSuggestions()}
        </div>

        <button
          className={`advanced-toggle ${showAdvanced ? 'active' : ''}`}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          Advanced Filters {showAdvanced ? '▲' : '▼'}
        </button>
      </div>

      {showAdvanced && (
        <div className="advanced-filters">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Level</label>
              <select
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Duration</label>
              <select
                value={filters.duration}
                onChange={(e) => handleFilterChange('duration', e.target.value)}
              >
                <option value="">Any Duration</option>
                <option value="0-2">0-2 hours</option>
                <option value="2-6">2-6 hours</option>
                <option value="6-12">6-12 hours</option>
                <option value="12+">12+ hours</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ ⭐</option>
                <option value="4.0">4.0+ ⭐</option>
                <option value="3.5">3.5+ ⭐</option>
                <option value="3.0">3.0+ ⭐</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Price</label>
              <select
                value={filters.price}
                onChange={(e) => handleFilterChange('price', e.target.value)}
              >
                <option value="">Any Price</option>
                <option value="free">Free</option>
                <option value="0-50">$0 - $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100+">$100+</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Language</label>
              <select
                value={filters.language}
                onChange={(e) => handleFilterChange('language', e.target.value)}
              >
                <option value="">Any Language</option>
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
                <option value="chinese">Chinese</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Instructor</label>
              <select
                value={filters.instructor}
                onChange={(e) => handleFilterChange('instructor', e.target.value)}
              >
                <option value="">Any Instructor</option>
                {instructors.map(instructor => (
                  <option key={instructor._id} value={instructor._id}>
                    {instructor.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="tags-section">
            <label>Popular Tags</label>
            <div className="tags-container">
              {popularTags.map(tag => (
                <button
                  key={tag}
                  className={`tag-btn ${filters.tags.includes(tag) ? 'selected' : ''}`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-actions">
            <button onClick={clearFilters} className="clear-btn">
              Clear All Filters
            </button>
            <button onClick={performSearch} className="apply-btn" disabled={loading}>
              {loading ? 'Searching...' : 'Apply Filters'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
