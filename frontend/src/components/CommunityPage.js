import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/design-system.css';

const CommunityPage = ({ onShowNotification }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [studyGroups, setStudyGroups] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Sample community data based on completed courses
  useEffect(() => {
    const samplePosts = [
      {
        id: 1,
        author: {
          name: 'Sarah Chen',
          avatar: '👩‍💻',
          title: 'Full Stack Developer',
          level: 'Expert'
        },
        content: 'Just completed the AI-Powered Full Stack Development course! The machine learning integration section was incredible. Anyone else working on similar projects?',
        timestamp: '2 hours ago',
        likes: 24,
        comments: 8,
        tags: ['AI', 'Full Stack', 'Machine Learning'],
        courseRelated: 'AI-Powered Full Stack Development',
        type: 'achievement'
      },
      {
        id: 2,
        author: {
          name: 'Mike Rodriguez',
          avatar: '👨‍🎓',
          title: 'Data Scientist',
          level: 'Advanced'
        },
        content: 'Looking for study partners for the Advanced Data Science course. Planning to start a weekly study group. Who\'s interested?',
        timestamp: '4 hours ago',
        likes: 15,
        comments: 12,
        tags: ['Data Science', 'Study Group', 'Python'],
        courseRelated: 'Data Science with Python & AI',
        type: 'collaboration'
      },
      {
        id: 3,
        author: {
          name: 'Alex Kim',
          avatar: '🧑‍💼',
          title: 'Blockchain Developer',
          level: 'Expert'
        },
        content: 'Built my first DeFi protocol after completing the Blockchain course! Here\'s what I learned about smart contract security...',
        timestamp: '1 day ago',
        likes: 42,
        comments: 18,
        tags: ['Blockchain', 'DeFi', 'Smart Contracts'],
        courseRelated: 'Blockchain & Web3 Development',
        type: 'project_showcase'
      }
    ];

    const sampleGroups = [
      {
        id: 1,
        name: 'AI Developers Hub',
        description: 'Connect with fellow AI enthusiasts and share projects',
        members: 1247,
        category: 'AI & Machine Learning',
        isJoined: true,
        recentActivity: '15 new posts today',
        relatedCourses: ['AI-Powered Full Stack Development', 'Data Science with Python & AI']
      },
      {
        id: 2,
        name: 'Blockchain Builders',
        description: 'Build the future of decentralized applications together',
        members: 892,
        category: 'Blockchain',
        isJoined: false,
        recentActivity: '8 new projects shared',
        relatedCourses: ['Blockchain & Web3 Development']
      },
      {
        id: 3,
        name: 'Full Stack Mastery',
        description: 'From frontend to backend - master it all',
        members: 2156,
        category: 'Web Development',
        isJoined: true,
        recentActivity: '23 new discussions',
        relatedCourses: ['AI-Powered Full Stack Development', 'Mobile App Development']
      }
    ];

    const sampleMentors = [
      {
        id: 1,
        name: 'Dr. Emily Watson',
        avatar: '👩‍🔬',
        title: 'Senior AI Research Scientist',
        company: 'Google AI',
        expertise: ['Machine Learning', 'Deep Learning', 'Computer Vision'],
        rating: 4.9,
        sessions: 156,
        price: '$150/hour',
        availability: 'Available',
        completedCourses: ['AI-Powered Full Stack Development', 'Data Science with Python & AI']
      },
      {
        id: 2,
        name: 'James Liu',
        avatar: '👨‍💻',
        title: 'Lead Blockchain Architect',
        company: 'Ethereum Foundation',
        expertise: ['Blockchain', 'Smart Contracts', 'DeFi'],
        rating: 4.8,
        sessions: 89,
        price: '$200/hour',
        availability: 'Busy',
        completedCourses: ['Blockchain & Web3 Development']
      },
      {
        id: 3,
        name: 'Maria Garcia',
        avatar: '👩‍💼',
        title: 'Full Stack Engineering Manager',
        company: 'Netflix',
        expertise: ['React', 'Node.js', 'System Design'],
        rating: 4.9,
        sessions: 203,
        price: '$120/hour',
        availability: 'Available',
        completedCourses: ['AI-Powered Full Stack Development', 'Mobile App Development']
      }
    ];

    setPosts(samplePosts);
    setStudyGroups(sampleGroups);
    setMentors(sampleMentors);
  }, []);

  const handleCreatePost = () => {
    if (!newPost.trim()) return;

    const post = {
      id: Date.now(),
      author: {
        name: `${user?.firstName} ${user?.lastName}`,
        avatar: user?.avatar || '👤',
        title: 'Student',
        level: 'Beginner'
      },
      content: newPost,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      tags: [],
      type: 'general'
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');
    onShowNotification?.('Post created successfully!', 'success');
  };

  const handleJoinGroup = (groupId) => {
    setStudyGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, isJoined: !group.isJoined, members: group.isJoined ? group.members - 1 : group.members + 1 }
        : group
    ));
    onShowNotification?.('Group membership updated!', 'success');
  };

  const renderFeed = () => (
    <div className="community-feed">
      {/* Create Post */}
      <div className="create-post-card">
        <div className="post-author">
          <div className="author-avatar">{user?.avatar || '👤'}</div>
          <div className="author-info">
            <h4>{user?.firstName} {user?.lastName}</h4>
            <span>Share your learning journey...</span>
          </div>
        </div>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind? Share your progress, ask questions, or showcase your projects..."
          className="post-textarea"
        />
        <div className="post-actions">
          <div className="post-options">
            <button className="post-option">📷 Photo</button>
            <button className="post-option">🎥 Video</button>
            <button className="post-option">💼 Project</button>
            <button className="post-option">❓ Question</button>
          </div>
          <button 
            className="post-submit-btn"
            onClick={handleCreatePost}
            disabled={!newPost.trim()}
          >
            Share Post
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="posts-container">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-author">
                <div className="author-avatar">{post.author.avatar}</div>
                <div className="author-info">
                  <h4>{post.author.name}</h4>
                  <span>{post.author.title} • {post.author.level}</span>
                  <small>{post.timestamp}</small>
                </div>
              </div>
              {post.type === 'achievement' && <span className="post-type-badge achievement">🏆 Achievement</span>}
              {post.type === 'project_showcase' && <span className="post-type-badge project">🚀 Project</span>}
              {post.type === 'collaboration' && <span className="post-type-badge collaboration">🤝 Collaboration</span>}
            </div>

            {post.courseRelated && (
              <div className="course-relation">
                📚 Related to: <strong>{post.courseRelated}</strong>
              </div>
            )}

            <div className="post-content">
              <p>{post.content}</p>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map(tag => (
                  <span key={tag} className="post-tag">#{tag}</span>
                ))}
              </div>
            )}

            <div className="post-engagement">
              <button className="engagement-btn">
                👍 {post.likes} Likes
              </button>
              <button className="engagement-btn">
                💬 {post.comments} Comments
              </button>
              <button className="engagement-btn">
                🔄 Share
              </button>
              <button className="engagement-btn">
                🔖 Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGroups = () => (
    <div className="study-groups">
      <div className="groups-header">
        <h2>Study Groups & Communities</h2>
        <button className="create-group-btn">+ Create Group</button>
      </div>

      <div className="groups-grid">
        {studyGroups.map(group => (
          <div key={group.id} className="group-card">
            <div className="group-header">
              <h3>{group.name}</h3>
              <span className="group-category">{group.category}</span>
            </div>
            
            <p className="group-description">{group.description}</p>
            
            <div className="group-stats">
              <span>👥 {group.members.toLocaleString()} members</span>
              <span>📈 {group.recentActivity}</span>
            </div>

            {group.relatedCourses && (
              <div className="group-courses">
                <strong>Related Courses:</strong>
                {group.relatedCourses.map(course => (
                  <span key={course} className="course-tag">{course}</span>
                ))}
              </div>
            )}

            <button 
              className={`group-join-btn ${group.isJoined ? 'joined' : ''}`}
              onClick={() => handleJoinGroup(group.id)}
            >
              {group.isJoined ? '✓ Joined' : '+ Join Group'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMentorship = () => (
    <div className="mentorship-section">
      <div className="mentorship-header">
        <h2>Find Your Mentor</h2>
        <p>Connect with industry experts who have completed similar courses</p>
      </div>

      <div className="mentors-grid">
        {mentors.map(mentor => (
          <div key={mentor.id} className="mentor-card">
            <div className="mentor-header">
              <div className="mentor-avatar">{mentor.avatar}</div>
              <div className="mentor-info">
                <h3>{mentor.name}</h3>
                <p>{mentor.title}</p>
                <span className="mentor-company">{mentor.company}</span>
              </div>
              <div className={`availability-status ${mentor.availability.toLowerCase()}`}>
                {mentor.availability}
              </div>
            </div>

            <div className="mentor-expertise">
              <strong>Expertise:</strong>
              <div className="expertise-tags">
                {mentor.expertise.map(skill => (
                  <span key={skill} className="expertise-tag">{skill}</span>
                ))}
              </div>
            </div>

            <div className="mentor-courses">
              <strong>Completed Courses:</strong>
              {mentor.completedCourses.map(course => (
                <span key={course} className="mentor-course-tag">{course}</span>
              ))}
            </div>

            <div className="mentor-stats">
              <div className="stat">
                <span>⭐ {mentor.rating}</span>
                <small>Rating</small>
              </div>
              <div className="stat">
                <span>{mentor.sessions}</span>
                <small>Sessions</small>
              </div>
              <div className="stat">
                <span>{mentor.price}</span>
                <small>Per Hour</small>
              </div>
            </div>

            <div className="mentor-actions">
              <button className="mentor-btn primary">📅 Book Session</button>
              <button className="mentor-btn secondary">💬 Message</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDiscussions = () => (
    <div className="discussions-section">
      <div className="discussions-header">
        <h2>Course Discussions</h2>
        <button className="start-discussion-btn">+ Start Discussion</button>
      </div>

      <div className="discussion-categories">
        <button className="category-btn active">All Discussions</button>
        <button className="category-btn">AI & ML</button>
        <button className="category-btn">Blockchain</button>
        <button className="category-btn">Web Development</button>
        <button className="category-btn">Data Science</button>
      </div>

      <div className="discussions-list">
        <div className="discussion-item">
          <div className="discussion-info">
            <h4>Best practices for deploying ML models in production?</h4>
            <p>Looking for advice on scaling machine learning models...</p>
            <div className="discussion-meta">
              <span>👤 Sarah Chen</span>
              <span>📚 AI-Powered Full Stack Development</span>
              <span>⏰ 2 hours ago</span>
            </div>
          </div>
          <div className="discussion-stats">
            <span>💬 12 replies</span>
            <span>👍 8 likes</span>
          </div>
        </div>

        <div className="discussion-item">
          <div className="discussion-info">
            <h4>Smart contract security audit checklist</h4>
            <p>Sharing my comprehensive checklist for auditing smart contracts...</p>
            <div className="discussion-meta">
              <span>👤 Alex Kim</span>
              <span>📚 Blockchain & Web3 Development</span>
              <span>⏰ 5 hours ago</span>
            </div>
          </div>
          <div className="discussion-stats">
            <span>💬 24 replies</span>
            <span>👍 18 likes</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="community-page">
      <div className="community-header">
        <h1>🌟 Learning Community</h1>
        <p>Connect, collaborate, and grow with fellow learners</p>
      </div>

      <div className="community-tabs">
        <button 
          className={`tab-btn ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          📰 Feed
        </button>
        <button 
          className={`tab-btn ${activeTab === 'groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('groups')}
        >
          👥 Groups
        </button>
        <button 
          className={`tab-btn ${activeTab === 'mentorship' ? 'active' : ''}`}
          onClick={() => setActiveTab('mentorship')}
        >
          🎓 Mentorship
        </button>
        <button 
          className={`tab-btn ${activeTab === 'discussions' ? 'active' : ''}`}
          onClick={() => setActiveTab('discussions')}
        >
          💬 Discussions
        </button>
      </div>

      <div className="community-content">
        {activeTab === 'feed' && renderFeed()}
        {activeTab === 'groups' && renderGroups()}
        {activeTab === 'mentorship' && renderMentorship()}
        {activeTab === 'discussions' && renderDiscussions()}
      </div>

      <style jsx>{`
        .community-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .community-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .community-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .community-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--border-color);
        }

        .tab-btn {
          padding: 1rem 1.5rem;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-secondary);
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        .tab-btn.active {
          color: var(--primary-600);
          border-bottom-color: var(--primary-600);
        }

        .create-post-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          margin-bottom: 2rem;
          border: 1px solid var(--border-color);
        }

        .post-author {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .author-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--gradient-primary);
          font-size: 1.5rem;
        }

        .post-textarea {
          width: 100%;
          min-height: 100px;
          padding: 1rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          background: var(--bg-primary);
          color: var(--text-primary);
          resize: vertical;
          margin-bottom: 1rem;
        }

        .post-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .post-options {
          display: flex;
          gap: 1rem;
        }

        .post-option {
          padding: 0.5rem 1rem;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          border-radius: var(--radius-md);
          cursor: pointer;
          font-size: 0.875rem;
        }

        .post-submit-btn {
          padding: 0.75rem 2rem;
          background: var(--gradient-primary);
          color: white;
          border: none;
          border-radius: var(--radius-lg);
          cursor: pointer;
          font-weight: 600;
        }

        .post-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 1px solid var(--border-color);
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .post-type-badge {
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .post-type-badge.achievement {
          background: rgba(251, 191, 36, 0.1);
          color: var(--accent-warning);
        }

        .post-type-badge.project {
          background: rgba(16, 185, 129, 0.1);
          color: var(--accent-success);
        }

        .post-type-badge.collaboration {
          background: rgba(59, 130, 246, 0.1);
          color: var(--accent-info);
        }

        .course-relation {
          background: rgba(139, 92, 246, 0.1);
          padding: 0.75rem;
          border-radius: var(--radius-lg);
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: var(--primary-600);
        }

        .post-tags {
          display: flex;
          gap: 0.5rem;
          margin: 1rem 0;
          flex-wrap: wrap;
        }

        .post-tag {
          background: var(--bg-tertiary);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          color: var(--primary-600);
        }

        .post-engagement {
          display: flex;
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .engagement-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
          color: var(--text-secondary);
          padding: 0.5rem;
        }

        .groups-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .group-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          border: 1px solid var(--border-color);
        }

        .group-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .group-category {
          background: var(--gradient-primary);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
        }

        .group-stats {
          display: flex;
          gap: 1rem;
          margin: 1rem 0;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .group-courses {
          margin: 1rem 0;
          font-size: 0.875rem;
        }

        .course-tag {
          display: inline-block;
          background: var(--bg-tertiary);
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-md);
          margin: 0.25rem 0.25rem 0.25rem 0;
          font-size: 0.75rem;
        }

        .group-join-btn {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--primary-600);
          background: transparent;
          color: var(--primary-600);
          border-radius: var(--radius-lg);
          cursor: pointer;
          font-weight: 600;
        }

        .group-join-btn.joined {
          background: var(--gradient-success);
          color: white;
          border-color: var(--accent-success);
        }

        .mentors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .mentor-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          border: 1px solid var(--border-color);
        }

        .mentor-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .mentor-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--gradient-primary);
          font-size: 2rem;
        }

        .availability-status {
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .availability-status.available {
          background: rgba(16, 185, 129, 0.1);
          color: var(--accent-success);
        }

        .availability-status.busy {
          background: rgba(239, 68, 68, 0.1);
          color: var(--accent-error);
        }

        .mentor-expertise, .mentor-courses {
          margin: 1rem 0;
        }

        .expertise-tags, .mentor-course-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: 0.5rem;
        }

        .expertise-tag {
          background: var(--gradient-primary);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
        }

        .mentor-course-tag {
          background: var(--bg-tertiary);
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-md);
          font-size: 0.75rem;
        }

        .mentor-stats {
          display: flex;
          justify-content: space-around;
          margin: 1.5rem 0;
          padding: 1rem;
          background: var(--bg-tertiary);
          border-radius: var(--radius-lg);
        }

        .stat {
          text-align: center;
        }

        .stat span {
          display: block;
          font-weight: 600;
          font-size: 1.125rem;
        }

        .stat small {
          color: var(--text-secondary);
          font-size: 0.75rem;
        }

        .mentor-actions {
          display: flex;
          gap: 1rem;
        }

        .mentor-btn {
          flex: 1;
          padding: 0.75rem;
          border-radius: var(--radius-lg);
          cursor: pointer;
          font-weight: 600;
        }

        .mentor-btn.primary {
          background: var(--gradient-primary);
          color: white;
          border: none;
        }

        .mentor-btn.secondary {
          background: transparent;
          color: var(--primary-600);
          border: 1px solid var(--primary-600);
        }

        .discussions-list {
          space-y: 1rem;
        }

        .discussion-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-secondary);
          padding: 1.5rem;
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-color);
          margin-bottom: 1rem;
        }

        .discussion-meta {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .discussion-stats {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .community-page {
            padding: 1rem;
          }
          
          .community-tabs {
            flex-wrap: wrap;
          }
          
          .groups-grid, .mentors-grid {
            grid-template-columns: 1fr;
          }
          
          .mentor-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default CommunityPage;
