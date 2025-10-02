import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import NextGenCourseList from './NextGenCourseList';
import '../styles/design-system.css';
import '../styles/next-gen-course-catalog.css';

const SimpleNextGenApp = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeView] = useState('courses');
  const [notifications, setNotifications] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

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
  };

  // Show notification
  const showNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  return (
    <div className="next-gen-app">
      {/* Simple Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🚀</span>
          <span style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            LearnNext
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            style={{
              padding: '0.5rem',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* User Profile */}
          {isAuthenticated && user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 0.75rem',
              background: 'var(--bg-secondary)',
              borderRadius: '0.75rem',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ fontSize: '1.25rem' }}>👤</div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                  {user?.firstName || 'User'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  Level {user?.gamification?.level || 1}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
        {activeView === 'courses' && (
          <NextGenCourseList
            user={user}
            onCourseSelect={() => {}}
            onShowNotification={showNotification}
          />
        )}
      </main>

      {/* Notifications */}
      <div style={{
        position: 'fixed',
        top: '5rem',
        right: '1.5rem',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxWidth: '400px'
      }}>
        {notifications.map(notification => (
          <div
            key={notification.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.5rem',
              background: 'var(--bg-primary)',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              border: `1px solid ${
                notification.type === 'success' ? 'var(--accent-success)' :
                notification.type === 'error' ? 'var(--accent-error)' :
                notification.type === 'warning' ? 'var(--accent-warning)' :
                'var(--accent-info)'
              }`,
              borderLeft: `4px solid ${
                notification.type === 'success' ? 'var(--accent-success)' :
                notification.type === 'error' ? 'var(--accent-error)' :
                notification.type === 'warning' ? 'var(--accent-warning)' :
                'var(--accent-info)'
              }`,
              animation: 'slideInRight 0.3s ease-out'
            }}
          >
            <div style={{ flex: 1, fontSize: '0.875rem' }}>
              {notification.message}
            </div>
            <button
              onClick={() => setNotifications(prev => 
                prev.filter(n => n.id !== notification.id)
              )}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-tertiary)',
                cursor: 'pointer',
                fontSize: '1.125rem',
                padding: '0.25rem',
                marginLeft: '0.75rem'
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Success Message */}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '2rem',
        boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
        fontSize: '0.875rem',
        fontWeight: '600',
        zIndex: 10000,
        animation: 'bounce 2s infinite'
      }}>
        🎉 Next-Generation Platform Loaded Successfully!
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateX(-50%) translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateX(-50%) translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
      `}</style>
    </div>
  );
};

export default SimpleNextGenApp;
