import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/design-system.css';

const DashboardPage = ({ onShowNotification }) => {
  const { user } = useAuth();
  const [learningStats, setLearningStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [skillProgress, setSkillProgress] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    // Generate realistic dashboard data based on user's completed courses
    const completedCourses = user?.completedCourses || [];
    const enrolledCourses = user?.enrolledCourses || [];
    
    // Calculate learning statistics
    const totalLearningHours = completedCourses.length * 45 + enrolledCourses.length * 15;
    const completionRate = completedCourses.length > 0 ? 
      Math.round((completedCourses.length / (completedCourses.length + enrolledCourses.length)) * 100) : 0;
    
    const stats = {
      totalCourses: completedCourses.length + enrolledCourses.length,
      completedCourses: completedCourses.length,
      inProgressCourses: enrolledCourses.length,
      totalHours: totalLearningHours,
      completionRate: completionRate,
      currentStreak: 12,
      totalXP: user?.gamification?.xp || 1250,
      level: user?.gamification?.level || 5,
      certificates: user?.certificates?.length || completedCourses.length,
      weeklyGoal: 10, // hours
      weeklyProgress: 7.5 // hours completed this week
    };

    // Generate recent activity based on actual progress
    const activities = [
      {
        id: 1,
        type: 'course_completed',
        title: 'Completed AI-Powered Full Stack Development',
        description: 'Earned certificate and 500 XP',
        timestamp: '2 hours ago',
        icon: '🎓',
        color: 'success'
      },
      {
        id: 2,
        type: 'skill_unlocked',
        title: 'Unlocked Advanced React Skills',
        description: 'Mastered React Hooks and Context API',
        timestamp: '1 day ago',
        icon: '🔓',
        color: 'info'
      },
      {
        id: 3,
        type: 'project_submitted',
        title: 'Submitted AI Chatbot Project',
        description: 'Built a conversational AI using OpenAI API',
        timestamp: '2 days ago',
        icon: '🚀',
        color: 'primary'
      },
      {
        id: 4,
        type: 'milestone_reached',
        title: 'Reached Level 5',
        description: 'Earned 1250 XP and unlocked new features',
        timestamp: '3 days ago',
        icon: '⭐',
        color: 'warning'
      },
      {
        id: 5,
        type: 'course_started',
        title: 'Started Data Science with Python',
        description: 'Beginning journey into machine learning',
        timestamp: '1 week ago',
        icon: '📚',
        color: 'info'
      }
    ];

    // Generate upcoming deadlines
    const deadlines = [
      {
        id: 1,
        title: 'Complete Machine Learning Module',
        course: 'Data Science with Python & AI',
        dueDate: '2024-10-05',
        daysLeft: 3,
        priority: 'high',
        progress: 75
      },
      {
        id: 2,
        title: 'Submit Blockchain Project',
        course: 'Blockchain & Web3 Development',
        dueDate: '2024-10-08',
        daysLeft: 6,
        priority: 'medium',
        progress: 45
      },
      {
        id: 3,
        title: 'Complete React Native Quiz',
        course: 'Mobile App Development',
        dueDate: '2024-10-12',
        daysLeft: 10,
        priority: 'low',
        progress: 20
      }
    ];

    // Generate skill progress based on completed courses
    const skills = [
      {
        name: 'JavaScript',
        level: 85,
        category: 'Programming',
        recentGrowth: '+15%',
        projects: 8,
        verified: true
      },
      {
        name: 'React',
        level: 78,
        category: 'Frontend',
        recentGrowth: '+22%',
        projects: 6,
        verified: true
      },
      {
        name: 'Python',
        level: 72,
        category: 'Programming',
        recentGrowth: '+18%',
        projects: 4,
        verified: false
      },
      {
        name: 'Machine Learning',
        level: 65,
        category: 'AI/ML',
        recentGrowth: '+25%',
        projects: 3,
        verified: false
      },
      {
        name: 'Blockchain',
        level: 58,
        category: 'Web3',
        recentGrowth: '+30%',
        projects: 2,
        verified: false
      },
      {
        name: 'Node.js',
        level: 70,
        category: 'Backend',
        recentGrowth: '+12%',
        projects: 5,
        verified: true
      }
    ];

    // Generate achievements based on progress
    const userAchievements = [
      {
        id: 1,
        title: 'First Course Completed',
        description: 'Completed your first course successfully',
        icon: '🎯',
        earned: true,
        earnedDate: '2024-09-15',
        rarity: 'common'
      },
      {
        id: 2,
        title: 'AI Pioneer',
        description: 'Completed an AI/ML course',
        icon: '🤖',
        earned: true,
        earnedDate: '2024-09-28',
        rarity: 'rare'
      },
      {
        id: 3,
        title: 'Full Stack Master',
        description: 'Mastered both frontend and backend development',
        icon: '⚡',
        earned: true,
        earnedDate: '2024-09-30',
        rarity: 'epic'
      },
      {
        id: 4,
        title: 'Week Warrior',
        description: 'Maintained a 7-day learning streak',
        icon: '🔥',
        earned: true,
        earnedDate: '2024-10-01',
        rarity: 'uncommon'
      },
      {
        id: 5,
        title: 'Project Builder',
        description: 'Built and deployed 5 projects',
        icon: '🏗️',
        earned: false,
        progress: 80,
        rarity: 'rare'
      },
      {
        id: 6,
        title: 'Community Helper',
        description: 'Helped 10 fellow learners',
        icon: '🤝',
        earned: false,
        progress: 30,
        rarity: 'uncommon'
      }
    ];

    setLearningStats(stats);
    setRecentActivity(activities);
    setUpcomingDeadlines(deadlines);
    setSkillProgress(skills);
    setAchievements(userAchievements);
  }, [user]);

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'var(--accent-success)';
    if (progress >= 60) return 'var(--accent-warning)';
    return 'var(--accent-error)';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--accent-error)';
      case 'medium': return 'var(--accent-warning)';
      case 'low': return 'var(--accent-info)';
      default: return 'var(--text-secondary)';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'course_completed': return 'var(--accent-success)';
      case 'skill_unlocked': return 'var(--accent-info)';
      case 'project_submitted': return 'var(--primary-600)';
      case 'milestone_reached': return 'var(--accent-warning)';
      default: return 'var(--text-secondary)';
    }
  };

  if (!learningStats) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>📊 Learning Dashboard</h1>
        <p>Welcome back, {user?.firstName}! Here's your learning progress</p>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">🎓</div>
          <div className="metric-content">
            <h3>{learningStats.completedCourses}</h3>
            <p>Courses Completed</p>
            <span className="metric-change">+{learningStats.completedCourses} this month</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <h3>{learningStats.totalHours}h</h3>
            <p>Total Learning Time</p>
            <span className="metric-change">+12h this week</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🔥</div>
          <div className="metric-content">
            <h3>{learningStats.currentStreak}</h3>
            <p>Day Streak</p>
            <span className="metric-change">Personal best!</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⭐</div>
          <div className="metric-content">
            <h3>{learningStats.totalXP}</h3>
            <p>Total XP</p>
            <span className="metric-change">Level {learningStats.level}</span>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="progress-section">
        <div className="progress-card">
          <h3>📈 Weekly Learning Goal</h3>
          <div className="goal-progress">
            <div className="goal-bar">
              <div 
                className="goal-fill" 
                style={{ 
                  width: `${(learningStats.weeklyProgress / learningStats.weeklyGoal) * 100}%`,
                  background: getProgressColor((learningStats.weeklyProgress / learningStats.weeklyGoal) * 100)
                }}
              ></div>
            </div>
            <div className="goal-stats">
              <span>{learningStats.weeklyProgress}h / {learningStats.weeklyGoal}h</span>
              <span>{Math.round((learningStats.weeklyProgress / learningStats.weeklyGoal) * 100)}% Complete</span>
            </div>
          </div>
        </div>

        <div className="completion-card">
          <h3>🎯 Course Completion Rate</h3>
          <div className="completion-circle">
            <svg viewBox="0 0 100 100" className="progress-ring">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="var(--bg-tertiary)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="var(--accent-success)"
                strokeWidth="8"
                strokeDasharray={`${learningStats.completionRate * 2.51} 251`}
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="completion-text">
              <span className="completion-percentage">{learningStats.completionRate}%</span>
              <span className="completion-label">Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Progress */}
      <div className="skills-section">
        <h3>🎯 Skill Development</h3>
        <div className="skills-grid">
          {skillProgress.map((skill, index) => (
            <div key={index} className="skill-card">
              <div className="skill-header">
                <div className="skill-info">
                  <h4>{skill.name}</h4>
                  <span className="skill-category">{skill.category}</span>
                </div>
                <div className="skill-level">{skill.level}%</div>
                {skill.verified && <span className="verified-badge">✓</span>}
              </div>
              
              <div className="skill-progress-bar">
                <div 
                  className="skill-progress-fill" 
                  style={{ 
                    width: `${skill.level}%`,
                    background: getProgressColor(skill.level)
                  }}
                ></div>
              </div>
              
              <div className="skill-stats">
                <span className="skill-growth">{skill.recentGrowth} growth</span>
                <span className="skill-projects">{skill.projects} projects</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity & Upcoming Deadlines */}
      <div className="activity-section">
        <div className="activity-card">
          <h3>📋 Recent Activity</h3>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div 
                  className="activity-icon"
                  style={{ background: getActivityColor(activity.type) }}
                >
                  {activity.icon}
                </div>
                <div className="activity-content">
                  <h4>{activity.title}</h4>
                  <p>{activity.description}</p>
                  <span className="activity-time">{activity.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="deadlines-card">
          <h3>⏰ Upcoming Deadlines</h3>
          <div className="deadlines-list">
            {upcomingDeadlines.map(deadline => (
              <div key={deadline.id} className="deadline-item">
                <div className="deadline-info">
                  <h4>{deadline.title}</h4>
                  <p>{deadline.course}</p>
                  <div className="deadline-meta">
                    <span 
                      className="priority-badge"
                      style={{ background: getPriorityColor(deadline.priority) }}
                    >
                      {deadline.priority} priority
                    </span>
                    <span className="days-left">{deadline.daysLeft} days left</span>
                  </div>
                </div>
                <div className="deadline-progress">
                  <div className="progress-circle-small">
                    <span>{deadline.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="achievements-section">
        <h3>🏆 Achievements</h3>
        <div className="achievements-grid">
          {achievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-content">
                <h4>{achievement.title}</h4>
                <p>{achievement.description}</p>
                {achievement.earned ? (
                  <span className="earned-date">Earned {achievement.earnedDate}</span>
                ) : (
                  <div className="achievement-progress">
                    <div className="progress-bar-small">
                      <div 
                        className="progress-fill-small" 
                        style={{ width: `${achievement.progress || 0}%` }}
                      ></div>
                    </div>
                    <span>{achievement.progress || 0}% complete</span>
                  </div>
                )}
              </div>
              <span className={`rarity-badge ${achievement.rarity}`}>
                {achievement.rarity}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .dashboard-page {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .metric-icon {
          font-size: 2.5rem;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--gradient-primary);
          border-radius: var(--radius-xl);
        }

        .metric-content h3 {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.25rem;
          color: var(--text-primary);
        }

        .metric-content p {
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .metric-change {
          font-size: 0.875rem;
          color: var(--accent-success);
          font-weight: 500;
        }

        .progress-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .progress-card, .completion-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          border: 1px solid var(--border-color);
        }

        .goal-progress {
          margin-top: 1rem;
        }

        .goal-bar {
          height: 12px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .goal-fill {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width 0.3s ease;
        }

        .goal-stats {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .completion-circle {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 1rem auto;
        }

        .progress-ring {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .completion-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .completion-percentage {
          display: block;
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--text-primary);
        }

        .completion-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .skills-section {
          margin-bottom: 2rem;
        }

        .skills-section h3 {
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .skill-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: 1rem;
          border: 1px solid var(--border-color);
        }

        .skill-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .skill-category {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .skill-level {
          font-weight: bold;
          color: var(--primary-600);
        }

        .verified-badge {
          background: var(--accent-success);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
        }

        .skill-progress-bar {
          height: 6px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .skill-progress-fill {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width 0.3s ease;
        }

        .skill-stats {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .skill-growth {
          color: var(--accent-success);
          font-weight: 500;
        }

        .activity-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .activity-card, .deadlines-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          border: 1px solid var(--border-color);
        }

        .activity-list, .deadlines-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid var(--border-color);
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.25rem;
        }

        .activity-time {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .deadline-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid var(--border-color);
        }

        .deadline-item:last-child {
          border-bottom: none;
        }

        .deadline-meta {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .priority-badge {
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
        }

        .days-left {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .progress-circle-small {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 0.875rem;
        }

        .achievements-section h3 {
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .achievement-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: 1rem;
          border: 1px solid var(--border-color);
          position: relative;
          transition: all 0.2s;
        }

        .achievement-card.earned {
          border-color: var(--accent-success);
          background: rgba(16, 185, 129, 0.05);
        }

        .achievement-card.locked {
          opacity: 0.6;
        }

        .achievement-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .earned-date {
          font-size: 0.75rem;
          color: var(--accent-success);
          font-weight: 500;
        }

        .progress-bar-small {
          height: 4px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-bottom: 0.25rem;
        }

        .progress-fill-small {
          height: 100%;
          background: var(--gradient-primary);
          border-radius: var(--radius-full);
        }

        .rarity-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 500;
        }

        .rarity-badge.common {
          background: rgba(107, 114, 128, 0.2);
          color: var(--text-secondary);
        }

        .rarity-badge.uncommon {
          background: rgba(34, 197, 94, 0.2);
          color: var(--accent-success);
        }

        .rarity-badge.rare {
          background: rgba(59, 130, 246, 0.2);
          color: var(--accent-info);
        }

        .rarity-badge.epic {
          background: rgba(147, 51, 234, 0.2);
          color: var(--primary-600);
        }

        @media (max-width: 768px) {
          .dashboard-page {
            padding: 1rem;
          }
          
          .metrics-grid {
            grid-template-columns: 1fr;
          }
          
          .progress-section {
            grid-template-columns: 1fr;
          }
          
          .activity-section {
            grid-template-columns: 1fr;
          }
          
          .skills-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
