import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import EnhancedCourseList from './EnhancedCourseList';
import AIRecommendationEngine from './AIRecommendationEngine';
import GamificationSystem from './GamificationSystem';
import AIChatbot from './AIChatbot';
import QuickLogin from './QuickLogin';
import CommunityPage from './CommunityPage';
import CareerPage from './CareerPage';
import DashboardPage from './DashboardPage';
import ProfessionalHeader from './ProfessionalHeader';
import SearchSystem from './SearchSystem';
import { NotificationProvider, useNotifications } from './NotificationSystem';
import '../styles/design-system.css';
import '../styles/next-gen-course-catalog.css';
import '../styles/gamification.css';
import '../styles/next-gen-app.css';
import '../styles/chatbot.css';
import '../styles/professional-theme.css';

const NextGenAppContent = () => {
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const [activeView, setActiveView] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchFilters, setSearchFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setDarkMode(savedTheme === 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    addNotification(`Switched to ${newTheme} mode`, 'info', 2000);
  };

  // Professional notification system
  const showNotification = (message, type = 'info', duration = 5000, actions = []) => {
    return addNotification(message, type, duration, actions);
  };

  // Enhanced search functionality
  const handleSearch = (query, filters) => {
    setIsLoading(true);
    setSearchFilters({ query, ...filters });
    
    // Simulate search delay
    setTimeout(() => {
      setIsLoading(false);
      if (query) {
        showNotification(`Found results for "${query}"`, 'info', 3000);
      }
    }, 500);
  };

  // Filter change handler
  const handleFilterChange = (filters) => {
    setSearchFilters(prev => ({ ...prev, ...filters }));
  };

  // Course selection with notifications
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    showNotification(`Viewing ${course.title}`, 'course', 2000);
  };

  // Achievement notifications
  const handleAchievement = (achievement) => {
    showNotification(
      `🏆 Achievement Unlocked: ${achievement.title}!`,
      'achievement',
      8000,
      [
        {
          label: 'View Details',
          onClick: () => setActiveView('gamification')
        }
      ]
    );
  };

  // Course completion with certificate
  const handleCourseCompletion = (course) => {
    showNotification(
      `🎓 Congratulations! You completed ${course.title}`,
      'certificate',
      10000,
      [
        {
          label: 'Download Certificate',
          onClick: () => console.log('Download certificate')
        },
        {
          label: 'Share Achievement',
          onClick: () => setActiveView('community')
        }
      ]
    );
  };

  // Level up notifications
  const handleLevelUp = (newLevel) => {
    showNotification(
      `🚀 Level Up! You reached Level ${newLevel}!`,
      'achievement',
      8000,
      [
        {
          label: 'View Progress',
          onClick: () => setActiveView('gamification')
        }
      ]
    );
  };

  // Badge earned notifications
  const handleBadgeEarned = (badge) => {
    showNotification(
      `🏅 New Badge: ${badge.name}!`,
      'achievement',
      6000,
      [
        {
          label: 'View Collection',
          onClick: () => setActiveView('gamification')
        }
      ]
    );
  };

  // Navigation items
  const navigationItems = [
    { id: 'courses', label: 'Courses', icon: '📚' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'gamification', label: 'Progress', icon: '🎮' },
    { id: 'community', label: 'Community', icon: '👥' },
    { id: 'career', label: 'Career', icon: '💼' }
  ];

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <QuickLogin />;
  }

  return (
    <div className="next-gen-app">
      {/* Navigation Header */}
      <header className="app-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">🚀</span>
            <span className="logo-text">LearnNext</span>
          </div>
          
          <nav className="main-navigation">
            {navigationItems.map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                onClick={() => setActiveView(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="header-right">
          {/* Theme Toggle */}
          <button className="theme-toggle" onClick={toggleTheme}>
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* AI Chatbot Toggle */}
          <button 
            className="chatbot-toggle"
            onClick={() => setShowChatbot(!showChatbot)}
          >
            🤖 AI Mentor
          </button>

          {/* User Profile */}
          {isAuthenticated && (
            <div className="user-profile">
              <div className="user-avatar">
                {user?.avatar || '👤'}
              </div>
              <div className="user-info">
                <div className="user-name">{user?.firstName || 'User'}</div>
                <div className="user-level">Level {user?.gamification?.level || 1}</div>
              </div>
              <button 
                className="logout-btn"
                title="Logout"
                style={{
                  marginLeft: '1rem',
                  padding: '0.5rem',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {activeView === 'courses' && (
          <EnhancedCourseList
            user={user}
            onShowNotification={showNotification}
          />
        )}

        {activeView === 'dashboard' && (
          <DashboardPage 
            user={user}
            onShowNotification={showNotification}
            onLevelUp={handleLevelUp}
            onBadgeEarned={handleBadgeEarned}
          />
        )}
        
        {activeView === 'gamification' && (
          <GamificationSystem 
            user={user}
            onShowNotification={showNotification}
            onLevelUp={handleLevelUp}
            onBadgeEarned={handleBadgeEarned}
          />
        )}

        {activeView === 'community' && (
          <CommunityPage 
            user={user}
            onShowNotification={showNotification}
          />
        )}

        {activeView === 'career' && (
          <CareerPage 
            user={user}
            onShowNotification={showNotification}
          />
        )}
      </main>

      {/* AI Chatbot */}
      {showChatbot && (
        <AIChatbot
          user={user}
          currentCourse={selectedCourse}
          onClose={() => setShowChatbot(false)}
        />
      )}

    </div>
  );
};

// Main App Component with Notification Provider
const NextGenApp = () => {
  return (
    <NotificationProvider>
      <NextGenAppContent />
    </NotificationProvider>
  );
};

export default NextGenApp;
