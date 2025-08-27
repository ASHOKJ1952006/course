import React, { useState, useEffect } from 'react';
import './App.css';

// Components
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CourseList from './components/CourseList';
import CourseDetail from './components/CourseDetail';
import Profile from './components/Profile';
import Recommendations from './components/Recommendations';
import LoadingSpinner from './components/LoadingSpinner';

// API Service
import * as api from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = await api.getUserProfile();
      setUser(userData);
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await api.login(credentials);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setCurrentView('dashboard');
      showNotification('Login successful!', 'success');
    } catch (error) {
      showNotification(error.message || 'Login failed', 'error');
    }
  };

  const handleRegister = async (userData) => {
    try {
      const response = await api.register(userData);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setCurrentView('dashboard');
      showNotification('Registration successful!', 'success');
    } catch (error) {
      showNotification(error.message || 'Registration failed', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCurrentView('login');
    showNotification('Logged out successfully', 'success');
  };

  const handleViewChange = (view, data = null) => {
    setCurrentView(view);
    if (view === 'courseDetail' && data) {
      setSelectedCourse(data);
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleCourseEnroll = async (courseId) => {
    try {
      await api.enrollInCourse(courseId);
      showNotification('Successfully enrolled in course!', 'success');
      // Refresh user data
      const userData = await api.getUserProfile();
      setUser(userData);
    } catch (error) {
      showNotification(error.message || 'Enrollment failed', 'error');
    }
  };

  const handleCourseComplete = async (courseId, rating) => {
    try {
      await api.completeCourse(courseId, rating);
      showNotification('Course completed successfully!', 'success');
      // Refresh user data
      const userData = await api.getUserProfile();
      setUser(userData);
    } catch (error) {
      showNotification(error.message || 'Failed to complete course', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
          <button 
            className="notification-close"
            onClick={() => setNotification(null)}
          >
            ×
          </button>
        </div>
      )}

      {user && (
        <Header 
          user={user}
          currentView={currentView}
          onViewChange={handleViewChange}
          onLogout={handleLogout}
        />
      )}

      <main className="main-content">
        {!user ? (
          currentView === 'register' ? (
            <Register 
              onRegister={handleRegister}
              onSwitchToLogin={() => setCurrentView('login')}
            />
          ) : (
            <Login 
              onLogin={handleLogin}
              onSwitchToRegister={() => setCurrentView('register')}
            />
          )
        ) : (
          <>
            {currentView === 'dashboard' && (
              <Dashboard 
                user={user}
                onViewChange={handleViewChange}
                onShowNotification={showNotification}
              />
            )}
            
            {currentView === 'courses' && (
              <CourseList 
                onCourseSelect={(course) => handleViewChange('courseDetail', course)}
                onShowNotification={showNotification}
              />
            )}
            
            {currentView === 'courseDetail' && selectedCourse && (
              <CourseDetail 
                course={selectedCourse}
                user={user}
                onEnroll={handleCourseEnroll}
                onComplete={handleCourseComplete}
                onBack={() => handleViewChange('courses')}
                onShowNotification={showNotification}
              />
            )}
            
            {currentView === 'recommendations' && (
              <Recommendations 
                onCourseSelect={(course) => handleViewChange('courseDetail', course)}
                onShowNotification={showNotification}
              />
            )}
            
            {currentView === 'profile' && (
              <Profile 
                user={user}
                onUpdateUser={setUser}
                onShowNotification={showNotification}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;