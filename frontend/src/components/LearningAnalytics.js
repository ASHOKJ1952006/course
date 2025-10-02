import React, { useState, useEffect } from 'react';
import '../styles/LearningAnalytics.css';

const LearningAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('30'); // days
  const [selectedMetric, setSelectedMetric] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/analytics?days=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        setError('Failed to load analytics data');
      }
    } catch (error) {
      setError('Error loading analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStreakEmoji = (streak) => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '⚡';
    if (streak >= 7) return '✨';
    return '📚';
  };

  const renderOverviewMetrics = () => {
    if (!analytics) return null;

    return (
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-icon">📚</div>
          <div className="metric-content">
            <h3>Courses Completed</h3>
            <div className="metric-value">{analytics.completedCourses}</div>
            <div className="metric-change positive">
              +{analytics.completedCoursesChange} this month
            </div>
          </div>
        </div>

        <div className="metric-card secondary">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <h3>Study Time</h3>
            <div className="metric-value">{formatDuration(analytics.totalStudyTime)}</div>
            <div className="metric-change positive">
              +{formatDuration(analytics.studyTimeChange)} this month
            </div>
          </div>
        </div>

        <div className="metric-card tertiary">
          <div className="metric-icon">{getStreakEmoji(analytics.currentStreak)}</div>
          <div className="metric-content">
            <h3>Current Streak</h3>
            <div className="metric-value">{analytics.currentStreak} days</div>
            <div className="metric-change">
              Longest: {analytics.longestStreak} days
            </div>
          </div>
        </div>

        <div className="metric-card quaternary">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <h3>Average Score</h3>
            <div className="metric-value">{analytics.averageScore}%</div>
            <div className={`metric-change ${analytics.scoreChange >= 0 ? 'positive' : 'negative'}`}>
              {analytics.scoreChange >= 0 ? '+' : ''}{analytics.scoreChange}% this month
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProgressChart = () => {
    if (!analytics?.progressData) return null;

    const maxValue = Math.max(...analytics.progressData.map(d => d.value));

    return (
      <div className="chart-container">
        <h3>Learning Progress (Last {timeRange} days)</h3>
        <div className="progress-chart">
          {analytics.progressData.map((data, index) => (
            <div key={index} className="chart-bar">
              <div 
                className="bar-fill"
                style={{ height: `${(data.value / maxValue) * 100}%` }}
                title={`${data.date}: ${data.value} minutes`}
              ></div>
              <div className="bar-label">{data.date}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCategoryBreakdown = () => {
    if (!analytics?.categoryData) return null;

    const total = analytics.categoryData.reduce((sum, cat) => sum + cat.hours, 0);

    return (
      <div className="category-breakdown">
        <h3>Study Time by Category</h3>
        <div className="category-list">
          {analytics.categoryData.map((category, index) => {
            const percentage = total > 0 ? (category.hours / total) * 100 : 0;
            return (
              <div key={index} className="category-item">
                <div className="category-info">
                  <span className="category-name">{category.name}</span>
                  <span className="category-time">{formatDuration(category.hours * 60)}</span>
                </div>
                <div className="category-bar">
                  <div 
                    className="category-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="category-percentage">{percentage.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderRecentAchievements = () => {
    if (!analytics?.achievements) return null;

    return (
      <div className="achievements-section">
        <h3>Recent Achievements</h3>
        <div className="achievements-list">
          {analytics.achievements.map((achievement, index) => (
            <div key={index} className="achievement-item">
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-content">
                <h4>{achievement.title}</h4>
                <p>{achievement.description}</p>
                <span className="achievement-date">{achievement.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderGoalsProgress = () => {
    if (!analytics?.goals) return null;

    return (
      <div className="goals-section">
        <h3>Learning Goals</h3>
        <div className="goals-list">
          {analytics.goals.map((goal, index) => (
            <div key={index} className="goal-item">
              <div className="goal-header">
                <h4>{goal.title}</h4>
                <span className="goal-progress-text">
                  {goal.current} / {goal.target} {goal.unit}
                </span>
              </div>
              <div className="goal-progress-bar">
                <div 
                  className="goal-progress-fill"
                  style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="goal-meta">
                <span className="goal-deadline">Due: {goal.deadline}</span>
                <span className={`goal-status ${goal.status}`}>{goal.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="learning-analytics">
      <div className="analytics-header">
        <h1>Learning Analytics</h1>
        <div className="analytics-controls">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
          
          <div className="metric-tabs">
            <button 
              className={`tab-btn ${selectedMetric === 'overview' ? 'active' : ''}`}
              onClick={() => setSelectedMetric('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-btn ${selectedMetric === 'progress' ? 'active' : ''}`}
              onClick={() => setSelectedMetric('progress')}
            >
              Progress
            </button>
            <button 
              className={`tab-btn ${selectedMetric === 'goals' ? 'active' : ''}`}
              onClick={() => setSelectedMetric('goals')}
            >
              Goals
            </button>
          </div>
        </div>
      </div>

      <div className="analytics-content">
        {selectedMetric === 'overview' && (
          <>
            {renderOverviewMetrics()}
            <div className="analytics-row">
              <div className="analytics-col">
                {renderProgressChart()}
              </div>
              <div className="analytics-col">
                {renderCategoryBreakdown()}
              </div>
            </div>
            {renderRecentAchievements()}
          </>
        )}

        {selectedMetric === 'progress' && (
          <div className="progress-detailed">
            {renderProgressChart()}
            {renderCategoryBreakdown()}
          </div>
        )}

        {selectedMetric === 'goals' && (
          <div className="goals-detailed">
            {renderGoalsProgress()}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningAnalytics;
