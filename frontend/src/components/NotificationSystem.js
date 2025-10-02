import React, { useState, useEffect, createContext, useContext } from 'react';
import '../styles/professional-theme.css';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info', duration = 5000, actions = []) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      type,
      duration,
      actions,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [notification, ...prev]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    clearAll
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = () => {
  const { notifications, removeNotification, markAsRead } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'achievement': return '🏆';
      case 'course': return '📚';
      case 'certificate': return '🎓';
      default: return 'ℹ️';
    }
  };

  const getTypeClass = (type) => {
    switch (type) {
      case 'success': return 'notification-success';
      case 'error': return 'notification-error';
      case 'warning': return 'notification-warning';
      case 'achievement': return 'notification-achievement';
      case 'course': return 'notification-course';
      case 'certificate': return 'notification-certificate';
      default: return 'notification-info';
    }
  };

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification ${getTypeClass(notification.type)} animate-fade-in`}
          onClick={() => markAsRead(notification.id)}
        >
          <div className="notification-content">
            <div className="notification-icon">
              {getIcon(notification.type)}
            </div>
            <div className="notification-body">
              <div className="notification-message">
                {notification.message}
              </div>
              <div className="notification-timestamp">
                {notification.timestamp.toLocaleTimeString()}
              </div>
            </div>
            {notification.actions && notification.actions.length > 0 && (
              <div className="notification-actions">
                {notification.actions.map((action, index) => (
                  <button
                    key={index}
                    className="btn btn-xs btn-outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick();
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            className="notification-close"
            onClick={(e) => {
              e.stopPropagation();
              removeNotification(notification.id);
            }}
          >
            ×
          </button>
        </div>
      ))}

      <style jsx>{`
        .notification-container {
          position: fixed;
          top: var(--space-4);
          right: var(--space-4);
          z-index: var(--z-toast);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          max-width: 400px;
          width: 100%;
        }

        .notification {
          background: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          padding: var(--space-4);
          cursor: pointer;
          transition: all var(--transition-base);
          position: relative;
          overflow: hidden;
        }

        .notification:hover {
          transform: translateX(-4px);
          box-shadow: var(--shadow-2xl);
        }

        .notification-content {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
        }

        .notification-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
          margin-top: var(--space-1);
        }

        .notification-body {
          flex: 1;
          min-width: 0;
        }

        .notification-message {
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: var(--space-1);
          line-height: 1.4;
        }

        .notification-timestamp {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        .notification-actions {
          display: flex;
          gap: var(--space-2);
          margin-top: var(--space-3);
        }

        .notification-close {
          position: absolute;
          top: var(--space-2);
          right: var(--space-2);
          width: 1.5rem;
          height: 1.5rem;
          border: none;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1rem;
          color: var(--text-secondary);
          transition: all var(--transition-base);
        }

        .notification-close:hover {
          background: var(--bg-quaternary);
          color: var(--text-primary);
        }

        .notification-success {
          border-left: 4px solid var(--accent-success);
        }

        .notification-error {
          border-left: 4px solid var(--accent-error);
        }

        .notification-warning {
          border-left: 4px solid var(--accent-warning);
        }

        .notification-info {
          border-left: 4px solid var(--accent-info);
        }

        .notification-achievement {
          border-left: 4px solid var(--warning-500);
          background: linear-gradient(135deg, var(--warning-50) 0%, var(--bg-secondary) 100%);
        }

        .notification-course {
          border-left: 4px solid var(--primary-500);
        }

        .notification-certificate {
          border-left: 4px solid var(--success-500);
          background: linear-gradient(135deg, var(--success-50) 0%, var(--bg-secondary) 100%);
        }

        @media (max-width: 640px) {
          .notification-container {
            top: var(--space-2);
            right: var(--space-2);
            left: var(--space-2);
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationProvider;
