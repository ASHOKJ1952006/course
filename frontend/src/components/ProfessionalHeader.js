import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from './NotificationSystem';
import '../styles/professional-theme.css';

const ProfessionalHeader = ({ 
  activeView, 
  setActiveView, 
  darkMode, 
  setDarkMode, 
  showChatbot, 
  setShowChatbot 
}) => {
  const { user, logout } = useAuth();
  const { notifications, markAsRead, clearAll } = useNotifications();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const quickActionsRef = useRef(null);

  const navigationItems = [
    { id: 'courses', label: 'Courses', icon: '📚', description: 'Browse and enroll in courses' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊', description: 'Your learning overview' },
    { id: 'community', label: 'Community', icon: '👥', description: 'Connect with learners' },
    { id: 'career', label: 'Career', icon: '💼', description: 'Career development tools' },
    { id: 'gamification', label: 'Progress', icon: '🎮', description: 'Achievements and progress' }
  ];

  const quickActions = [
    { id: 'new-course', label: 'Start Learning', icon: '🚀', action: () => setActiveView('courses') },
    { id: 'certificates', label: 'My Certificates', icon: '🎓', action: () => setActiveView('dashboard') },
    { id: 'help', label: 'Help Center', icon: '❓', action: () => setShowChatbot(true) },
    { id: 'feedback', label: 'Give Feedback', icon: '💬', action: () => console.log('Feedback') }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target)) {
        setShowQuickActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'k':
            event.preventDefault();
            document.querySelector('.header-search-input')?.focus();
            break;
          case '/':
            event.preventDefault();
            setShowQuickActions(true);
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read);
  const userProgress = Math.round((user?.gamification?.xp || 0) / 100) * 10;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveView('courses');
      // Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="professional-header">
      <div className="header-container">
        {/* Logo and Brand */}
        <div className="header-brand">
          <div className="brand-logo">
            <span className="logo-icon">🚀</span>
            <div className="logo-text">
              <span className="brand-name">LearnNext</span>
              <span className="brand-tagline">Professional Learning</span>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="header-nav">
          {navigationItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
              title={item.description}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Search Bar */}
        <div className="header-search">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="header-search-input"
                placeholder="Search courses... (Ctrl+K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => setSearchQuery('')}
                >
                  ×
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Quick Actions */}
          <div className="action-item" ref={quickActionsRef}>
            <button
              className="action-button tooltip"
              data-tooltip="Quick Actions (Ctrl+/)"
              onClick={() => setShowQuickActions(!showQuickActions)}
            >
              ⚡
            </button>
            {showQuickActions && (
              <div className="dropdown-menu quick-actions-menu animate-fade-in">
                <div className="dropdown-header">
                  <h4>Quick Actions</h4>
                </div>
                {quickActions.map(action => (
                  <button
                    key={action.id}
                    className="dropdown-item"
                    onClick={() => {
                      action.action();
                      setShowQuickActions(false);
                    }}
                  >
                    <span className="item-icon">{action.icon}</span>
                    <span className="item-label">{action.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            className="action-button tooltip"
            data-tooltip={`Switch to ${darkMode ? 'Light' : 'Dark'} Mode`}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* AI Chatbot */}
          <button
            className={`action-button tooltip ${showChatbot ? 'active' : ''}`}
            data-tooltip="AI Assistant"
            onClick={() => setShowChatbot(!showChatbot)}
          >
            🤖
          </button>

          {/* Notifications */}
          <div className="action-item" ref={notificationsRef}>
            <button
              className="action-button tooltip notification-button"
              data-tooltip="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              🔔
              {unreadNotifications.length > 0 && (
                <span className="notification-badge">
                  {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="dropdown-menu notifications-menu animate-fade-in">
                <div className="dropdown-header">
                  <h4>Notifications</h4>
                  {notifications.length > 0 && (
                    <button className="clear-all-btn" onClick={clearAll}>
                      Clear All
                    </button>
                  )}
                </div>
                <div className="notifications-list">
                  {notifications.length === 0 ? (
                    <div className="empty-state">
                      <span className="empty-icon">🔔</span>
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.slice(0, 5).map(notification => (
                      <div
                        key={notification.id}
                        className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="notification-content">
                          <p className="notification-message">{notification.message}</p>
                          <span className="notification-time">
                            {notification.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                  {notifications.length > 5 && (
                    <div className="view-all">
                      <button className="btn btn-ghost btn-sm">
                        View All Notifications
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="action-item user-menu-container" ref={userMenuRef}>
            <button
              className="user-profile-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar">
                {user?.avatar || '👤'}
              </div>
              <div className="user-info">
                <span className="user-name">{user?.firstName || 'User'}</span>
                <div className="user-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${userProgress}%` }}
                    ></div>
                  </div>
                  <span className="level-text">Level {user?.gamification?.level || 1}</span>
                </div>
              </div>
              <span className="dropdown-arrow">▼</span>
            </button>

            {showUserMenu && (
              <div className="dropdown-menu user-menu animate-fade-in">
                <div className="dropdown-header">
                  <div className="user-profile-header">
                    <div className="profile-avatar">{user?.avatar || '👤'}</div>
                    <div className="profile-info">
                      <h4>{user?.firstName} {user?.lastName}</h4>
                      <p>{user?.email}</p>
                      <div className="profile-stats">
                        <span>Level {user?.gamification?.level || 1}</span>
                        <span>•</span>
                        <span>{user?.gamification?.xp || 0} XP</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dropdown-section">
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setActiveView('dashboard');
                      setShowUserMenu(false);
                    }}
                  >
                    <span className="item-icon">👤</span>
                    <span className="item-label">My Profile</span>
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setActiveView('dashboard');
                      setShowUserMenu(false);
                    }}
                  >
                    <span className="item-icon">🎓</span>
                    <span className="item-label">My Certificates</span>
                  </button>
                  <button className="dropdown-item">
                    <span className="item-icon">⚙️</span>
                    <span className="item-label">Settings</span>
                  </button>
                  <button className="dropdown-item">
                    <span className="item-icon">❓</span>
                    <span className="item-label">Help & Support</span>
                  </button>
                </div>

                <div className="dropdown-section">
                  <button
                    className="dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    <span className="item-icon">🚪</span>
                    <span className="item-label">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .professional-header {
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-primary);
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 0;
          z-index: var(--z-sticky);
          backdrop-filter: blur(8px);
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4) var(--space-6);
          max-width: 1400px;
          margin: 0 auto;
          gap: var(--space-6);
        }

        .header-brand {
          flex-shrink: 0;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          text-decoration: none;
          color: var(--text-primary);
        }

        .logo-icon {
          font-size: 2rem;
          background: var(--gradient-primary);
          padding: var(--space-2);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .brand-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .brand-tagline {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          font-weight: 500;
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
          border: none;
          background: transparent;
          color: var(--text-secondary);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--transition-base);
          font-weight: 500;
          text-decoration: none;
          position: relative;
        }

        .nav-item:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          transform: translateY(-1px);
        }

        .nav-item.active {
          background: var(--primary-50);
          color: var(--primary-600);
          font-weight: 600;
        }

        [data-theme="dark"] .nav-item.active {
          background: rgba(14, 165, 233, 0.1);
          color: var(--primary-400);
        }

        .nav-icon {
          font-size: 1.125rem;
        }

        .nav-label {
          font-size: 0.875rem;
        }

        .header-search {
          flex: 1;
          max-width: 400px;
        }

        .search-form {
          width: 100%;
        }

        .search-input-group {
          display: flex;
          align-items: center;
          background: var(--bg-primary);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-xl);
          padding: var(--space-2) var(--space-4);
          transition: all var(--transition-base);
        }

        .search-input-group:focus-within {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px rgb(14 165 233 / 0.1);
        }

        .search-icon {
          color: var(--text-tertiary);
          margin-right: var(--space-2);
        }

        .header-search-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          color: var(--text-primary);
          font-size: 0.875rem;
        }

        .header-search-input::placeholder {
          color: var(--text-tertiary);
        }

        .search-clear {
          background: none;
          border: none;
          color: var(--text-tertiary);
          cursor: pointer;
          padding: var(--space-1);
          margin-left: var(--space-2);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .action-item {
          position: relative;
        }

        .action-button {
          width: 2.5rem;
          height: 2.5rem;
          border: none;
          background: var(--bg-tertiary);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-base);
          font-size: 1.125rem;
          color: var(--text-secondary);
          position: relative;
        }

        .action-button:hover {
          background: var(--bg-quaternary);
          color: var(--text-primary);
          transform: translateY(-1px);
        }

        .action-button.active {
          background: var(--primary-500);
          color: white;
        }

        .notification-button {
          position: relative;
        }

        .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: var(--accent-error);
          color: white;
          font-size: 0.625rem;
          font-weight: 600;
          padding: 0.125rem 0.25rem;
          border-radius: var(--radius-full);
          min-width: 1rem;
          height: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-profile-button {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-2);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-xl);
          cursor: pointer;
          transition: all var(--transition-base);
          color: var(--text-primary);
        }

        .user-profile-button:hover {
          background: var(--bg-quaternary);
          border-color: var(--border-primary);
        }

        .user-avatar {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 0;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.875rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-progress {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-top: var(--space-1);
        }

        .progress-bar {
          width: 3rem;
          height: 0.25rem;
          background: var(--bg-primary);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--gradient-primary);
          border-radius: var(--radius-full);
          transition: width var(--transition-slow);
        }

        .level-text {
          font-size: 0.625rem;
          color: var(--text-tertiary);
          font-weight: 500;
        }

        .dropdown-arrow {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          transition: transform var(--transition-base);
        }

        .user-profile-button:hover .dropdown-arrow {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          min-width: 280px;
          z-index: var(--z-dropdown);
          overflow: hidden;
          margin-top: var(--space-2);
        }

        .quick-actions-menu {
          right: auto;
          left: 0;
          min-width: 200px;
        }

        .notifications-menu {
          min-width: 320px;
          max-height: 400px;
          overflow-y: auto;
        }

        .dropdown-header {
          padding: var(--space-4);
          border-bottom: 1px solid var(--border-primary);
          background: var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dropdown-header h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .clear-all-btn {
          background: none;
          border: none;
          color: var(--primary-600);
          font-size: 0.75rem;
          cursor: pointer;
          font-weight: 500;
        }

        .dropdown-section {
          padding: var(--space-2);
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          width: 100%;
          padding: var(--space-3) var(--space-4);
          border: none;
          background: none;
          color: var(--text-primary);
          text-align: left;
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--transition-base);
          font-size: 0.875rem;
        }

        .dropdown-item:hover {
          background: var(--bg-tertiary);
        }

        .logout-item {
          color: var(--accent-error);
        }

        .logout-item:hover {
          background: var(--error-50);
        }

        .item-icon {
          font-size: 1rem;
          flex-shrink: 0;
        }

        .item-label {
          flex: 1;
        }

        .user-profile-header {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .profile-avatar {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .profile-info h4 {
          margin: 0 0 var(--space-1) 0;
          font-size: 1rem;
        }

        .profile-info p {
          margin: 0 0 var(--space-2) 0;
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        .profile-stats {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .notifications-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .notification-item {
          padding: var(--space-3) var(--space-4);
          border-bottom: 1px solid var(--border-primary);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .notification-item:hover {
          background: var(--bg-tertiary);
        }

        .notification-item.unread {
          background: var(--primary-50);
        }

        [data-theme="dark"] .notification-item.unread {
          background: rgba(14, 165, 233, 0.05);
        }

        .notification-message {
          font-size: 0.875rem;
          color: var(--text-primary);
          margin: 0 0 var(--space-1) 0;
          line-height: 1.4;
        }

        .notification-time {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        .empty-state {
          text-align: center;
          padding: var(--space-8);
          color: var(--text-tertiary);
        }

        .empty-icon {
          font-size: 2rem;
          margin-bottom: var(--space-2);
          display: block;
        }

        .view-all {
          padding: var(--space-3);
          text-align: center;
          border-top: 1px solid var(--border-primary);
        }

        @media (max-width: 1024px) {
          .nav-label {
            display: none;
          }

          .header-search {
            max-width: 250px;
          }

          .user-info {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .header-container {
            padding: var(--space-3) var(--space-4);
            gap: var(--space-3);
          }

          .header-nav {
            display: none;
          }

          .header-search {
            max-width: 200px;
          }

          .brand-tagline {
            display: none;
          }

          .dropdown-menu {
            min-width: 250px;
          }
        }
      `}</style>
    </header>
  );
};

export default ProfessionalHeader;
