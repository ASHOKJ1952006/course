import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';
import '../styles/design-system.css';

const CourseDetailModal = ({ course, onClose, onEnroll, onComplete, onShowNotification }) => {
  const { user } = useAuth();
  const [enrollmentStatus, setEnrollmentStatus] = useState('not_enrolled'); // not_enrolled, enrolled, in_progress, completed
  const [progress, setProgress] = useState(0);
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateId, setCertificateId] = useState(null);

  useEffect(() => {
    if (user && course) {
      checkEnrollmentStatus();
    }
  }, [user, course]);

  const checkEnrollmentStatus = () => {
    // Check if user is enrolled in this course
    const userCourses = user?.enrolledCourses || [];
    const enrolledCourse = userCourses.find(c => c.id === course.id || c.courseId === course.id);
    
    if (enrolledCourse) {
      if (enrolledCourse.completed) {
        setEnrollmentStatus('completed');
        setProgress(100);
        setCertificateId(enrolledCourse.certificateId);
      } else {
        setEnrollmentStatus(enrolledCourse.progress > 0 ? 'in_progress' : 'enrolled');
        setProgress(enrolledCourse.progress || 0);
      }
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      onShowNotification('Please login to enroll in courses', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      await api.enrollInCourse(course.id);
      setEnrollmentStatus('enrolled');
      onShowNotification(`Successfully enrolled in "${course.title}"!`, 'success');
      onEnroll?.(course.id);
      
      // Simulate some initial progress
      setTimeout(() => {
        setProgress(5);
        setEnrollmentStatus('in_progress');
      }, 1000);
    } catch (error) {
      onShowNotification(error.message || 'Enrollment failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartLearning = () => {
    setEnrollmentStatus('in_progress');
    setProgress(10);
    onShowNotification('Course started! Keep learning to earn XP and badges.', 'success');
  };

  const handleContinueLearning = () => {
    // Simulate progress
    const newProgress = Math.min(progress + 15, 95);
    setProgress(newProgress);
    
    if (newProgress >= 95) {
      onShowNotification('Almost done! Complete the final assessment to finish the course.', 'info');
    } else {
      onShowNotification(`Great progress! You're ${newProgress}% complete.`, 'success');
    }
  };

  const handleCompleteCourse = async () => {
    if (rating === 0) {
      onShowNotification('Please rate the course before completing', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.completeCourse(course.id, rating);
      setEnrollmentStatus('completed');
      setProgress(100);
      setCertificateId(response.certificateId || `cert_${course.id}_${Date.now()}`);
      setShowCertificate(true);
      
      onShowNotification('🎉 Congratulations! Course completed successfully!', 'success');
      onComplete?.(course.id, rating);
      
      // Show certificate after a delay
      setTimeout(() => {
        setShowCertificate(true);
      }, 2000);
    } catch (error) {
      onShowNotification(error.message || 'Failed to complete course', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      // Generate certificate blob (mock implementation)
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      
      // Certificate background
      ctx.fillStyle = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      ctx.fillRect(0, 0, 800, 600);
      
      // Certificate content
      ctx.fillStyle = 'white';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Certificate of Completion', 400, 150);
      
      ctx.font = '24px Arial';
      ctx.fillText('This certifies that', 400, 220);
      
      ctx.font = 'bold 32px Arial';
      ctx.fillText(user?.firstName + ' ' + user?.lastName || 'Student', 400, 280);
      
      ctx.font = '24px Arial';
      ctx.fillText('has successfully completed', 400, 330);
      
      ctx.font = 'bold 28px Arial';
      ctx.fillText(course.title, 400, 380);
      
      ctx.font = '18px Arial';
      ctx.fillText(`Completed on ${new Date().toLocaleDateString()}`, 400, 450);
      ctx.fillText(`Certificate ID: ${certificateId}`, 400, 480);
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificate-${course.title.replace(/\s+/g, '-')}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        onShowNotification('Certificate downloaded successfully!', 'success');
      });
    } catch (error) {
      onShowNotification('Failed to download certificate', 'error');
    }
  };

  const getActionButton = () => {
    switch (enrollmentStatus) {
      case 'not_enrolled':
        return (
          <button 
            className="primary-btn large-btn"
            onClick={handleEnroll}
            disabled={isLoading}
          >
            {isLoading ? '⏳ Enrolling...' : '🚀 Enroll Now'}
          </button>
        );
      
      case 'enrolled':
        return (
          <button 
            className="success-btn large-btn"
            onClick={handleStartLearning}
          >
            ▶️ Start Learning
          </button>
        );
      
      case 'in_progress':
        return (
          <div className="progress-section">
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="progress-text">{progress}% Complete</span>
            </div>
            
            {progress < 95 ? (
              <button 
                className="primary-btn large-btn"
                onClick={handleContinueLearning}
              >
                📚 Continue Learning
              </button>
            ) : (
              <div className="completion-section">
                <h4>Rate this course:</h4>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      className={`star-btn ${rating >= star ? 'active' : ''}`}
                      onClick={() => setRating(star)}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <button 
                  className="success-btn large-btn"
                  onClick={handleCompleteCourse}
                  disabled={isLoading || rating === 0}
                >
                  {isLoading ? '⏳ Completing...' : '🎓 Complete Course'}
                </button>
              </div>
            )}
          </div>
        );
      
      case 'completed':
        return (
          <div className="completed-section">
            <div className="completion-badge">
              🎉 Course Completed!
            </div>
            <button 
              className="certificate-btn large-btn"
              onClick={handleDownloadCertificate}
            >
              📜 Download Certificate
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!course) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="course-detail-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-header">
          <img 
            src={course.thumbnail || '/api/placeholder/400/200'} 
            alt={course.title}
            className="course-thumbnail"
          />
          <div className="course-info">
            <h2 className="course-title">{course.title}</h2>
            <p className="course-instructor">By {typeof course.instructor === 'object' ? course.instructor?.name : course.instructor}</p>
            <div className="course-meta">
              <span className="course-duration">⏱️ {course.duration}</span>
              <span className="course-level">📊 {course.level}</span>
              <span className="course-rating">⭐ {course.rating}/5</span>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="course-description">
            <h3>About this course</h3>
            <p>{course.description}</p>
          </div>

          <div className="course-curriculum">
            <h3>What you'll learn</h3>
            <ul className="learning-objectives">
              {course.learningObjectives?.map((objective, index) => (
                <li key={index}>✅ {objective}</li>
              )) || [
                <li key="1">✅ Master the fundamentals</li>,
                <li key="2">✅ Build practical projects</li>,
                <li key="3">✅ Apply industry best practices</li>,
                <li key="4">✅ Earn a certificate of completion</li>
              ]}
            </ul>
          </div>

          <div className="enrollment-section">
            {getActionButton()}
          </div>
        </div>

        {/* Certificate Modal */}
        {showCertificate && (
          <div className="certificate-modal">
            <div className="certificate-content">
              <h3>🎉 Congratulations!</h3>
              <p>You've successfully completed <strong>{course.title}</strong></p>
              <div className="certificate-preview">
                <div className="certificate-card">
                  <h4>Certificate of Completion</h4>
                  <p>Awarded to</p>
                  <h5>{user?.firstName} {user?.lastName}</h5>
                  <p>for completing</p>
                  <h6>{course.title}</h6>
                  <small>Certificate ID: {certificateId}</small>
                </div>
              </div>
              <div className="certificate-actions">
                <button 
                  className="primary-btn"
                  onClick={handleDownloadCertificate}
                >
                  📜 Download Certificate
                </button>
                <button 
                  className="secondary-btn"
                  onClick={() => setShowCertificate(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 2rem;
        }

        .course-detail-modal {
          background: var(--bg-primary);
          border-radius: var(--radius-2xl);
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: var(--shadow-2xl);
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: var(--bg-tertiary);
          border: none;
          border-radius: var(--radius-full);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.25rem;
          z-index: 1;
        }

        .modal-header {
          position: relative;
          padding: 2rem;
          border-bottom: 1px solid var(--border-color);
        }

        .course-thumbnail {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }

        .course-title {
          font-size: 1.75rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }

        .course-instructor {
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .course-meta {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .course-meta span {
          font-size: 0.875rem;
          color: var(--text-tertiary);
        }

        .modal-body {
          padding: 2rem;
        }

        .course-description h3,
        .course-curriculum h3 {
          margin-bottom: 1rem;
          color: var(--text-primary);
        }

        .learning-objectives {
          list-style: none;
          padding: 0;
        }

        .learning-objectives li {
          padding: 0.5rem 0;
          color: var(--text-secondary);
        }

        .enrollment-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
        }

        .progress-section {
          text-align: center;
        }

        .progress-bar-container {
          margin-bottom: 1.5rem;
        }

        .progress-bar {
          width: 100%;
          height: 12px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          background: var(--gradient-success);
          border-radius: var(--radius-full);
          transition: width 0.5s ease;
        }

        .progress-text {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .completion-section {
          text-align: center;
        }

        .rating-stars {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin: 1rem 0;
        }

        .star-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          opacity: 0.3;
          transition: opacity 0.2s;
        }

        .star-btn.active {
          opacity: 1;
        }

        .completed-section {
          text-align: center;
        }

        .completion-badge {
          background: var(--gradient-success);
          color: white;
          padding: 1rem 2rem;
          border-radius: var(--radius-full);
          font-size: 1.125rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          display: inline-block;
        }

        .large-btn {
          padding: 1rem 2rem;
          font-size: 1.125rem;
          font-weight: 600;
          border-radius: var(--radius-lg);
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 200px;
        }

        .primary-btn {
          background: var(--gradient-primary);
          color: white;
        }

        .success-btn {
          background: var(--gradient-success);
          color: white;
        }

        .certificate-btn {
          background: var(--gradient-warning);
          color: white;
        }

        .secondary-btn {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
        }

        .certificate-modal {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-2xl);
        }

        .certificate-content {
          background: var(--bg-primary);
          padding: 2rem;
          border-radius: var(--radius-xl);
          text-align: center;
          max-width: 500px;
        }

        .certificate-card {
          background: var(--gradient-primary);
          color: white;
          padding: 2rem;
          border-radius: var(--radius-lg);
          margin: 1.5rem 0;
        }

        .certificate-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 1.5rem;
        }

        @media (max-width: 768px) {
          .modal-overlay {
            padding: 1rem;
          }
          
          .modal-header,
          .modal-body {
            padding: 1.5rem;
          }
          
          .course-meta {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CourseDetailModal;
