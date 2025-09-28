import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header = ({ user, currentView, onViewChange, onLogout }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <h1 className="logo" onClick={() => onViewChange('dashboard')}>
            EduRecommend
          </h1>
        </div>

        <nav className="header-nav">
          <button
            className={`nav-button ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => onViewChange('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-button ${currentView === 'courses' ? 'active' : ''}`}
            onClick={() => onViewChange('courses')}
          >
            Browse Courses
          </button>
          <button
            className={`nav-button ${currentView === 'recommendations' ? 'active' : ''}`}
            onClick={() => onViewChange('recommendations')}
          >
            Recommended
          </button>
          <button
            className={`nav-button ${currentView === 'profile' ? 'active' : ''}`}
            onClick={() => onViewChange('profile')}
          >
            Profile
          </button>
        </nav>

        <div className="header-right">
          <div className="user-info">
            <ThemeToggle />
            <span className="user-name">Welcome, {user.username}!</span>
            <div className="user-dropdown">
              <button className="dropdown-toggle">
                <div className="avatar">
                  {user.username && user.username.charAt(0).toUpperCase()}
                </div>
              </button>
              <div className="dropdown-menu">
                <button onClick={() => onViewChange('profile')}>
                  My Profile
                </button>
                <button onClick={onLogout} className="logout-button">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;