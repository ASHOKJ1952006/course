import React, { useState, useEffect, useRef } from 'react';
import '../styles/NotificationCenter.css';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    // Set up real-time notifications if WebSocket is available
    setupRealTimeNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeNotifications = () => {
    // Check if browser supports notifications
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }

    // Set up WebSocket connection for real-time notifications
    const token = localStorage.getItem('token');
    if (token) {
      // This would connect to your WebSocket server
      // const ws = new WebSocket(`ws://localhost:5000/notifications?token=${token}`);
      // ws.onmessage = (event) => {
      //   const notification = JSON.parse(event.data);
      //   addNewNotification(notification);
      // };
    }
  };

  const addNewNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      });
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId
            ? { ...notif, read: true }
            : notif
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setNotifications(prev =>
        prev.filter(notif => notif._id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'course':
        return notifications.filter(n => n.type === 'course');
      case 'system':
        return notifications.filter(n => n.type === 'system');
      case 'social':
        return notifications.filter(n => n.type === 'social');
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'course': return '📚';
      case 'quiz': return '📝';
      case 'certificate': return '🏆';
      case 'discussion': return '💬';
      case 'system': return '⚙️';
      case 'social': return '👥';
      case 'achievement': return '🎉';
      default: return '📢';
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }

    // Handle navigation based on notification type
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <div className="notification-center" ref={dropdownRef}>
      <button
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-actions">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="mark-all-read-btn"
                  title="Mark all as read"
                >
                  ✓
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="close-btn"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="notification-filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Unread ({notifications.filter(n => !n.read).length})
            </button>
            <button
              className={`filter-btn ${filter === 'course' ? 'active' : ''}`}
              onClick={() => setFilter('course')}
            >
              Courses
            </button>
            <button
              className={`filter-btn ${filter === 'social' ? 'active' : ''}`}
              onClick={() => setFilter('social')}
            >
              Social
            </button>
          </div>

          <div className="notification-list">
            {loading ? (
              <div className="notification-loading">
                <div className="loading-spinner"></div>
                <span>Loading notifications...</span>
              </div>
            ) : getFilteredNotifications().length === 0 ? (
              <div className="no-notifications">
                <span className="no-notifications-icon">📭</span>
                <p>No notifications yet</p>
                <small>We'll notify you when something important happens</small>
              </div>
            ) : (
              getFilteredNotifications().map(notification => (
                <div
                  key={notification._id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">
                      {notification.title}
                    </div>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-time">
                      {formatTimeAgo(notification.createdAt)}
                    </div>
                  </div>
                  <div className="notification-controls">
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification._id);
                        }}
                        className="mark-read-btn"
                        title="Mark as read"
                      >
                        ✓
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification._id);
                      }}
                      className="delete-btn"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {getFilteredNotifications().length > 0 && (
            <div className="notification-footer">
              <button className="view-all-btn">
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Toast Notification Component
export const ToastNotification = ({ message, type = 'info', duration = 5000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info':
      default: return 'ℹ️';
    }
  };

  return (
    <div className={`toast-notification ${type}`}>
      <span className="toast-icon">{getToastIcon()}</span>
      <span className="toast-message">{message}</span>
      <button onClick={onClose} className="toast-close">✕</button>
    </div>
  );
};

// Toast Container Component
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <ToastNotification
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default NotificationCenter;
