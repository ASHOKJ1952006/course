import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CoursePlayer from './CoursePlayer';
import * as api from '../services/api';
import '../styles/design-system.css';
import '../styles/next-gen-course-catalog.css';

const EnhancedCourseList = ({ user, onCourseSelect, onShowNotification }) => {
  const { isAuthenticated } = useAuth();
  
  // State Management
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeCourse, setActiveCourse] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    level: 'all'
  });

  // Sample courses with interest-based recommendations
  const sampleCourses = [
    {
      _id: '1',
      title: 'AI-Powered Full Stack Development',
      instructor: 'Dr. Sarah Chen',
      category: 'Programming',
      level: 'Intermediate',
      duration: '45 hours',
      price: 199.99,
      originalPrice: 299.99,
      rating: 4.8,
      totalRatings: 2847,
      enrolledStudents: 12500,
      description: 'Master modern full-stack development with AI integration, machine learning APIs, and intelligent user interfaces.',
      thumbnail: '/api/placeholder/350/200',
      tags: ['React', 'Node.js', 'AI', 'Machine Learning', 'TypeScript'],
      skills: ['JavaScript', 'Python', 'React', 'AI/ML'],
      features: ['AI Chatbot Integration', 'Real-time Projects', 'Industry Mentorship', 'Job Guarantee'],
      trending: true,
      new: false,
      aiRecommendationScore: 95,
      interests: ['programming', 'ai', 'web development', 'javascript'],
      learningObjectives: [
        'Build full-stack applications with React and Node.js',
        'Integrate AI and machine learning APIs',
        'Create intelligent user interfaces',
        'Deploy scalable web applications'
      ]
    },
    {
      _id: '2',
      title: 'Data Science with Python & AI',
      instructor: 'Prof. Maria Garcia',
      category: 'Data Science',
      level: 'Beginner',
      duration: '40 hours',
      price: 179.99,
      originalPrice: 249.99,
      rating: 4.7,
      totalRatings: 3421,
      enrolledStudents: 15600,
      description: 'Complete data science journey from basics to advanced AI models with real-world projects and industry datasets.',
      thumbnail: '/api/placeholder/350/200',
      tags: ['Python', 'Pandas', 'TensorFlow', 'Data Analysis', 'AI'],
      skills: ['Python', 'Statistics', 'Machine Learning', 'Data Visualization'],
      features: ['Real Datasets', 'AI Model Building', 'Industry Projects', 'Kaggle Competitions'],
      trending: false,
      new: false,
      aiRecommendationScore: 92,
      interests: ['data science', 'python', 'ai', 'analytics'],
      learningObjectives: [
        'Master Python for data analysis',
        'Build machine learning models',
        'Create data visualizations',
        'Work with real-world datasets'
      ]
    },
    {
      _id: '3',
      title: 'Blockchain & Web3 Development',
      instructor: 'Alex Rodriguez',
      category: 'Blockchain',
      level: 'Advanced',
      duration: '60 hours',
      price: 249.99,
      originalPrice: 399.99,
      rating: 4.9,
      totalRatings: 1523,
      enrolledStudents: 8900,
      description: 'Build decentralized applications, smart contracts, and NFT marketplaces with cutting-edge blockchain technology.',
      thumbnail: '/api/placeholder/350/200',
      tags: ['Solidity', 'Ethereum', 'DeFi', 'NFTs', 'Web3'],
      skills: ['Solidity', 'JavaScript', 'Ethereum', 'Smart Contracts'],
      features: ['Live Blockchain Projects', 'NFT Creation', 'DeFi Protocols', 'Web3 Integration'],
      trending: true,
      new: true,
      aiRecommendationScore: 88,
      interests: ['blockchain', 'cryptocurrency', 'web3', 'defi'],
      learningObjectives: [
        'Develop smart contracts with Solidity',
        'Build decentralized applications',
        'Create NFT marketplaces',
        'Understand DeFi protocols'
      ]
    },
    {
      _id: '4',
      title: 'Mobile App Development with React Native',
      instructor: 'Jennifer Kim',
      category: 'Mobile Development',
      level: 'Intermediate',
      duration: '50 hours',
      price: 189.99,
      originalPrice: 279.99,
      rating: 4.6,
      totalRatings: 2156,
      enrolledStudents: 11200,
      description: 'Create cross-platform mobile apps for iOS and Android using React Native and modern development practices.',
      thumbnail: '/api/placeholder/350/200',
      tags: ['React Native', 'Mobile', 'iOS', 'Android', 'JavaScript'],
      skills: ['React Native', 'JavaScript', 'Mobile UI/UX', 'API Integration'],
      features: ['Cross-platform Development', 'App Store Deployment', 'Push Notifications', 'Real-time Features'],
      trending: true,
      new: false,
      aiRecommendationScore: 85,
      interests: ['mobile development', 'react', 'app development', 'javascript'],
      learningObjectives: [
        'Build cross-platform mobile apps',
        'Master React Native framework',
        'Deploy apps to app stores',
        'Implement advanced mobile features'
      ]
    }
  ];

  // Initialize courses with interest-based filtering
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let filteredCourses = [...sampleCourses];
      
      // Interest-based recommendations
      if (user && user.interests) {
        filteredCourses = filteredCourses.map(course => {
          const matchingInterests = course.interests.filter(interest =>
            user.interests.some(userInterest =>
              userInterest.toLowerCase().includes(interest.toLowerCase()) ||
              interest.toLowerCase().includes(userInterest.toLowerCase())
            )
          );
          
          return {
            ...course,
            aiRecommendationScore: course.aiRecommendationScore + (matchingInterests.length * 10),
            matchingInterests
          };
        });
        
        // Sort by AI recommendation score
        filteredCourses.sort((a, b) => b.aiRecommendationScore - a.aiRecommendationScore);
      }
      
      setCourses(filteredCourses);
      setLoading(false);
    }, 1000);
    
    // Load user progress from localStorage
    const enrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    const completed = JSON.parse(localStorage.getItem('completedCourses') || '[]');
    setEnrolledCourses(enrolled);
    setCompletedCourses(completed);
  }, [user]);

  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = !filters.search || 
      course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      course.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
    
    const matchesCategory = filters.category === 'all' || course.category === filters.category;
    const matchesLevel = filters.level === 'all' || course.level === filters.level;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Event handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleEnrollment = async (courseId) => {
    if (!user) {
      onShowNotification?.('Please login to enroll in courses', 'warning');
      return;
    }

    try {
      const newEnrolled = [...enrolledCourses, courseId];
      setEnrolledCourses(newEnrolled);
      localStorage.setItem('enrolledCourses', JSON.stringify(newEnrolled));
      
      await api.enrollInCourse(courseId);
      onShowNotification?.('🎉 Successfully enrolled in course!', 'success');
    } catch (error) {
      onShowNotification?.(error.message || 'Enrollment failed', 'error');
    }
  };

  const startCourse = (course) => {
    if (enrolledCourses.includes(course._id)) {
      setActiveCourse(course);
      onShowNotification?.(`Starting ${course.title}...`, 'info');
    } else {
      onShowNotification?.('Please enroll in the course first!', 'warning');
    }
  };

  const handleCourseComplete = async (course, certificate) => {
    try {
      const newCompleted = [...completedCourses, course._id];
      setCompletedCourses(newCompleted);
      localStorage.setItem('completedCourses', JSON.stringify(newCompleted));
      
      // Store certificate
      const userCertificates = JSON.parse(localStorage.getItem('userCertificates') || '[]');
      userCertificates.push(certificate);
      localStorage.setItem('userCertificates', JSON.stringify(userCertificates));
      
      setActiveCourse(null);
      onShowNotification?.(`🎉 Congratulations! You've completed ${course.title}!`, 'success');
    } catch (error) {
      onShowNotification?.(error.message || 'Failed to complete course', 'error');
    }
  };

  const renderCourseCard = (course) => {
    const discountPercentage = course.originalPrice 
      ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
      : 0;

    return (
      <div key={course._id} className="course-card-enhanced hover-lift">
        <div className="course-image-wrapper">
          <img 
            src={course.thumbnail || '/api/placeholder/350/200'} 
            alt={course.title}
            className="course-image-enhanced"
          />
          
          <div className="course-overlay-enhanced">
            <button 
              className="overlay-action"
              onClick={() => setSelectedCourse(course)}
              title="View Details & Enroll"
            >
              📖 View Course
            </button>
          </div>

          <div className="course-badges-enhanced">
            <span className="badge-enhanced badge-level">{course.level}</span>
            {course.trending && <span className="badge-enhanced badge-trending">🔥 Trending</span>}
            {course.new && <span className="badge-enhanced badge-new">✨ New</span>}
            {course.matchingInterests && course.matchingInterests.length > 0 && (
              <span className="badge-enhanced badge-recommended">🎯 Recommended</span>
            )}
            {discountPercentage > 0 && (
              <span className="badge-enhanced badge-discount">
                {discountPercentage}% OFF
              </span>
            )}
          </div>
        </div>

        <div className="course-content-enhanced">
          <div className="course-header-enhanced">
            <span className="course-category-enhanced">{course.category}</span>
            <div className="course-rating-enhanced">
              <div className="rating-stars-enhanced">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`star-enhanced ${i < Math.floor(course.rating) ? 'filled' : ''}`}>
                    ⭐
                  </span>
                ))}
              </div>
              <span className="rating-count">({course.totalRatings})</span>
            </div>
          </div>

          <h3 className="course-title-enhanced">{course.title}</h3>
          <p className="course-instructor-enhanced">by {typeof course.instructor === 'object' ? course.instructor?.name : course.instructor}</p>
          <p className="course-description-enhanced">{course.description}</p>

          {course.matchingInterests && course.matchingInterests.length > 0 && (
            <div className="matching-interests">
              <span className="interests-label">🎯 Matches your interests:</span>
              <div className="interests-tags">
                {course.matchingInterests.slice(0, 3).map(interest => (
                  <span key={interest} className="interest-tag">{interest}</span>
                ))}
              </div>
            </div>
          )}

          <div className="course-features-enhanced">
            {course.features?.slice(0, 3).map(feature => (
              <span key={feature} className="feature-tag">
                <span>✨</span>
                {feature}
              </span>
            ))}
          </div>

          <div className="course-footer-enhanced">
            <div className="price-section-enhanced">
              <span className="current-price-enhanced">${course.price}</span>
              {course.originalPrice && (
                <span className="original-price">${course.originalPrice}</span>
              )}
            </div>

            <div className="action-buttons-enhanced">
              {!enrolledCourses.includes(course._id) ? (
                <button 
                  className="btn-primary-enhanced"
                  onClick={() => handleEnrollment(course._id)}
                >
                  💳 Enroll Now
                </button>
              ) : completedCourses.includes(course._id) ? (
                <button 
                  className="btn-success-enhanced"
                  disabled
                >
                  ✅ Completed
                </button>
              ) : (
                <button 
                  className="btn-primary-enhanced"
                  onClick={() => startCourse(course)}
                >
                  🚀 Start Course
                </button>
              )}
              <button 
                className="btn-secondary-enhanced"
                onClick={() => setSelectedCourse(course)}
              >
                👁️ Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <h2>Please Login</h2>
        <p>You need to be logged in to view courses and enroll.</p>
      </div>
    );
  }

  return (
    <div className="next-gen-course-catalog">
      {/* Hero Header */}
      <div className="hero-header animate-fade-in">
        <h1 className="hero-title">
          🎯 Personalized Course Recommendations
        </h1>
        <p className="hero-subtitle">
          AI-powered course suggestions based on your interests and career goals
        </p>
        
        {user && user.interests && (
          <div className="user-interests">
            <span>Your interests: </span>
            {user.interests.map(interest => (
              <span key={interest} className="interest-badge">{interest}</span>
            ))}
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="search-filters-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search courses, skills, or topics..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input-advanced"
          />
          <span className="search-icon-advanced">🔍</span>
        </div>

        <div className="filters-row">
          <select 
            value={filters.category} 
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="Programming">Programming</option>
            <option value="Data Science">Data Science</option>
            <option value="Blockchain">Blockchain</option>
            <option value="Mobile Development">Mobile Development</option>
          </select>

          <select 
            value={filters.level} 
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      <div className="courses-grid-container">
        {loading ? (
          <div className="loading-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="course-card-enhanced animate-pulse">
                <div style={{height: '200px', background: 'var(--bg-secondary)'}}></div>
                <div style={{padding: 'var(--space-6)'}}>
                  <div style={{height: '20px', background: 'var(--bg-secondary)', marginBottom: 'var(--space-2)'}}></div>
                  <div style={{height: '16px', background: 'var(--bg-secondary)', marginBottom: 'var(--space-2)'}}></div>
                  <div style={{height: '60px', background: 'var(--bg-secondary)'}}></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="no-results" style={{textAlign: 'center', padding: 'var(--space-16)'}}>
            <div style={{fontSize: 'var(--font-size-5xl)', marginBottom: 'var(--space-4)'}}>🔍</div>
            <h3>No courses found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="courses-grid">
            {filteredCourses.map(course => renderCourseCard(course))}
          </div>
        )}
      </div>

      {/* Course Preview Modal */}
      {selectedCourse && (
        <div className="course-modal-overlay" onClick={() => setSelectedCourse(null)}>
          <div className="course-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedCourse.title}</h2>
              <button className="close-btn" onClick={() => setSelectedCourse(null)}>✕</button>
            </div>
            <div className="modal-content">
              <img src={selectedCourse.thumbnail} alt={selectedCourse.title} className="modal-image" />
              <div className="modal-details">
                <p><strong>Instructor:</strong> {selectedCourse.instructor}</p>
                <p><strong>Level:</strong> {selectedCourse.level}</p>
                <p><strong>Duration:</strong> {selectedCourse.duration}</p>
                <p><strong>Price:</strong> ${selectedCourse.price}</p>
                <p><strong>Rating:</strong> ⭐ {selectedCourse.rating} ({selectedCourse.totalRatings} reviews)</p>
                <p className="description">{selectedCourse.description}</p>
                
                <div className="learning-objectives">
                  <h4>What you'll learn:</h4>
                  <ul>
                    {selectedCourse.learningObjectives?.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="modal-actions">
                  {!enrolledCourses.includes(selectedCourse._id) ? (
                    <button 
                      className="btn-primary-enhanced"
                      onClick={() => {
                        handleEnrollment(selectedCourse._id);
                        setSelectedCourse(null);
                      }}
                    >
                      💳 Enroll Now - ${selectedCourse.price}
                    </button>
                  ) : completedCourses.includes(selectedCourse._id) ? (
                    <button className="btn-success-enhanced" disabled>
                      ✅ Completed
                    </button>
                  ) : (
                    <button 
                      className="btn-primary-enhanced"
                      onClick={() => {
                        startCourse(selectedCourse);
                        setSelectedCourse(null);
                      }}
                    >
                      🚀 Start Course
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .user-interests {
          margin-top: 1rem;
          text-align: center;
        }
        
        .interest-badge {
          display: inline-block;
          background: var(--gradient-primary);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          margin: 0 0.25rem;
        }
        
        .matching-interests {
          margin: 1rem 0;
          padding: 0.75rem;
          background: rgba(16, 185, 129, 0.1);
          border-radius: 0.5rem;
          border-left: 3px solid var(--accent-success);
        }
        
        .interests-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--accent-success);
          display: block;
          margin-bottom: 0.5rem;
        }
        
        .interests-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .interest-tag {
          background: var(--accent-success);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 0.75rem;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .badge-recommended {
          background: var(--gradient-success) !important;
        }
        
        .badge-discount {
          background: var(--gradient-warning) !important;
        }
        
        .search-filters-section {
          margin: 2rem 0;
          padding: 0 2rem;
        }
        
        .filters-row {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          justify-content: center;
        }
        
        .auth-required {
          text-align: center;
          padding: 4rem 2rem;
        }
        
        .btn-success-enhanced {
          background: var(--gradient-success);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: not-allowed;
          opacity: 0.8;
        }
        
        .btn-secondary-enhanced {
          background: transparent;
          color: var(--primary-600);
          border: 1px solid var(--primary-600);
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-secondary-enhanced:hover {
          background: var(--primary-600);
          color: white;
        }
        
        .course-modal-overlay {
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
        
        .course-modal {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 2rem 1rem 2rem;
          border-bottom: 1px solid var(--border-color);
        }
        
        .modal-header h2 {
          margin: 0;
          color: var(--text-primary);
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--text-secondary);
          padding: 0.5rem;
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
        }
        
        .close-btn:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }
        
        .modal-content {
          padding: 2rem;
        }
        
        .modal-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        
        .modal-details p {
          margin: 0.5rem 0;
          color: var(--text-primary);
        }
        
        .description {
          margin: 1rem 0 !important;
          line-height: 1.6;
          color: var(--text-secondary) !important;
        }
        
        .learning-objectives {
          margin: 1.5rem 0;
          padding: 1rem;
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
        }
        
        .learning-objectives h4 {
          margin: 0 0 1rem 0;
          color: var(--primary-600);
        }
        
        .learning-objectives ul {
          margin: 0;
          padding-left: 1.5rem;
        }
        
        .learning-objectives li {
          margin: 0.5rem 0;
          color: var(--text-primary);
        }
        
        .modal-actions {
          margin-top: 2rem;
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        
        @media (max-width: 768px) {
          .course-modal-overlay {
            padding: 1rem;
          }
          
          .modal-header {
            padding: 1.5rem 1.5rem 1rem 1.5rem;
          }
          
          .modal-content {
            padding: 1.5rem;
          }
          
          .modal-actions {
            flex-direction: column;
          }
        }
      `}</style>

      {/* Course Player Modal */}
      {activeCourse && (
        <CoursePlayer
          course={activeCourse}
          onClose={() => setActiveCourse(null)}
          onShowNotification={onShowNotification}
          onCourseComplete={handleCourseComplete}
        />
      )}
    </div>
  );
};

export default EnhancedCourseList;
