import React, { useState, useEffect } from 'react';
import '../styles/DiscussionForum.css';

const DiscussionForum = ({ courseId }) => {
  const [discussions, setDiscussions] = useState([]);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [newReply, setNewReply] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchDiscussions();
  }, [courseId, sortBy]);

  const fetchDiscussions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/courses/${courseId}/discussions?sort=${sortBy}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDiscussions(data);
      } else {
        setError('Failed to load discussions');
      }
    } catch (error) {
      setError('Error loading discussions');
    } finally {
      setLoading(false);
    }
  };

  const createDiscussion = async (e) => {
    e.preventDefault();
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/courses/${courseId}/discussions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newDiscussion)
      });

      if (response.ok) {
        const discussion = await response.json();
        setDiscussions([discussion, ...discussions]);
        setNewDiscussion({ title: '', content: '' });
        setError('');
      } else {
        setError('Failed to create discussion');
      }
    } catch (error) {
      setError('Error creating discussion');
    }
  };

  const addReply = async (discussionId) => {
    if (!newReply.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/discussions/${discussionId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newReply })
      });

      if (response.ok) {
        const reply = await response.json();
        setDiscussions(discussions.map(d => 
          d._id === discussionId 
            ? { ...d, replies: [...d.replies, reply] }
            : d
        ));
        setNewReply('');
      } else {
        setError('Failed to add reply');
      }
    } catch (error) {
      setError('Error adding reply');
    }
  };

  const likeDiscussion = async (discussionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/discussions/${discussionId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const updatedDiscussion = await response.json();
        setDiscussions(discussions.map(d => 
          d._id === discussionId ? updatedDiscussion : d
        ));
      }
    } catch (error) {
      console.error('Error liking discussion:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="loading">Loading discussions...</div>;
  }

  return (
    <div className="discussion-forum">
      <div className="forum-header">
        <h2>Course Discussions</h2>
        <div className="forum-controls">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
            <option value="active">Most Active</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* New Discussion Form */}
      <div className="new-discussion-form">
        <h3>Start a New Discussion</h3>
        <form onSubmit={createDiscussion}>
          <input
            type="text"
            placeholder="Discussion title..."
            value={newDiscussion.title}
            onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
            className="discussion-title-input"
          />
          <textarea
            placeholder="What would you like to discuss?"
            value={newDiscussion.content}
            onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
            className="discussion-content-input"
            rows="4"
          />
          <button type="submit" className="create-discussion-btn">
            Create Discussion
          </button>
        </form>
      </div>

      {/* Discussions List */}
      <div className="discussions-list">
        {discussions.length === 0 ? (
          <div className="no-discussions">
            <p>No discussions yet. Be the first to start a conversation!</p>
          </div>
        ) : (
          discussions.map(discussion => (
            <div key={discussion._id} className="discussion-item">
              <div className="discussion-header">
                <h4 className="discussion-title">{discussion.title}</h4>
                <div className="discussion-meta">
                  <span className="author">by {discussion.author.username}</span>
                  <span className="date">{formatDate(discussion.createdAt)}</span>
                </div>
              </div>
              
              <div className="discussion-content">
                <p>{discussion.content}</p>
              </div>
              
              <div className="discussion-actions">
                <button 
                  onClick={() => likeDiscussion(discussion._id)}
                  className={`like-btn ${discussion.likes?.includes(localStorage.getItem('userId')) ? 'liked' : ''}`}
                >
                  👍 {discussion.likes?.length || 0}
                </button>
                <button 
                  onClick={() => setSelectedDiscussion(
                    selectedDiscussion === discussion._id ? null : discussion._id
                  )}
                  className="reply-btn"
                >
                  💬 {discussion.replies?.length || 0} Replies
                </button>
              </div>

              {/* Replies Section */}
              {selectedDiscussion === discussion._id && (
                <div className="replies-section">
                  <div className="replies-list">
                    {discussion.replies?.map(reply => (
                      <div key={reply._id} className="reply-item">
                        <div className="reply-header">
                          <span className="reply-author">{reply.author.username}</span>
                          <span className="reply-date">{formatDate(reply.createdAt)}</span>
                        </div>
                        <p className="reply-content">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="new-reply-form">
                    <textarea
                      placeholder="Write a reply..."
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      className="reply-input"
                      rows="3"
                    />
                    <button 
                      onClick={() => addReply(discussion._id)}
                      className="add-reply-btn"
                    >
                      Add Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DiscussionForum;
