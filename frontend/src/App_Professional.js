import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Core Components
import Header from './components/professional/Header';
import Sidebar from './components/professional/Sidebar';
import Footer from './components/professional/Footer';
import LoadingScreen from './components/professional/LoadingScreen';
import NotificationCenter from './components/professional/NotificationCenter';
import AIAssistant from './components/professional/AIAssistant';

// Pages
import HomePage from './pages/HomePage';
import CourseCatalog from './pages/CourseCatalog';
import CourseDetail from './pages/CourseDetail';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AIRecommendations from './pages/AIRecommendations';
import LearningPaths from './pages/LearningPaths';
import VirtualClassroom from './pages/VirtualClassroom';
import SkillAssessment from './pages/SkillAssessment';
import CommunityHub from './pages/CommunityHub';
import Analytics from './pages/Analytics';
import Certificates from './pages/Certificates';
import Marketplace from './pages/Marketplace';
import LiveSessions from './pages/LiveSessions';
import MentorConnect from './pages/MentorConnect';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Contexts
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AIProvider } from './contexts/AIContext';
import { LearningProvider } from './contexts/LearningContext';

// Services
import * as api from './services/api';

// Styles
import './styles/professional.css';
import './styles/animations.css';
import './styles/responsive.css';

function AppContent() {
  const { user, loading: authLoading, login, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [appData, setAppData] = useState({
    courses: [],
    categories: [],
    learningPaths: [],
    achievements: [],
    analytics: null
  });

  // Initialize app data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setGlobalLoading(true);
        
        // Load essential data
        const [coursesRes, categoriesRes] = await Promise.all([
          api.getCourses({ limit: 50 }),
          api.getCategories()
        ]);

        setAppData(prev => ({
          ...prev,
          courses: coursesRes.courses || [],
          categories: categoriesRes || []
        }));

        // If user is logged in, load personalized data
        if (user) {
          await loadUserData();
        }

      } catch (error) {
        console.error('App initialization failed:', error);
        addNotification('Failed to load application data', 'error');
      } finally {
        setGlobalLoading(false);
      }
    };

    initializeApp();
  }, [user]);

  const loadUserData = async () => {
    try {
      const [profileRes, analyticsRes, pathsRes] = await Promise.all([
        api.getUserProfile(),
        api.getUserAnalytics(),
        api.getLearningPaths()
      ]);

      setAppData(prev => ({
        ...prev,
        analytics: analyticsRes,
        learningPaths: pathsRes.paths || []
      }));
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, timestamp: new Date() };
    
    setNotifications(prev => [...prev, notification]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      addNotification('Welcome back! 🎉', 'success');
      setCurrentPage('dashboard');
    } catch (error) {
      addNotification('Login failed. Please check your credentials.', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('home');
    addNotification('You have been logged out successfully', 'info');
  };

  if (authLoading || globalLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app-container">
      <Header 
        user={user}
        onPageChange={handlePageChange}
        currentPage={currentPage}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        onAIAssistantToggle={() => setAiAssistantOpen(!aiAssistantOpen)}
        onLogout={handleLogout}
        notifications={notifications}
      />

      <div className="app-body">
        {user && (
          <Sidebar 
            isOpen={sidebarOpen}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            user={user}
            learningProgress={appData.analytics?.progress || 0}
          />
        )}

        <main className={`main-content ${user ? 'with-sidebar' : 'full-width'}`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <HomePage 
                courses={appData.courses.slice(0, 8)}
                categories={appData.categories}
                onPageChange={handlePageChange}
              />
            } />
            
            <Route path="/courses" element={
              <CourseCatalog 
                courses={appData.courses}
                categories={appData.categories}
                onNotification={addNotification}
              />
            } />
            
            <Route path="/course/:id" element={
              <CourseDetail 
                onNotification={addNotification}
                user={user}
              />
            } />

            {/* Auth Routes */}
            <Route path="/login" element={
              user ? <Navigate to="/dashboard" /> : 
              <Login onLogin={handleLogin} onNotification={addNotification} />
            } />
            
            <Route path="/register" element={
              user ? <Navigate to="/dashboard" /> : 
              <Register onNotification={addNotification} />
            } />

            {/* Protected Routes */}
            {user ? (
              <>
                <Route path="/dashboard" element={
                  <Dashboard 
                    user={user}
                    analytics={appData.analytics}
                    onNotification={addNotification}
                    onPageChange={handlePageChange}
                  />
                } />
                
                <Route path="/profile" element={
                  <Profile 
                    user={user}
                    onNotification={addNotification}
                    onUserUpdate={loadUserData}
                  />
                } />
                
                <Route path="/ai-recommendations" element={
                  <AIRecommendations 
                    user={user}
                    courses={appData.courses}
                    onNotification={addNotification}
                  />
                } />
                
                <Route path="/learning-paths" element={
                  <LearningPaths 
                    paths={appData.learningPaths}
                    userProgress={appData.analytics}
                    onNotification={addNotification}
                  />
                } />
                
                <Route path="/virtual-classroom" element={
                  <VirtualClassroom 
                    user={user}
                    onNotification={addNotification}
                  />
                } />
                
                <Route path="/skill-assessment" element={
                  <SkillAssessment 
                    user={user}
                    onNotification={addNotification}
                  />
                } />
                
                <Route path="/community" element={
                  <CommunityHub 
                    user={user}
                    onNotification={addNotification}
                  />
                } />
                
                <Route path="/analytics" element={
                  <Analytics 
                    user={user}
                    analytics={appData.analytics}
                    onNotification={addNotification}
                  />
                } />
                
                <Route path="/certificates" element={
                  <Certificates 
                    user={user}
                    onNotification={addNotification}
                  />
                } />
                
                <Route path="/marketplace" element={
                  <Marketplace 
                    user={user}
                    onNotification={addNotification}
                  />
                } />
                
                <Route path="/live-sessions" element={
                  <LiveSessions 
                    user={user}
                    onNotification={addNotification}
                  />
                } />
                
                <Route path="/mentors" element={
                  <MentorConnect 
                    user={user}
                    onNotification={addNotification}
                  />
                } />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </main>
      </div>

      <Footer />

      {/* Global Components */}
      <NotificationCenter 
        notifications={notifications}
        onRemove={removeNotification}
      />

      {user && (
        <AIAssistant 
          isOpen={aiAssistantOpen}
          onClose={() => setAiAssistantOpen(false)}
          user={user}
          currentPage={currentPage}
          onNotification={addNotification}
        />
      )}

      {/* Background Effects */}
      <div className="app-background-effects">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <AIProvider>
              <LearningProvider>
                <AppContent />
              </LearningProvider>
            </AIProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
