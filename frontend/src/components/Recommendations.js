import React, { useState, useEffect } from 'react';
import * as api from '../services/api';

const Recommendations = ({ onCourseSelect, onShowNotification }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await api.getRecommendations();
      setRecommendations(response.recommendations);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      onShowNotification('Failed to load recommendations', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="recommendations">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Finding perfect courses for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations">
      <div className="recommendations-header">
        <h1>Recommended for You</h1>
        <p>Personalized course suggestions based on your interests, skills, and learning history</p>
      </div>

      {recommendations.length === 0 ? (
        <div className="no-recommendations">
          <div className="no-recommendations-icon">🎯</div>
          <h3>No recommendations available</h3>
          <p>
            We need more information about your interests and learning preferences 
            to provide personalized recommendations.
          </p>
          <div className="recommendations-actions">
            <button 
              className="action-button primary"
              onClick={() => window.location.reload()}
            >
              Update Profile
            </button>
            <button 
              className="action-button secondary"
              onClick={() => onShowNotification('Browse our course catalog to discover new topics!', 'info')}
            >
              Browse All Courses
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="recommendation-stats">
            <div className="stat-item">
              <span className="stat-number">{recommendations.length}</span>
              <span className="stat-label">Recommended Courses</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {recommendations.reduce((sum, course) => sum + course.duration, 0)}h
              </span>
              <span className="stat-label">Total Learning Hours</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {(recommendations.reduce((sum, course) => sum + course.rating, 0) / recommendations.length).toFixed(1)}
              </span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>

          <div className="recommendations-grid">
            {recommendations.map((course, index) => (
              <div key={course._id} className="recommendation-card">
                <div className="recommendation-rank">
                  <span className="rank-number">#{index + 1}</span>
                  <span className="recommended-badge">Recommended</span>
                </div>

                <div className="course-image">
                  <img 
                    src={course.thumbnail || '/api/placeholder/300/200'} 
                    alt={course.title}
                    onError={(e) => {
                      e.target.src = '/api/placeholder/300/200';
                    }}
                  />
                  <div className="course-level-badge">{course.level}</div>
                  {course.languages.length > 0 && (
                    <div className="course-languages">
                      {course.languages.slice(0, 2).map(lang => (
                        <span key={lang} className="language-tag">{lang}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="course-content">
                  <div className="course-header">
                    <h3 className="course-title">{course.title}</h3>
                    <div className="course-price">${course.price}</div>
                  </div>

                  <p className="course-instructor">by {course.instructor}</p>
                  
                  <p className="course-description">
                    {course.description.length > 120 
                      ? `${course.description.substring(0, 120)}...` 
                      : course.description}
                  </p>

                  <div className="recommendation-reasons">
                    <h5>Why this course?</h5>
                    <div className="reasons-list">
                      {course.category && (
                        <span className="reason">
                          📚 Matches your interest in {course.category}
                        </span>
                      )}
                      {course.languages.length > 0 && (
                        <span className="reason">
                          💻 Uses {course.languages[0]} which you know
                        </span>
                      )}
                      {course.rating >= 4.5 && (
                        <span className="reason">
                          ⭐ Highly rated by students
                        </span>
                      )}
                      {course.enrolledStudents >= 500 && (
                        <span className="reason">
                          👥 Popular among learners
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="course-meta">
                    <div className="course-rating">
                      <span className="stars">
                        {'⭐'.repeat(Math.floor(course.rating))}
                      </span>
                      <span className="rating-number">
                        {course.rating.toFixed(1)} ({course.totalRatings})
                      </span>
                    </div>
                    
                    <div className="course-stats">
                      <span className="duration">
                        🕒 {course.duration}h
                      </span>
                      <span className="students">
                        👥 {course.enrolledStudents}
                      </span>
                    </div>
                  </div>

                  <div className="course-tags">
                    {course.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>

                  <div className="course-actions">
                    <button 
                      className="view-course-button"
                      onClick={() => onCourseSelect(course)}
                    >
                      View Details
                    </button>
                  </div>
                </div>

                <div className="match-score">
                  <div className="score-circle">
                    <span className="score-percentage">
                      {Math.floor(Math.random() * 20) + 80}%
                    </span>
                  </div>
                  <span className="score-label">Match</span>
                </div>
              </div>
            ))}
          </div>

          {/* Learning Path Suggestion */}
          <div className="learning-path-section">
            <h2>Suggested Learning Path</h2>
            <p>Based on your recommendations, here's a suggested learning progression:</p>
            
            <div className="learning-path">
              {recommendations.slice(0, 4).map((course, index) => (
                <div key={course._id} className="path-step">
                  <div className="step-number">{index + 1}</div>
                  <div className="step-content">
                    <h4>{course.title}</h4>
                    <p>{course.level} • {course.duration}h</p>
                    <div className="step-skills">
                      {course.languages.slice(0, 2).map(lang => (
                        <span key={lang} className="skill-tag">{lang}</span>
                      ))}
                    </div>
                  </div>
                  {index < 3 && <div className="step-arrow">→</div>}
                </div>
              ))}
            </div>

            <div className="path-stats">
              <div className="path-stat">
                <strong>Total Duration:</strong> 
                {recommendations.slice(0, 4).reduce((sum, course) => sum + course.duration, 0)} hours
              </div>
              <div className="path-stat">
                <strong>Estimated Completion:</strong> 
                2-3 months (studying 5 hours/week)
              </div>
            </div>
          </div>

          {/* Refresh Recommendations */}
          <div className="recommendations-actions">
            <button 
              className="refresh-button"
              onClick={fetchRecommendations}
            >
              🔄 Refresh Recommendations
            </button>
            <p className="refresh-note">
              Recommendations update based on your learning progress and preferences
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Recommendations;