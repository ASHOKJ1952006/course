import React, { useState, useEffect } from 'react';
import '../styles/design-system.css';

const GamificationSystem = ({ user, onLevelUp, onBadgeEarned }) => {
  const [userStats, setUserStats] = useState({
    level: 1,
    xp: 0,
    streak: 0,
    badges: [],
    totalPoints: 0,
    rank: 'Beginner'
  });
  
  const [leaderboard, setLeaderboard] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [dailyChallenge, setDailyChallenge] = useState(null);

  // XP and Level System
  const xpToNextLevel = (level) => level * 100;
  const calculateLevel = (xp) => Math.floor(xp / 100) + 1;
  
  const badges = [
    { id: 'first_course', name: 'First Steps', icon: '🎯', description: 'Complete your first course' },
    { id: 'streak_7', name: 'Week Warrior', icon: '🔥', description: '7-day learning streak' },
    { id: 'streak_30', name: 'Month Master', icon: '💪', description: '30-day learning streak' },
    { id: 'early_bird', name: 'Early Bird', icon: '🌅', description: 'Study before 8 AM' },
    { id: 'night_owl', name: 'Night Owl', icon: '🦉', description: 'Study after 10 PM' },
    { id: 'speed_learner', name: 'Speed Learner', icon: '⚡', description: 'Complete course in record time' },
    { id: 'perfectionist', name: 'Perfectionist', icon: '💎', description: 'Score 100% on all quizzes' },
    { id: 'social_learner', name: 'Social Butterfly', icon: '🦋', description: 'Help 10 fellow learners' },
    { id: 'skill_collector', name: 'Skill Collector', icon: '🎨', description: 'Master 5 different skills' },
    { id: 'mentor', name: 'Mentor', icon: '👨‍🏫', description: 'Teach and guide others' }
  ];

  const ranks = [
    { name: 'Beginner', minXP: 0, color: '#10b981' },
    { name: 'Explorer', minXP: 500, color: '#3b82f6' },
    { name: 'Achiever', minXP: 1500, color: '#8b5cf6' },
    { name: 'Expert', minXP: 3000, color: '#f59e0b' },
    { name: 'Master', minXP: 6000, color: '#ef4444' },
    { name: 'Legend', minXP: 10000, color: '#d946ef' }
  ];

  // Initialize user stats
  useEffect(() => {
    if (user) {
      const stats = user.gamification || userStats;
      setUserStats(stats);
      generateDailyChallenge();
      fetchLeaderboard();
    }
  }, [user]);

  const generateDailyChallenge = () => {
    const challenges = [
      { id: 1, title: 'Complete 2 lessons', reward: 50, type: 'lessons' },
      { id: 2, title: 'Watch 30 minutes of video', reward: 30, type: 'watch_time' },
      { id: 3, title: 'Take a quiz', reward: 40, type: 'quiz' },
      { id: 4, title: 'Join a discussion', reward: 25, type: 'discussion' },
      { id: 5, title: 'Help a fellow learner', reward: 60, type: 'help' }
    ];
    
    const today = new Date().toDateString();
    const savedChallenge = localStorage.getItem(`daily_challenge_${today}`);
    
    if (!savedChallenge) {
      const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
      setDailyChallenge({ ...randomChallenge, progress: 0, completed: false });
      localStorage.setItem(`daily_challenge_${today}`, JSON.stringify(randomChallenge));
    } else {
      setDailyChallenge(JSON.parse(savedChallenge));
    }
  };

  const fetchLeaderboard = () => {
    // Simulate leaderboard data
    const mockLeaderboard = [
      { id: 1, name: 'Alex Chen', xp: 8500, level: 85, avatar: '👨‍💻' },
      { id: 2, name: 'Sarah Kim', xp: 7200, level: 72, avatar: '👩‍🎓' },
      { id: 3, name: 'Mike Johnson', xp: 6800, level: 68, avatar: '👨‍🚀' },
      { id: 4, name: 'Emma Davis', xp: 6200, level: 62, avatar: '👩‍💼' },
      { id: 5, name: 'You', xp: userStats.totalPoints, level: userStats.level, avatar: '🎯' }
    ].sort((a, b) => b.xp - a.xp);
    
    setLeaderboard(mockLeaderboard);
  };

  const awardXP = (amount, reason) => {
    const newXP = userStats.xp + amount;
    const newLevel = calculateLevel(newXP);
    const leveledUp = newLevel > userStats.level;
    
    setUserStats(prev => ({
      ...prev,
      xp: newXP,
      level: newLevel,
      totalPoints: prev.totalPoints + amount
    }));

    if (leveledUp) {
      onLevelUp?.(newLevel);
      checkForBadges(newLevel, newXP);
    }

    // Show XP notification
    showXPNotification(amount, reason);
  };

  const checkForBadges = (level, xp) => {
    const newBadges = [];
    
    // Check level-based badges
    if (level >= 10 && !userStats.badges.includes('level_10')) {
      newBadges.push('level_10');
    }
    
    // Check XP-based badges
    if (xp >= 1000 && !userStats.badges.includes('xp_1000')) {
      newBadges.push('xp_1000');
    }

    if (newBadges.length > 0) {
      setUserStats(prev => ({
        ...prev,
        badges: [...prev.badges, ...newBadges]
      }));
      
      newBadges.forEach(badgeId => {
        const badge = badges.find(b => b.id === badgeId);
        onBadgeEarned?.(badge);
      });
    }
  };

  const showXPNotification = (amount, reason) => {
    const notification = document.createElement('div');
    notification.className = 'xp-notification';
    notification.innerHTML = `+${amount} XP - ${reason}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--gradient-primary);
      color: white;
      padding: 12px 20px;
      border-radius: 25px;
      font-weight: 600;
      z-index: 10000;
      animation: slideInRight 0.5s ease-out, fadeOut 0.5s ease-out 2.5s;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastActivity = localStorage.getItem('last_activity_date');
    
    if (lastActivity !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastActivity === yesterday.toDateString()) {
        // Continue streak
        setUserStats(prev => ({ ...prev, streak: prev.streak + 1 }));
      } else {
        // Reset streak
        setUserStats(prev => ({ ...prev, streak: 1 }));
      }
      
      localStorage.setItem('last_activity_date', today);
    }
  };

  const getCurrentRank = () => {
    return ranks.reverse().find(rank => userStats.totalPoints >= rank.minXP) || ranks[0];
  };

  const getProgressToNextRank = () => {
    const currentRankIndex = ranks.findIndex(rank => userStats.totalPoints >= rank.minXP);
    const nextRank = ranks[currentRankIndex - 1];
    
    if (!nextRank) return 100;
    
    const progress = ((userStats.totalPoints - getCurrentRank().minXP) / 
                     (nextRank.minXP - getCurrentRank().minXP)) * 100;
    return Math.min(progress, 100);
  };

  return (
    <div className="gamification-system">
      {/* User Stats Dashboard */}
      <div className="stats-dashboard">
        <div className="stat-card level-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-label">Level</div>
            <div className="stat-value">{userStats.level}</div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(userStats.xp % 100)}%` }}
              ></div>
            </div>
            <div className="stat-subtitle">
              {userStats.xp % 100} / {xpToNextLevel(userStats.level)} XP
            </div>
          </div>
        </div>

        <div className="stat-card streak-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-label">Streak</div>
            <div className="stat-value">{userStats.streak}</div>
            <div className="stat-subtitle">days in a row</div>
          </div>
        </div>

        <div className="stat-card rank-card">
          <div className="stat-icon">👑</div>
          <div className="stat-content">
            <div className="stat-label">Rank</div>
            <div className="stat-value" style={{ color: getCurrentRank().color }}>
              {getCurrentRank().name}
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${getProgressToNextRank()}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="stat-card points-card">
          <div className="stat-icon">💎</div>
          <div className="stat-content">
            <div className="stat-label">Total Points</div>
            <div className="stat-value">{userStats.totalPoints.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Daily Challenge */}
      {dailyChallenge && (
        <div className="daily-challenge">
          <h3>🎯 Daily Challenge</h3>
          <div className="challenge-card">
            <div className="challenge-title">{dailyChallenge.title}</div>
            <div className="challenge-reward">+{dailyChallenge.reward} XP</div>
            <div className="challenge-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(dailyChallenge.progress / 1) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Badges Collection */}
      <div className="badges-section">
        <h3>🏆 Achievements</h3>
        <div className="badges-grid">
          {badges.map(badge => (
            <div 
              key={badge.id}
              className={`badge-card ${userStats.badges.includes(badge.id) ? 'earned' : 'locked'}`}
            >
              <div className="badge-icon">{badge.icon}</div>
              <div className="badge-name">{badge.name}</div>
              <div className="badge-description">{badge.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="leaderboard-section">
        <h3>🏅 Leaderboard</h3>
        <div className="leaderboard">
          {leaderboard.slice(0, 10).map((player, index) => (
            <div 
              key={player.id}
              className={`leaderboard-item ${player.name === 'You' ? 'current-user' : ''}`}
            >
              <div className="rank">#{index + 1}</div>
              <div className="avatar">{player.avatar}</div>
              <div className="player-info">
                <div className="player-name">{player.name}</div>
                <div className="player-level">Level {player.level}</div>
              </div>
              <div className="player-xp">{player.xp.toLocaleString()} XP</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button 
          className="action-btn"
          onClick={() => awardXP(50, 'Lesson completed')}
        >
          Complete Lesson (+50 XP)
        </button>
        <button 
          className="action-btn"
          onClick={() => awardXP(100, 'Quiz passed')}
        >
          Pass Quiz (+100 XP)
        </button>
        <button 
          className="action-btn"
          onClick={updateStreak}
        >
          Update Streak
        </button>
      </div>
    </div>
  );
};

export default GamificationSystem;
