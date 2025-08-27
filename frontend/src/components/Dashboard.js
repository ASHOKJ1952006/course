import React, { useState, useEffect } from 'react';
import * as api from '../services/api';

const Dashboard = ({ user, onViewChange, onShowNotification }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCompleted: 0,
    totalEnrolled: 0,
    totalHours: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [recommendationsData] = await Promise.all([
        api.getRecommendations()
      ]);

      // ensure recommendationsData is valid
      const recs = recommendationsData?.recommendations || [];
      setRecommendations(recs.slice(0, 4));

      // Calculate stats
      const totalCompleted = user?.completedCourses?.length || 0;
      const totalEnrolled = user?.enrolledCourses?.length || 0;
      const totalHours =
        user?.completedCourses?.reduce((sum, course) => {
          return sum + (course?.courseId?.duration || 0);
        }, 0) || 0;

      setStats({
        totalCompleted,
        totalEnrolled,
        totalHours
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      onShowNotification?.('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    try {
      await api.seedData();
      onShowNotification?.('Sample data added successfully!', 'success');
      fetchDashboardData(); // Refresh recommendations
    } catch (error) {
      onShowNotification?.('Failed to add sample data', 'error');
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.username || 'Learner'}!</h1>
        <p>Continue your learning journey</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon completed">📚</div>
          <div className="stat-info">
            <h3>{stats.totalCompleted}</h3>
            <p>Courses Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon enrolled">🎯</div>
          <div className="stat-info">
            <h3>{stats.totalEnrolled}</h3>
            <p>Currently Enrolled</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon hours">⏰</div>
          <div className="stat-info">
            <h3>{stats.totalHours}</h3>
            <p>Hours Learned</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon progress">🏆</div>
          <div className="stat-info">
            <h3>{user?.interests?.length || 0}</h3>
            <p>Interest Areas</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button 
            className="action-button primary"
            onClick={() => onViewChange('courses')}
          >
            Browse All Courses
          </button>
          <button 
            className="action-button secondary"
            onClick={() => onViewChange('recommendations')}
          >
            View Recommendations
          </button>
          <button 
            className="action-button secondary"
            onClick={() => onViewChange('profile')}
          >
            Update Profile
          </button>
          <button 
            className="action-button tertiary"
            onClick={handleSeedData}
          >
            Add Sample Data
          </button>
        </div>
      </div>

      {/* Current Enrollments */}
      {user?.enrolledCourses?.length > 0 && (
        <div className="dashboard-section">
          <h2>Continue Learning</h2>
          <div className="enrolled-courses">
            {user.enrolledCourses.slice(0, 3).map((enrollment, idx) => (
              <div key={enrollment?.courseId?._id || idx} className="enrolled-course-card">
                <div className="course-thumbnail">
                  <img 
                    src={enrollment?.courseId?.thumbnail || '/api/placeholder/150/100'} 
                    alt={enrollment?.courseId?.title || 'Course'}
                    onError={(e) => {
                      e.target.src = '/api/placeholder/150/100';
                    }}
                  />
                </div>
                <div className="course-info">
                  <h4>{enrollment?.courseId?.title || 'Untitled Course'}</h4>
                  <p>{enrollment?.courseId?.instructor || 'Unknown Instructor'}</p>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${enrollment?.progress || 0}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{enrollment?.progress || 0}% Complete</span>
                </div>
                <button 
                  className="continue-button"
                  onClick={() => onViewChange('courseDetail', enrollment?.courseId)}
                >
                  Continue
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Courses */}
      {recommendations.length > 0 && (
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recommended for You</h2>
            <button 
              className="view-all-button"
              onClick={() => onViewChange('recommendations')}
            >
              View All
            </button>
          </div>
          <div className="recommendations-grid">
            {recommendations.map((course, idx) => (
              <div key={course?._id || idx} className="recommendation-card">
                <div className="course-thumbnail">
                  <img 
                    src={course?.thumbnail || '/api/placeholder/200/120'} 
                    alt={course?.title || 'Course'}
                    onError={(e) => {
                      e.target.src = '/api/placeholder/200/120';
                    }}
                  />
                  <div className="course-level">{course?.level || 'All Levels'}</div>
                </div>
                <div className="course-content">
                  <h4>{course?.title || 'Untitled Course'}</h4>
                  <p className="instructor">by {course?.instructor || 'Unknown'}</p>
                  <div className="course-meta">
                    <span className="rating">
                      ⭐ {(course?.rating || 0).toFixed(1)}
                    </span>
                    <span className="duration">
                      {course?.duration || 0}h
                    </span>
                    <span className="price">
                      ${course?.price || 0}
                    </span>
                  </div>
                  <div className="course-tags">
                    {(course?.tags || []).slice(0, 2).map((tag, i) => (
                      <span key={i} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
                <button 
                  className="view-course-button"
                  onClick={() => onViewChange('courseDetail', course)}
                >
                  View Course
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {user?.completedCourses?.length > 0 && (
        <div className="dashboard-section">
          <h2>Recent Achievements</h2>
          <div className="recent-activity">
            {user.completedCourses.slice(-3).map((completion, idx) => (
              <div key={completion?.courseId?._id || idx} className="activity-item">
                <div className="activity-icon">🎉</div>
                <div className="activity-info">
                  <p>
                    <strong>Completed:</strong> {completion?.courseId?.title || 'Untitled Course'}
                  </p>
                  <span className="activity-date">
                    {completion?.completedAt ? new Date(completion.completedAt).toLocaleDateString() : ''}
                  </span>
                </div>
                {completion?.rating && (
                  <div className="activity-rating">
                    {'⭐'.repeat(completion.rating)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Getting Started Message */}
      {stats.totalCompleted === 0 && stats.totalEnrolled === 0 && (
        <div className="getting-started">
          <div className="getting-started-content">
            <h3>🚀 Ready to start learning?</h3>
            <p>
              Explore our course catalog and find courses that match your interests. 
              Our recommendation system will help you discover the perfect learning path!
            </p>
            <div className="getting-started-actions">
              <button 
                className="action-button primary"
                onClick={() => onViewChange('courses')}
              >
                Browse Courses
              </button>
              <button 
                className="action-button secondary"
                onClick={() => onViewChange('profile')}
              >
                Set Your Interests
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
