import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Header = ({ 
  user, 
  onPageChange, 
  currentPage, 
  onSidebarToggle, 
  onAIAssistantToggle,
  onLogout,
  notifications 
}) => {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.length > 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (query) => {
    try {
      // Simulate AI-powered search
      const mockResults = [
        { type: 'course', title: 'Advanced React Development', category: 'Web Development' },
        { type: 'instructor', title: 'Dr. Sarah Chen', specialty: 'Machine Learning' },
        { type: 'path', title: 'Full Stack Developer Path', duration: '6 months' },
        { type: 'skill', title: 'JavaScript Mastery', level: 'Advanced' }
      ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(query.toLowerCase()))
      );

      setSearchResults(mockResults);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const navigationItems = [
    { id: 'home', label: 'Home', icon: '🏠', public: true },
    { id: 'courses', label: 'Courses', icon: '📚', public: true },
    { id: 'dashboard', label: 'Dashboard', icon: '📊', protected: true },
    { id: 'ai-recommendations', label: 'AI Picks', icon: '🤖', protected: true },
    { id: 'learning-paths', label: 'Paths', icon: '🛤️', protected: true },
    { id: 'virtual-classroom', label: 'VR Class', icon: '🥽', protected: true },
    { id: 'live-sessions', label: 'Live', icon: '🔴', protected: true },
    { id: 'community', label: 'Community', icon: '👥', protected: true }
  ];

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <header className={`professional-header ${isScrolled ? 'scrolled' : ''} ${theme}`}>
      <div className="header-container">
        {/* Logo and Brand */}
        <div className="header-brand">
          {user && (
            <button 
              className="sidebar-toggle"
              onClick={onSidebarToggle}
              aria-label="Toggle sidebar"
            >
              <span className="hamburger"></span>
            </button>
          )}
          
          <div className="logo" onClick={() => onPageChange('home')}>
            <div className="logo-icon">
              <span className="logo-gradient">🎓</span>
            </div>
            <div className="logo-text">
              <h1>EduVerse</h1>
              <span className="tagline">AI-Powered Learning</span>
            </div>
          </div>
        </div>

        {/* Advanced Search */}
        <div className="header-search" ref={searchRef}>
          <div className="search-container">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search courses, instructors, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button className="voice-search" title="Voice Search">
                🎤
              </button>
              <button className="ai-search" title="AI Search">
                ✨
              </button>
            </div>
            
            {showSearchResults && searchResults.length > 0 && (
              <div className="search-results">
                <div className="search-header">
                  <span>Smart Search Results</span>
                  <span className="ai-badge">AI</span>
                </div>
                {searchResults.map((result, index) => (
                  <div key={index} className="search-result-item">
                    <div className="result-icon">
                      {result.type === 'course' && '📚'}
                      {result.type === 'instructor' && '👨‍🏫'}
                      {result.type === 'path' && '🛤️'}
                      {result.type === 'skill' && '⚡'}
                    </div>
                    <div className="result-content">
                      <div className="result-title">{result.title}</div>
                      <div className="result-meta">
                        {result.category || result.specialty || result.duration || result.level}
                      </div>
                    </div>
                    <div className="result-type">{result.type}</div>
                  </div>
                ))}
                <div className="search-footer">
                  <button className="view-all-results">
                    View all results for "{searchQuery}"
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="header-navigation">
          {navigationItems.map(item => {
            if (item.protected && !user) return null;
            if (item.public === false && !user) return null;
            
            return (
              <button
                key={item.id}
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => onPageChange(item.id)}
                title={item.label}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Actions */}
        <div className="header-actions">
          {/* Theme Toggle */}
          <button 
            className="action-button theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {user ? (
            <>
              {/* AI Assistant */}
              <button 
                className="action-button ai-assistant"
                onClick={onAIAssistantToggle}
                title="AI Learning Assistant"
              >
                <span className="ai-icon">🤖</span>
                <span className="ai-pulse"></span>
              </button>

              {/* Notifications */}
              <div className="notification-container" ref={notificationRef}>
                <button 
                  className="action-button notifications"
                  onClick={() => setShowNotifications(!showNotifications)}
                  title="Notifications"
                >
                  <span className="notification-icon">🔔</span>
                  {unreadNotifications > 0 && (
                    <span className="notification-badge">{unreadNotifications}</span>
                  )}
                </button>

                {showNotifications && (
                  <div className="notifications-dropdown">
                    <div className="notifications-header">
                      <h3>Notifications</h3>
                      <button className="mark-all-read">Mark all read</button>
                    </div>
                    <div className="notifications-list">
                      {notifications.slice(0, 5).map(notification => (
                        <div key={notification.id} className="notification-item">
                          <div className="notification-content">
                            <div className="notification-message">
                              {notification.message}
                            </div>
                            <div className="notification-time">
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                          <div className={`notification-type ${notification.type}`}></div>
                        </div>
                      ))}
                    </div>
                    <div className="notifications-footer">
                      <button onClick={() => onPageChange('notifications')}>
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="user-menu-container" ref={userMenuRef}>
                <button 
                  className="user-avatar"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  title="User menu"
                >
                  <img 
                    src={user.profilePicture || '/api/placeholder/40/40'} 
                    alt={user.username}
                    className="avatar-image"
                  />
                  <div className="user-status online"></div>
                </button>

                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <img 
                        src={user.profilePicture || '/api/placeholder/60/60'} 
                        alt={user.username}
                        className="user-avatar-large"
                      />
                      <div className="user-details">
                        <div className="user-name">{user.username}</div>
                        <div className="user-email">{user.email}</div>
                        <div className="user-level">
                          Level {user.level || 1} Learner
                        </div>
                      </div>
                    </div>
                    
                    <div className="user-stats">
                      <div className="stat">
                        <span className="stat-value">{user.completedCourses?.length || 0}</span>
                        <span className="stat-label">Courses</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{user.achievements?.length || 0}</span>
                        <span className="stat-label">Achievements</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{user.learningStreak?.current || 0}</span>
                        <span className="stat-label">Day Streak</span>
                      </div>
                    </div>

                    <div className="user-actions">
                      <button 
                        className="dropdown-item"
                        onClick={() => onPageChange('profile')}
                      >
                        <span className="item-icon">👤</span>
                        Profile Settings
                      </button>
                      <button 
                        className="dropdown-item"
                        onClick={() => onPageChange('analytics')}
                      >
                        <span className="item-icon">📊</span>
                        Learning Analytics
                      </button>
                      <button 
                        className="dropdown-item"
                        onClick={() => onPageChange('certificates')}
                      >
                        <span className="item-icon">🏆</span>
                        Certificates
                      </button>
                      <button 
                        className="dropdown-item"
                        onClick={() => onPageChange('settings')}
                      >
                        <span className="item-icon">⚙️</span>
                        Settings
                      </button>
                      <div className="dropdown-divider"></div>
                      <button 
                        className="dropdown-item logout"
                        onClick={onLogout}
                      >
                        <span className="item-icon">🚪</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <button 
                className="auth-button login"
                onClick={() => onPageChange('login')}
              >
                Sign In
              </button>
              <button 
                className="auth-button register"
                onClick={() => onPageChange('register')}
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {user && (
        <div className="learning-progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${user.overallProgress || 0}%` }}
          ></div>
        </div>
      )}
    </header>
  );
};

export default Header;
