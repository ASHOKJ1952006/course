import React, { useState } from 'react';

const CourseDetail = ({ course, user, onEnroll, onComplete, onDownloadCertificate, onBack, onShowNotification }) => {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  // Check enrollment status
  const isEnrolled = user.enrolledCourses?.some(
    enrollment => enrollment.courseId?._id === course?._id
  ) || false;
  const completionData = user.completedCourses?.find(
    completion => completion.courseId?._id === course?._id
  );
  const isCompleted = !!completionData;

  const enrollmentData = user.enrolledCourses?.find(
    enrollment => enrollment.courseId?._id === course?._id
  );

  const handleEnroll = async () => {
    setLoading(true);
    try {
      await onEnroll(course._id);
    } catch (error) {
      console.error('Enrollment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteWithRating = async () => {
    setLoading(true);
    try {
      await onComplete(course._id, rating);
      setShowRatingModal(false);
    } catch (error) {
      console.error('Course completion failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async () => {
    if (completionData?.certificateId) {
      try {
        await onDownloadCertificate(completionData.certificateId);
      } catch (error) {
        console.error('Certificate download failed:', error);
      }
    }
  };

  const renderStars = (currentRating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`star ${index < currentRating ? 'filled' : ''}`}
        onClick={() => setRating(index + 1)}
        style={{ cursor: 'pointer' }}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="course-detail">
      {/* Back Button */}
      <button className="back-button" onClick={onBack}>
        ← Back to Courses
      </button>

      <div className="course-detail-container">
        {/* Course Header */}
        <div className="course-header">
          <div className="course-image-container">
            <img 
              src={course.thumbnail || '/api/placeholder/600/400'} 
              alt={course.title}
              className="course-image"
              onError={(e) => {
                e.target.src = '/api/placeholder/600/400';
              }}
            />
            <div className="course-overlay">
              <div className="course-level-badge large">{course.level}</div>
            </div>
          </div>

          <div className="course-info">
            <div className="course-category">{course.category}</div>
            <h1 className="course-title">{course.title}</h1>
            <p className="course-instructor">Taught by {course.instructor}</p>
            
            <div className="course-stats">
              <div className="stat">
                <span className="stat-icon">⭐</span>
                <span className="stat-text">
                  {(course.rating ?? 0).toFixed(1)} ({course.totalRatings ?? 0} reviews)
                </span>
              </div>
              <div className="stat">
                <span className="stat-icon">👥</span>
                <span className="stat-text">{course.enrolledStudents ?? 0} students</span>
              </div>
              <div className="stat">
                <span className="stat-icon">🕒</span>
                <span className="stat-text">{course.duration ?? 0} hours</span>
              </div>
              <div className="stat">
                <span className="stat-icon">💰</span>
                <span className="stat-text">${course.price ?? 0}</span>
              </div>
            </div>

            {/* Languages & Tags */}
            {course.languages?.length > 0 && (
              <div className="course-languages">
                <strong>Languages: </strong>
                {course.languages.map(lang => (
                  <span key={lang} className="language-tag">{lang}</span>
                ))}
              </div>
            )}

            <div className="course-tags">
              {course.tags?.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>

            {/* Enrollment Status & Actions */}
            <div className="enrollment-section">
              {isCompleted ? (
                <div className="completion-status">
                  <div className="completion-info">
                    <span className="status-icon">🎉</span>
                    <span className="status-text">Course Completed!</span>
                    {completionData?.completedAt && (
                      <span className="completion-date">
                        Completed on {new Date(completionData.completedAt).toLocaleDateString()}
                      </span>
                    )}
                    {completionData?.rating && (
                      <div className="completion-rating">
                        Your Rating: {'⭐'.repeat(completionData.rating)}
                      </div>
                    )}
                  </div>
                  {completionData?.certificateId && (
                    <button
                      className="certificate-button"
                      onClick={handleDownloadCertificate}
                    >
                      📜 Download Certificate
                    </button>
                  )}
                </div>
              ) : isEnrolled ? (
                <div className="enrolled-status">
                  <div className="enrollment-info">
                    <span className="status-icon">📚</span>
                    <span className="status-text">You're enrolled in this course</span>
                    {enrollmentData && (
                      <div className="progress-info">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${enrollmentData.progress}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">{enrollmentData.progress}% Complete</span>
                      </div>
                    )}
                  </div>
                  <button 
                    className="complete-button"
                    onClick={() => setShowRatingModal(true)}
                    disabled={loading}
                  >
                    Mark as Complete
                  </button>
                </div>
              ) : (
                <button 
                  className="enroll-button"
                  onClick={handleEnroll}
                  disabled={loading}
                >
                  {loading ? 'Enrolling...' : `Enroll Now - $${course.price}`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="course-content">
          <div className="content-main">
            {/* Description */}
            <section className="course-section">
              <h2>About This Course</h2>
              <p className="course-description">{course.description}</p>
            </section>

            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <section className="course-section">
                <h2>Prerequisites</h2>
                <ul className="prerequisites-list">
                  {course.prerequisites.map((prereq, index) => (
                    <li key={index}>{prereq}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Course Modules */}
            {course.modules && course.modules.length > 0 && (
              <section className="course-section">
                <h2>Course Content</h2>
                <div className="modules-list">
                  {course.modules.map((module, index) => (
                    <div key={index} className="module-item">
                      <div className="module-header">
                        <h4>Module {index + 1}: {module.title}</h4>
                        <span className="module-duration">{module.duration} min</span>
                      </div>
                      <p className="module-description">{module.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="content-sidebar">
            {/* Course Info Card */}
            <div className="info-card">
              <h3>Course Information</h3>
              <div className="info-item">
                <strong>Level:</strong> {course.level}
              </div>
              <div className="info-item">
                <strong>Duration:</strong> {course.duration} hours
              </div>
              <div className="info-item">
                <strong>Category:</strong> {course.category}
              </div>
              {course.subcategory && (
                <div className="info-item">
                  <strong>Subcategory:</strong> {course.subcategory}
                </div>
              )}
              <div className="info-item">
                <strong>Last Updated:</strong> {new Date(course.lastUpdated).toLocaleDateString()}
              </div>
            </div>

            {/* Instructor Card */}
            <div className="info-card">
              <h3>Instructor</h3>
              <div className="instructor-info">
                <div className="instructor-avatar">
                  {course.instructor && course.instructor.charAt(0)}
                </div>
                <div className="instructor-details">
                  <h4>{course.instructor}</h4>
                  <p>Expert Instructor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Complete Course</h3>
              <button 
                className="modal-close"
                onClick={() => setShowRatingModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Congratulations on completing <strong>{course.title}</strong>!</p>
              <p>Please rate this course to help other learners:</p>
              
              <div className="rating-container">
                <div className="rating-stars">
                  {renderStars(rating)}
                </div>
                <div className="rating-text">
                  {rating} out of 5 stars
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="modal-button secondary"
                onClick={() => setShowRatingModal(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-button primary"
                onClick={handleCompleteWithRating}
                disabled={loading}
              >
                {loading ? 'Completing...' : 'Complete Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;