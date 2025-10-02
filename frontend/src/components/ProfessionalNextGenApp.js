import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import EnhancedCourseList from './EnhancedCourseList';
import DashboardPage from './DashboardPage';
import CommunityPage from './CommunityPage';
import CareerPage from './CareerPage';
import GamificationSystem from './GamificationSystem';
import AIChatbot from './AIChatbot';
import QuickLogin from './QuickLogin';
import ProfessionalHeader from './ProfessionalHeader';
import SearchSystem from './SearchSystem';
import { NotificationProvider, useNotifications } from './NotificationSystem';
import '../styles/professional-theme.css';
import '../styles/professional-ui.css';

const ProfessionalNextGenAppContent = () => {
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

  // Welcome notification for new users
  useEffect(() => {
    if (isAuthenticated && user) {
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
      if (!hasSeenWelcome) {
        setTimeout(() => {
          addNotification(
            `Welcome to LearnNext, ${user.firstName}! 🎉`,
            'success',
            8000,
            [
              {
                label: 'Take Tour',
                onClick: () => setActiveView('dashboard')
              },
              {
                label: 'Browse Courses',
                onClick: () => setActiveView('courses')
              }
            ]
          );
          localStorage.setItem('hasSeenWelcome', 'true');
        }, 2000);
      }
    }
  }, [isAuthenticated, user, addNotification]);

  // Professional notification system
  const showNotification = (message, type = 'info', duration = 5000, actions = []) => {
    return addNotification(message, type, duration, actions);
  };

  // Toggle theme with notification
  const handleThemeToggle = () => {
    const newTheme = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    showNotification(`Switched to ${newTheme} mode`, 'info', 2000);
  };

  // Enhanced search functionality
  const handleSearch = (query, filters) => {
    setIsLoading(true);
    setSearchFilters({ query, ...filters });
    
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

  // Course completion with certificate
  const handleCourseCompletion = (course) => {
    showNotification(
      `🎓 Congratulations! You completed ${course.title}`,
      'certificate',
      10000,
      [
        {
          label: 'Download Certificate',
          onClick: () => {
            // Generate and download certificate
            const link = document.createElement('a');
            link.href = '#';
            link.download = `${course.title}-certificate.pdf`;
            link.click();
            showNotification('Certificate downloaded successfully!', 'success', 3000);
          }
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

  // Enhanced course enrollment
  const handleCourseEnrollment = (courseId, courseName) => {
    showNotification(
      `Successfully enrolled in ${courseName}!`,
      'success',
      5000,
      [
        {
          label: 'Start Learning',
          onClick: () => {
            setActiveView('courses');
            showNotification('Welcome to your new course! 📚', 'course', 3000);
          }
        },
        {
          label: 'View Dashboard',
          onClick: () => setActiveView('dashboard')
        }
      ]
    );
  };

  // Professional error handling
  const handleError = (error, context = '') => {
    console.error(`Error in ${context}:`, error);
    showNotification(
      `Something went wrong${context ? ` with ${context}` : ''}. Please try again.`,
      'error',
      5000,
      [
        {
          label: 'Retry',
          onClick: () => window.location.reload()
        }
      ]
    );
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <QuickLogin />;
  }

  return (
    <div className="professional-app">
      {/* Professional Header */}
      <ProfessionalHeader
        activeView={activeView}
        setActiveView={setActiveView}
        darkMode={darkMode}
        setDarkMode={handleThemeToggle}
        showChatbot={showChatbot}
        setShowChatbot={setShowChatbot}
      />

      {/* Main Content Area */}
      <main className="app-main-content">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner animate-spin"></div>
            <p>Loading...</p>
          </div>
        )}

        {/* Course Catalog with Enhanced Search */}
        {activeView === 'courses' && (
          <div className="courses-view fade-in">
            <div className="view-header">
              <h1 className="heading-primary">🎓 Course Catalog</h1>
              <p className="text-secondary">Discover courses tailored to your interests and career goals</p>
            </div>
            
            <div className="professional-card">
              <SearchSystem
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                placeholder="Search courses, skills, or topics..."
              />
            </div>
            
            <EnhancedCourseList
              user={user}
              onCourseSelect={handleCourseSelect}
              onShowNotification={showNotification}
              onCourseEnrollment={handleCourseEnrollment}
              onCourseCompletion={handleCourseCompletion}
              searchFilters={searchFilters}
            />
          </div>
        )}

        {/* Learning Dashboard */}
        {activeView === 'dashboard' && (
          <DashboardPage
            user={user}
            onShowNotification={showNotification}
            onLevelUp={handleLevelUp}
            onBadgeEarned={handleBadgeEarned}
            onAchievement={handleAchievement}
          />
        )}

        {/* Community Features */}
        {activeView === 'community' && (
          <CommunityPage
            user={user}
            onShowNotification={showNotification}
          />
        )}

        {/* Career Development */}
        {activeView === 'career' && (
          <CareerPage
            user={user}
            onShowNotification={showNotification}
          />
        )}

        {/* Gamification & Progress */}
        {activeView === 'gamification' && (
          <GamificationSystem
            user={user}
            onShowNotification={showNotification}
            onLevelUp={handleLevelUp}
            onBadgeEarned={handleBadgeEarned}
            onAchievement={handleAchievement}
          />
        )}

        {/* Overall Report */}
        {activeView === 'overall-report' && (
          <div className="overall-report-view fade-in">
            <div className="view-header">
              <h1 className="heading-primary">📊 Overall Report</h1>
              <p className="text-secondary">Comprehensive analytics and performance insights</p>
            </div>
            <div className="professional-grid grid-2">
              <div className="professional-card">
                <h3 className="heading-tertiary">Learning Progress</h3>
                <div className="progress-stats space-y-4">
                  <div className="stat">
                    <span className="stat-value">{user?.completedCourses?.length || 0}</span>
                    <span className="stat-label">Courses Completed</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{user?.learningStats?.totalHours || 0}h</span>
                    <span className="stat-label">Total Learning Time</span>
                  </div>
                </div>
              </div>
              <div className="professional-card">
                <h3 className="heading-tertiary">Performance Metrics</h3>
                <div className="progress-container">
                  <div className="progress-bar" style={{width: '75%'}}></div>
                </div>
                <p className="text-secondary">Overall Progress: 75%</p>
              </div>
            </div>
          </div>
        )}

        {/* Assessments */}
        {activeView === 'assessments' && (
          <div className="assessments-view fade-in">
            <div className="view-header">
              <h1 className="heading-primary">📝 Assessments</h1>
              <p className="text-secondary">Tests, quizzes, and evaluations</p>
            </div>
            <div className="professional-grid grid-3">
              <div className="professional-card">
                <h3 className="heading-tertiary">JavaScript Fundamentals Quiz</h3>
                <p className="text-secondary">Test your JavaScript knowledge</p>
                <button 
                  className="btn-professional btn-primary"
                  onClick={() => showNotification('Starting JavaScript assessment...', 'info')}
                >
                  Start Assessment
                </button>
              </div>
              <div className="professional-card">
                <h3 className="heading-tertiary">React Components Test</h3>
                <p className="text-secondary">Evaluate your React skills</p>
                <button 
                  className="btn-professional btn-primary"
                  onClick={() => showNotification('Starting React assessment...', 'info')}
                >
                  Start Assessment
                </button>
              </div>
              <div className="professional-card">
                <h3 className="heading-tertiary">AI/ML Concepts Quiz</h3>
                <p className="text-secondary">Test your AI and Machine Learning knowledge</p>
                <button 
                  className="btn-professional btn-primary"
                  onClick={() => showNotification('Starting AI/ML assessment...', 'info')}
                >
                  Start Assessment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contest Calendar */}
        {activeView === 'contest-calendar' && (
          <div className="contest-calendar-view">
            <h1 className="view-title">🏆 Contest Calendar</h1>
            <p className="view-subtitle">Upcoming coding competitions and challenges</p>
            <div className="calendar-grid">
              <div className="contest-card">
                <h3>Weekly Coding Challenge</h3>
                <p>Every Monday at 8:00 PM</p>
                <span className="contest-status upcoming">Upcoming</span>
              </div>
              <div className="contest-card">
                <h3>Algorithm Master Contest</h3>
                <p>Saturday, 2:00 PM</p>
                <span className="contest-status live">Live Now</span>
              </div>
            </div>
          </div>
        )}

        {/* DSA Sheets */}
        {activeView === 'dsa-sheets' && (
          <div className="dsa-sheets-view">
            <h1 className="view-title">📊 DSA Sheets</h1>
            <p className="view-subtitle">Master Data Structures and Algorithms</p>
            <div className="dsa-grid">
              <div className="dsa-card">
                <h3>Array Problems</h3>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '75%'}}></div>
                </div>
                <span>15/20 completed</span>
              </div>
              <div className="dsa-card">
                <h3>Linked Lists</h3>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '60%'}}></div>
                </div>
                <span>12/20 completed</span>
              </div>
            </div>
          </div>
        )}

        {/* IDE */}
        {activeView === 'ide' && (
          <div className="ide-view">
            <h1 className="view-title">💻 Integrated Development Environment</h1>
            <div className="ide-container">
              <div className="code-editor">
                <div className="editor-header">
                  <span>main.js</span>
                  <button className="btn btn-primary">Run Code</button>
                </div>
                <div className="editor-content">
                  <pre>{`function hello() {
  console.log("Hello, World!");
}

hello();`}</pre>
                </div>
              </div>
              <div className="output-panel">
                <h4>Output</h4>
                <div className="output-content">Hello, World!</div>
              </div>
            </div>
          </div>
        )}

        {/* AI Interview */}
        {activeView === 'ai-interview' && (
          <div className="ai-interview-view">
            <h1 className="view-title">🎤 AI Interview Practice</h1>
            <p className="view-subtitle">Practice interviews with our AI interviewer</p>
            <div className="interview-options">
              <div className="interview-card">
                <h3>Technical Interview</h3>
                <p>Practice coding problems and technical questions</p>
                <button className="btn btn-primary">Start Interview</button>
              </div>
              <div className="interview-card">
                <h3>Behavioral Interview</h3>
                <p>Practice soft skills and behavioral questions</p>
                <button className="btn btn-primary">Start Interview</button>
              </div>
            </div>
          </div>
        )}

        {/* Resume Builder */}
        {activeView === 'resume-builder' && (
          <div className="resume-builder-view">
            <h1 className="view-title">📄 Resume Builder</h1>
            <p className="view-subtitle">Create professional resumes with AI assistance</p>
            <div className="resume-templates">
              <div className="template-card">
                <h3>Modern Template</h3>
                <div className="template-preview"></div>
                <button className="btn btn-primary">Use Template</button>
              </div>
              <div className="template-card">
                <h3>Classic Template</h3>
                <div className="template-preview"></div>
                <button className="btn btn-primary">Use Template</button>
              </div>
            </div>
          </div>
        )}

        {/* GPS Leaderboard */}
        {activeView === 'gps-leaderboard' && (
          <div className="leaderboard-view">
            <h1 className="view-title">📈 GPS Leaderboard</h1>
            <p className="view-subtitle">Global Performance Statistics</p>
            <div className="leaderboard-table">
              <div className="leaderboard-header">
                <span>Rank</span>
                <span>Name</span>
                <span>Score</span>
                <span>Country</span>
              </div>
              <div className="leaderboard-row">
                <span>1</span>
                <span>John Doe</span>
                <span>2,450</span>
                <span>🇺🇸 USA</span>
              </div>
              <div className="leaderboard-row current-user">
                <span>15</span>
                <span>You</span>
                <span>1,250</span>
                <span>🇮🇳 India</span>
              </div>
            </div>
          </div>
        )}

        {/* Live Session */}
        {activeView === 'live-session' && (
          <div className="live-session-view">
            <h1 className="view-title">👥 Live Sessions</h1>
            <p className="view-subtitle">Join interactive learning sessions</p>
            <div className="live-sessions">
              <div className="session-card live">
                <span className="live-badge">🔴 LIVE</span>
                <h3>React Advanced Patterns</h3>
                <p>with Sarah Chen • 45 participants</p>
                <button className="btn btn-primary">Join Now</button>
              </div>
              <div className="session-card upcoming">
                <span className="upcoming-badge">⏰ UPCOMING</span>
                <h3>Python Data Science</h3>
                <p>with Mike Rodriguez • Starts in 2 hours</p>
                <button className="btn btn-outline">Set Reminder</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* AI Chatbot */}
      {showChatbot && (
        <AIChatbot
          user={user}
          currentCourse={selectedCourse}
          onClose={() => setShowChatbot(false)}
          onShowNotification={showNotification}
        />
      )}

      {/* Professional Styling */}
      <style jsx>{`
        .professional-app {
          min-height: 100vh;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-family: var(--font-sans);
        }

        .app-main-content {
          position: relative;
          min-height: calc(100vh - 80px);
          padding: var(--space-6);
          max-width: 1400px;
          margin: 0 auto;
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: var(--z-modal);
          backdrop-filter: blur(4px);
        }

        .loading-spinner {
          width: 2rem;
          height: 2rem;
          border: 3px solid var(--bg-tertiary);
          border-top-color: var(--primary-600);
          border-radius: 50%;
          margin-bottom: var(--space-4);
        }

        .courses-view {
          animation: fadeIn 0.3s ease-out;
        }

        .view-header {
          text-align: center;
          margin-bottom: var(--space-8);
        }

        .view-title {
          font-size: 2.5rem;
          font-weight: 700;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: var(--space-2);
        }

        .view-subtitle {
          font-size: 1.125rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .app-main-content {
            padding: var(--space-4);
          }

          .view-title {
            font-size: 2rem;
          }

          .view-subtitle {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .app-main-content {
            padding: var(--space-3);
          }

          .view-title {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
};

// Main App Component with Notification Provider
const ProfessionalNextGenApp = () => {
  return (
    <NotificationProvider>
      <ProfessionalNextGenAppContent />
    </NotificationProvider>
  );
};

export default ProfessionalNextGenApp;
