import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import '../styles/Profile.css';

const Profile = ({ user, onUpdateUser, onShowNotification }) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    interests: user.interests || [],
    knownLanguages: user.knownLanguages || [],
    bio: user.bio || '',
    phone: user.phone || '',
    profilePicture: user.profilePicture || '',
    socialLinks: {
      linkedin: user.socialLinks?.linkedin || '',
      github: user.socialLinks?.github || '',
      twitter: user.socialLinks?.twitter || '',
      website: user.socialLinks?.website || ''
    }
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [certificates, setCertificates] = useState([]);

  const availableInterests = [
    'Programming', 'Web Development', 'Data Science', 'Machine Learning',
    'Design', 'Marketing', 'Business', 'Photography', 'Music', 'Art',
    'Mobile Development', 'DevOps', 'Cybersecurity', 'Game Development',
    'Digital Marketing', 'Content Creation', 'Finance', 'Healthcare',
    'Education', 'Language Learning'
  ];

  const availableLanguages = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js',
    'PHP', 'Ruby', 'Swift', 'Kotlin', 'Go', 'Rust', 'C#', 'TypeScript',
    'Angular', 'Vue.js', 'Django', 'Flask', 'Spring', 'Laravel'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        onShowNotification('Image size should be less than 5MB', 'error');
        return;
      }

      setProfileImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fetch certificates
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const certificatesData = await api.getCertificates();
        setCertificates(certificatesData);
      } catch (error) {
        console.error('Failed to fetch certificates:', error);
      }
    };

    fetchCertificates();
  }, []);

  const handleDownloadCertificate = async (certificateId) => {
    try {
      const blob = await api.downloadCertificate(certificateId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certificateId}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      onShowNotification('Certificate downloaded successfully!', 'success');
    } catch (error) {
      onShowNotification('Failed to download certificate', 'error');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let profileData = { ...formData };

      // If there's a new image, convert to base64 for simplicity
      if (profileImageFile) {
        const reader = new FileReader();
        reader.onload = async () => {
          profileData.profilePicture = reader.result;
          const updatedUser = await api.updateUserProfile(profileData);
          onUpdateUser(updatedUser.user);
          setEditing(false);
          setProfileImageFile(null);
          setImagePreview(null);
          onShowNotification('Profile updated successfully!', 'success');
          setLoading(false);
        };
        reader.readAsDataURL(profileImageFile);
      } else {
        const updatedUser = await api.updateUserProfile(profileData);
        onUpdateUser(updatedUser.user);
        setEditing(false);
        onShowNotification('Profile updated successfully!', 'success');
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      onShowNotification('Failed to update profile', 'error');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      interests: user.interests || [],
      knownLanguages: user.knownLanguages || [],
      bio: user.bio || '',
      phone: user.phone || '',
      profilePicture: user.profilePicture || '',
      socialLinks: {
        linkedin: user.socialLinks?.linkedin || '',
        github: user.socialLinks?.github || '',
        twitter: user.socialLinks?.twitter || '',
        website: user.socialLinks?.website || ''
      }
    });
    setProfileImageFile(null);
    setImagePreview(null);
    setEditing(false);
  };

  const calculateProgress = () => {
    const totalCompleted = user.completedCourses?.filter(course => course.courseId)?.length || 0;
    const totalEnrolled = user.enrolledCourses?.filter(course => course.courseId)?.length || 0;
    const totalHours = user.completedCourses?.reduce((sum, course) => {
      return sum + (course.courseId?.duration || 0);
    }, 0) || 0;

    return { totalCompleted, totalEnrolled, totalHours };
  };

  const { totalCompleted, totalEnrolled, totalHours } = calculateProgress();

  return (
    <div className="profile">
      <div className="profile-container">
        
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-container">
            {user.profilePicture || imagePreview ? (
              <img
                className="profile-avatar-image"
                src={imagePreview || user.profilePicture}
                alt="Profile"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="profile-avatar" style={{display: user.profilePicture || imagePreview ? 'none' : 'flex'}}>
              {user.username && user.username.charAt(0).toUpperCase()}
            </div>
            {editing && (
              <div className="avatar-upload-overlay">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  id="avatar-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="avatar-upload" className="upload-button">
                  📷 Change Photo
                </label>
              </div>
            )}
          </div>
          <div className="profile-info">
            <h1>{user.username}</h1>
            <p className="profile-email">{user.email}</p>
            {user.bio && <p className="profile-bio">{user.bio}</p>}
            {user.phone && <p className="profile-phone">📞 {user.phone}</p>}

            {/* Social Links */}
            {(user.socialLinks?.linkedin || user.socialLinks?.github || user.socialLinks?.twitter || user.socialLinks?.website) && (
              <div className="social-links">
                {user.socialLinks.linkedin && (
                  <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                    LinkedIn
                  </a>
                )}
                {user.socialLinks.github && (
                  <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-link github">
                    GitHub
                  </a>
                )}
                {user.socialLinks.twitter && (
                  <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-link twitter">
                    Twitter
                  </a>
                )}
                {user.socialLinks.website && (
                  <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer" className="social-link website">
                    Website
                  </a>
                )}
              </div>
            )}

            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">{totalCompleted}</span>
                <span className="stat-label">Courses Completed</span>
              </div>
              <div className="stat">
                <span className="stat-number">{totalEnrolled}</span>
                <span className="stat-label">Currently Enrolled</span>
              </div>
              <div className="stat">
                <span className="stat-number">{totalHours}</span>
                <span className="stat-label">Hours Learned</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-content">
          {/* Interests & Skills Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Learning Preferences</h2>
              {!editing && (
                <button 
                  className="edit-button"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>

            {editing ? (
              <div className="edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      maxLength={500}
                      className="form-textarea"
                    />
                    <small className="char-count">{formData.bio.length}/500</small>
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Social Links</label>
                  <div className="social-inputs">
                    <div className="social-input-group">
                      <span className="social-prefix">linkedin.com/in/</span>
                      <input
                        type="text"
                        value={formData.socialLinks.linkedin}
                        onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                        placeholder="username"
                        className="form-input social-input"
                      />
                    </div>
                    <div className="social-input-group">
                      <span className="social-prefix">github.com/</span>
                      <input
                        type="text"
                        value={formData.socialLinks.github}
                        onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                        placeholder="username"
                        className="form-input social-input"
                      />
                    </div>
                    <div className="social-input-group">
                      <span className="social-prefix">twitter.com/</span>
                      <input
                        type="text"
                        value={formData.socialLinks.twitter}
                        onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                        placeholder="username"
                        className="form-input social-input"
                      />
                    </div>
                    <div className="social-input-group">
                      <span className="social-prefix">Website URL</span>
                      <input
                        type="url"
                        value={formData.socialLinks.website}
                        onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                        placeholder="https://yourwebsite.com"
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Interests</label>
                  <div className="multi-select">
                    {availableInterests.map(interest => (
                      <button
                        key={interest}
                        type="button"
                        className={`tag-button ${formData.interests.includes(interest) ? 'selected' : ''}`}
                        onClick={() => handleMultiSelect('interests', interest)}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Known Programming Languages & Technologies</label>
                  <div className="multi-select">
                    {availableLanguages.map(language => (
                      <button
                        key={language}
                        type="button"
                        className={`tag-button ${formData.knownLanguages.includes(language) ? 'selected' : ''}`}
                        onClick={() => handleMultiSelect('knownLanguages', language)}
                      >
                        {language}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    className="cancel-button"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    className="save-button"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-preferences">
                <div className="preference-group">
                  <h3>Interests</h3>
                  {user.interests && user.interests.length > 0 ? (
                    <div className="tags-display">
                      {user.interests.map(interest => (
                        <span key={interest} className="tag">{interest}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">No interests selected. Add some to get better recommendations!</p>
                  )}
                </div>

                <div className="preference-group">
                  <h3>Known Technologies</h3>
                  {user.knownLanguages && user.knownLanguages.length > 0 ? (
                    <div className="tags-display">
                      {user.knownLanguages.map(language => (
                        <span key={language} className="tag tech-tag">{language}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">No technologies specified. Add some to discover relevant courses!</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Learning Progress */}
          <div className="profile-section">
            <h2>Learning Progress</h2>
            
            {/* Enrolled Courses */}
            {user.enrolledCourses && user.enrolledCourses.length > 0 && (
              <div className="progress-group">
                <h3>Currently Enrolled ({user.enrolledCourses.length})</h3>
                <div className="courses-list">
                  {user.enrolledCourses.map(enrollment => (
                    enrollment.courseId ? (
                      <div key={enrollment.courseId._id} className="course-progress-item">
                        <div className="course-info">
                          <h4>{enrollment.courseId.title || 'Untitled Course'}</h4>
                          <p>by {enrollment.courseId.instructor}</p>
                          <span className="enrollment-date">
                            Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="progress-info">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill"
                              style={{ width: `${enrollment.progress}%` }}
                            ></div>
                          </div>
                          <span className="progress-text">{enrollment.progress}% Complete</span>
                        </div>
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
            )}

            {/* Completed Courses */}
            {user.completedCourses && user.completedCourses.length > 0 && (
              <div className="progress-group">
                <h3>Completed Courses ({user.completedCourses.length})</h3>
                <div className="courses-list">
                  {user.completedCourses.map(completion => (
                    completion.courseId ? (
                      <div key={completion.courseId._id} className="course-completion-item">
                        <div className="course-info">
                          <h4>{completion.courseId.title || 'Untitled Course'}</h4>
                          <p>by {completion.courseId.instructor}</p>
                          <span className="completion-date">
                            Completed: {new Date(completion.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="completion-info">
                          <div className="completion-badge">✓ Completed</div>
                          {completion.rating && (
                            <div className="user-rating">
                              {'⭐'.repeat(completion.rating)}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
            )}

            {/* No Progress Message */}
            {(!user.enrolledCourses || user.enrolledCourses.length === 0) && 
             (!user.completedCourses || user.completedCourses.length === 0) && (
              <div className="no-progress">
                <div className="no-progress-icon">📚</div>
                <h3>Start Your Learning Journey</h3>
                <p>You haven't enrolled in any courses yet. Explore our catalog to find courses that match your interests!</p>
                <button 
                  className="action-button primary"
                  onClick={() => onShowNotification('Browse courses to get started!', 'info')}
                >
                  Browse Courses
                </button>
              </div>
            )}
          </div>

          {/* Search History */}
          {user.searchHistory && user.searchHistory.length > 0 && (
            <div className="profile-section">
              <h2>Recent Searches</h2>
              <div className="search-history">
                {user.searchHistory.slice(-10).reverse().map((search, index) => (
                  <div key={index} className="search-item">
                    <span className="search-query">"{search.query}"</span>
                    <span className="search-date">
                      {new Date(search.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates Section */}
          <div className="profile-section">
            <h2>My Certificates</h2>
            {certificates.length > 0 ? (
              <div className="certificates-grid">
                {certificates.map((cert) => (
                  <div key={cert.certificateId} className="certificate-card">
                    <div className="certificate-icon">🏆</div>
                    <div className="certificate-info">
                      <h4>{cert.courseName}</h4>
                      <p className="certificate-instructor">by {cert.instructor}</p>
                      <p className="certificate-date">
                        Completed: {new Date(cert.completedAt).toLocaleDateString()}
                      </p>
                      {cert.rating && (
                        <div className="certificate-rating">
                          Rating: {'⭐'.repeat(cert.rating)}
                        </div>
                      )}
                    </div>
                    <button
                      className="download-certificate-btn"
                      onClick={() => handleDownloadCertificate(cert.certificateId)}
                    >
                      📜 Download
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-certificates">
                <div className="no-certificates-icon">🏆</div>
                <h3>No Certificates Yet</h3>
                <p>Complete your first course to earn your first certificate!</p>
              </div>
            )}
          </div>

          {/* Learning Insights */}
          <div className="profile-section">
            <h2>Learning Insights</h2>
            <div className="insights-grid">
              <div className="insight-card">
                <h4>Learning Streak</h4>
                <div className="insight-value">
                  {user.completedCourses ? Math.floor(Math.random() * 30) + 1 : 0} days
                </div>
                <p>Keep up the great work!</p>
              </div>
              
              <div className="insight-card">
                <h4>Favorite Category</h4>
                <div className="insight-value">
                  {user.interests && user.interests.length > 0 ? user.interests[0] : 'Not set'}
                </div>
                <p>Based on your interests</p>
              </div>
              
              <div className="insight-card">
                <h4>Learning Level</h4>
                <div className="insight-value">
                  {totalCompleted >= 5 ? 'Advanced' : totalCompleted >= 2 ? 'Intermediate' : 'Beginner'}
                </div>
                <p>Keep learning to level up!</p>
              </div>
              
              <div className="insight-card">
                <h4>Next Milestone</h4>
                <div className="insight-value">
                  {totalCompleted >= 10 ? '🏆 Expert' : totalCompleted >= 5 ? '🥉 Advanced' : '🥈 Intermediate'}
                </div>
                <p>{10 - totalCompleted > 0 ? `${10 - totalCompleted} courses to go!` : 'Milestone reached!'}</p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="profile-section">
            <h2>Account Information</h2>
            <div className="account-info">
              <div className="info-row">
                <label>Username:</label>
                <span>{user.username}</span>
              </div>
              <div className="info-row">
                <label>Email:</label>
                <span>{user.email}</span>
              </div>
              <div className="info-row">
                <label>Member Since:</label>
                <span>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
