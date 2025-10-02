import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CourseDetailModal from './CourseDetailModal';
import * as api from '../services/api';
import '../styles/design-system.css';
import '../styles/next-gen-course-catalog.css';

const NextGenCourseList = ({ user, onCourseSelect, onShowNotification }) => {
  const { isAuthenticated } = useAuth();
  // State Management
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('ai-recommended');
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    level: 'all',
    price: 'all',
    rating: 'all',
    duration: 'all',
    skills: [],
    language: 'all'
  });
  
  // Advanced Features State
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [learningPath, setLearningPath] = useState(null);
  const [personalizedCourses, setPersonalizedCourses] = useState([]);
  const [trendingSkills, setTrendingSkills] = useState([]);
  
  // UI State
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [coursesPerPage] = useState(12);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isVoiceSearchActive, setIsVoiceSearchActive] = useState(false);

  const searchRef = useRef(null);
  const voiceRecognitionRef = useRef(null);

  // Enhanced Data Fetching
  const fetchEnhancedData = async () => {
    try {
      setLoading(true);
      
      // Parallel API calls for better performance
      const [
        coursesResponse,
        categoriesResponse,
        aiRecommendationsResponse,
        userSkillsResponse,
        trendingSkillsResponse
      ] = await Promise.allSettled([
        api.getCourses({ ...filters, sortBy, page: currentPage, limit: coursesPerPage }),
        api.getCategories(),
        user ? api.getAIRecommendations(user.id) : Promise.resolve([]),
        user ? api.getUserSkills(user.id) : Promise.resolve([]),
        api.getTrendingSkills()
      ]);

      // Process responses
      if (coursesResponse.status === 'fulfilled') {
        setCourses(coursesResponse.value.courses || generateSampleCourses());
        setTotalPages(coursesResponse.value.totalPages || 1);
      }

      if (categoriesResponse.status === 'fulfilled') {
        setCategories(categoriesResponse.value || getDefaultCategories());
      }

      if (aiRecommendationsResponse.status === 'fulfilled') {
        setAiRecommendations(aiRecommendationsResponse.value || []);
      }

      if (userSkillsResponse.status === 'fulfilled') {
        setUserSkills(userSkillsResponse.value || []);
      }

      if (trendingSkillsResponse.status === 'fulfilled') {
        setTrendingSkills(trendingSkillsResponse.value || getDefaultTrendingSkills());
      }

    } catch (error) {
      console.error('Failed to fetch enhanced data:', error);
      onShowNotification?.('Failed to load course data', 'error');
      
      // Fallback data
      setCourses(generateSampleCourses());
      setCategories(getDefaultCategories());
      setTrendingSkills(getDefaultTrendingSkills());
    } finally {
      setLoading(false);
    }
  };

  // Sample Data Generators
  const generateSampleCourses = () => [
    {
      _id: '1',
      title: 'AI-Powered Full Stack Development',
      instructor: { name: 'Dr. Sarah Chen', rating: 4.9, expertise: ['AI', 'Web Development'] },
      category: 'Programming',
      level: 'Intermediate',
      duration: 45,
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
      estimatedCompletionTime: '6 weeks',
      careerPaths: ['Full Stack Developer', 'AI Engineer', 'Tech Lead']
    },
    {
      _id: '2',
      title: 'Blockchain & Web3 Development Mastery',
      instructor: { name: 'Alex Rodriguez', rating: 4.7, expertise: ['Blockchain', 'Smart Contracts'] },
      category: 'Blockchain',
      level: 'Advanced',
      duration: 60,
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
      estimatedCompletionTime: '8 weeks',
      careerPaths: ['Blockchain Developer', 'Smart Contract Engineer', 'DeFi Specialist']
    },
    {
      _id: '3',
      title: 'Data Science with Python & AI',
      instructor: { name: 'Prof. Maria Garcia', rating: 4.8, expertise: ['Data Science', 'Machine Learning'] },
      category: 'Data Science',
      level: 'Beginner',
      duration: 40,
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
      estimatedCompletionTime: '5 weeks',
      careerPaths: ['Data Scientist', 'ML Engineer', 'Data Analyst']
    }
  ];

  const getDefaultCategories = () => [
    'Programming', 'Data Science', 'AI & Machine Learning', 'Blockchain', 
    'Web Development', 'Mobile Development', 'DevOps', 'Cybersecurity',
    'Cloud Computing', 'UI/UX Design', 'Digital Marketing', 'Business'
  ];

  const getDefaultTrendingSkills = () => [
    'Artificial Intelligence', 'Blockchain Development', 'React.js', 'Python',
    'Machine Learning', 'Cloud Computing', 'Cybersecurity', 'Data Science',
    'Mobile Development', 'DevOps', 'UI/UX Design', 'Digital Marketing'
  ];

  // Voice Search Implementation
  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsVoiceSearchActive(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setFilters(prev => ({ ...prev, search: transcript }));
        setIsVoiceSearchActive(false);
      };

      recognition.onerror = () => {
        setIsVoiceSearchActive(false);
        onShowNotification?.('Voice search failed. Please try again.', 'error');
      };

      recognition.onend = () => {
        setIsVoiceSearchActive(false);
      };

      recognition.start();
      voiceRecognitionRef.current = recognition;
    } else {
      onShowNotification?.('Voice search not supported in this browser', 'warning');
    }
  };

  // AI-Powered Search Suggestions
  const generateSearchSuggestions = (query) => {
    if (!query || query.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    const suggestions = [
      `${query} for beginners`,
      `Advanced ${query}`,
      `${query} with projects`,
      `${query} certification`,
      `${query} bootcamp`
    ];

    setSearchSuggestions(suggestions);
  };

  // Enhanced Filtering Logic
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = [...courses];

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        course.instructor.name.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(course => course.category === filters.category);
    }

    if (filters.level !== 'all') {
      filtered = filtered.filter(course => course.level === filters.level);
    }

    if (filters.rating !== 'all') {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(course => course.rating >= minRating);
    }

    // Apply sorting
    switch (sortBy) {
      case 'ai-recommended':
        filtered.sort((a, b) => (b.aiRecommendationScore || 0) - (a.aiRecommendationScore || 0));
        break;
      case 'popularity':
        filtered.sort((a, b) => b.enrolledStudents - a.enrolledStudents);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return filtered;
  }, [courses, filters, sortBy]);

  const handleCourseComplete = async (courseId, rating) => {
    try {
      await api.completeCourse(courseId, rating);
      onShowNotification?.('🎉 Course completed! Certificate is ready for download.', 'success');
      
      // Refresh data
      fetchEnhancedData();
    } catch (error) {
      onShowNotification?.(error.message || 'Failed to complete course', 'error');
    }
  };

  // Event Handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
    
    if (key === 'search') {
      generateSearchSuggestions(value);
    }
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handleSkillTagClick = (skill) => {
    setFilters(prev => ({ ...prev, search: skill }));
  };

  const enrollInCourse = async (courseId) => {
    if (!user) {
      onShowNotification?.('Please login to enroll in courses', 'warning');
      return;
    }

    try {
      await api.enrollInCourse(courseId);
      onShowNotification?.('Successfully enrolled in course!', 'success');
      
      // Update user data or refresh courses
      fetchEnhancedData();
    } catch (error) {
      onShowNotification?.(error.message || 'Enrollment failed', 'error');
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchEnhancedData();
  }, [filters, sortBy, currentPage]);

  // Interest-based recommendations
  useEffect(() => {
    if (user && user.interests) {
      const interestBasedCourses = courses.filter(course => 
        user.interests.some(interest => 
          course.tags.some(tag => 
            tag.toLowerCase().includes(interest.toLowerCase())
          ) ||
          course.category.toLowerCase().includes(interest.toLowerCase()) ||
          course.skills.some(skill => 
            skill.toLowerCase().includes(interest.toLowerCase())
          )
        )
      );
      
      setPersonalizedCourses(interestBasedCourses);
    }
  }, [courses, user]);

  // Effects
  useEffect(() => {
    fetchEnhancedData();
  }, [filters, sortBy, currentPage, user]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      generateSearchSuggestions(filters.search);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [filters.search]);

  const toggleWishlist = async (courseId) => {
    try {
      const isInWishlist = wishlist.includes(courseId);
      if (isInWishlist) {
        await api.removeFromWishlist(courseId);
        setWishlist(prev => prev.filter(id => id !== courseId));
        onShowNotification?.('Removed from wishlist', 'info');
      } else {
        await api.addToWishlist(courseId);
        setWishlist(prev => [...prev, courseId]);
        onShowNotification?.('Added to wishlist', 'success');
      }
    } catch (error) {
      onShowNotification?.('Please login to manage wishlist', 'warning');
    }
  };

  // Render Methods
  const renderCourseCard = (course) => {
    const isInWishlist = wishlist.includes(course._id);
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
              title="Quick Preview"
            >
              👁️
            </button>
            <button 
              className="overlay-action"
              onClick={() => toggleWishlist(course._id)}
              title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isInWishlist ? '❤️' : '🤍'}
            </button>
            <button 
              className="overlay-action"
              onClick={() => onCourseSelect?.(course)}
              title="View Details"
            >
              📖
            </button>
          </div>

          <div className="course-badges-enhanced">
            <span className="badge-enhanced badge-level">{course.level}</span>
            {course.trending && <span className="badge-enhanced badge-trending">🔥 Trending</span>}
            {course.new && <span className="badge-enhanced badge-new">✨ New</span>}
            {discountPercentage > 0 && (
              <span className="badge-enhanced" style={{background: 'var(--gradient-warning)'}}>
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
          <p className="course-instructor-enhanced">by {course.instructor.name}</p>
          <p className="course-description-enhanced">{course.description}</p>

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
              <button 
                className="btn-secondary-enhanced"
                onClick={() => setSelectedCourse(course)}
              >
                Preview
              </button>
              <button 
                className="btn-primary-enhanced"
                onClick={() => enrollInCourse(course._id)}
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const sortOptions = [
    { value: 'ai-recommended', label: '🤖 AI Recommended', icon: '🎯' },
    { value: 'popularity', label: 'Most Popular', icon: '🔥' },
    { value: 'rating', label: 'Highest Rated', icon: '⭐' },
    { value: 'newest', label: 'Newest First', icon: '🆕' },
    { value: 'price-low', label: 'Price: Low to High', icon: '💰' },
    { value: 'price-high', label: 'Price: High to Low', icon: '💎' }
  ];

  const viewModes = [
    { value: 'grid', label: 'Grid View', icon: '⊞' },
    { value: 'list', label: 'List View', icon: '☰' },
    { value: 'compact', label: 'Compact View', icon: '▤' }
  ];

  return (
    <div className="next-gen-course-catalog">
      {/* Hero Header */}
      <div className="hero-header animate-fade-in">
        <h1 className="hero-title">
          Discover Your Next Learning Adventure
        </h1>
        <p className="hero-subtitle">
          AI-powered course recommendations tailored to your career goals and learning style
        </p>
        
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-number">{filteredAndSortedCourses.length}+</span>
            <span className="hero-stat-label">Courses</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">{categories.length}</span>
            <span className="hero-stat-label">Categories</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">50K+</span>
            <span className="hero-stat-label">Students</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">95%</span>
            <span className="hero-stat-label">Success Rate</span>
          </div>
        </div>
      </div>

      {/* Advanced Search Section */}
      <div className="advanced-search-section">
        <div className="search-container-advanced animate-slide-up">
          <div className="search-input-group">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search courses, skills, instructors, or career paths..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input-advanced"
            />
            <span className="search-icon-advanced">🔍</span>
            
            <div className="search-actions">
              <button 
                className="search-action-btn"
                onClick={startVoiceSearch}
                disabled={isVoiceSearchActive}
                title="Voice Search"
              >
                {isVoiceSearchActive ? '🎙️' : '🎤'}
              </button>
              <button 
                className="search-action-btn ai-search-btn"
                title="AI-Powered Search"
              >
                ✨
              </button>
            </div>
          </div>

          {/* Smart Filters */}
          <div className="smart-filters">
            <div className="filter-group-advanced">
              <label className="filter-label">Category</label>
              <select 
                value={filters.category} 
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="filter-group-advanced">
              <label className="filter-label">Level</label>
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

            <div className="filter-group-advanced">
              <label className="filter-label">Rating</label>
              <select 
                value={filters.rating} 
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Ratings</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>
            </div>

            <div className="filter-group-advanced">
              <label className="filter-label">Duration</label>
              <select 
                value={filters.duration} 
                onChange={(e) => handleFilterChange('duration', e.target.value)}
                className="filter-select"
              >
                <option value="all">Any Duration</option>
                <option value="short">Under 20 hours</option>
                <option value="medium">20-40 hours</option>
                <option value="long">40+ hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Recommendations Panel */}
        {trendingSkills.length > 0 && (
          <div className="ai-recommendations animate-slide-up">
            <h3 className="ai-title">
              <span>🤖</span>
              Trending Skills & AI Recommendations
            </h3>
            <p className="ai-subtitle">
              Based on current job market trends and your learning history
            </p>
            <div className="recommended-tags">
              {trendingSkills.slice(0, 8).map(skill => (
                <button
                  key={skill}
                  className="recommended-tag"
                  onClick={() => handleSkillTagClick(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Course Grid Container */}
      <div className="courses-grid-container">
        {/* View Controls */}
        <div className="view-controls">
          <div className="view-mode-switcher">
            {viewModes.map(mode => (
              <button
                key={mode.value}
                className={`view-mode-btn ${viewMode === mode.value ? 'active' : ''}`}
                onClick={() => setViewMode(mode.value)}
                title={mode.label}
              >
                <span>{mode.icon}</span>
                <span>{mode.label}</span>
              </button>
            ))}
          </div>

          <div className="sort-controls">
            <span className="sort-label">Sort by:</span>
            <div className="sort-dropdown">
              <select 
                value={sortBy} 
                onChange={(e) => handleSortChange(e.target.value)}
                className="sort-select"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => (
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
        ) : filteredAndSortedCourses.length === 0 ? (
          <div className="no-results animate-fade-in" style={{textAlign: 'center', padding: 'var(--space-16)'}}>
            <div style={{fontSize: 'var(--font-size-5xl)', marginBottom: 'var(--space-4)'}}>🔍</div>
            <h3 style={{fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-2)'}}>No courses found</h3>
            <p style={{color: 'var(--text-secondary)', marginBottom: 'var(--space-6)'}}>
              Try adjusting your filters or search terms
            </p>
            <button 
              className="btn-primary-enhanced"
              onClick={() => setFilters({
                search: '', category: 'all', level: 'all', 
                price: 'all', rating: 'all', duration: 'all', 
                skills: [], language: 'all'
              })}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="courses-grid">
            {filteredAndSortedCourses.map(course => renderCourseCard(course))}
          </div>
        )}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onEnroll={enrollInCourse}
          onComplete={handleCourseComplete}
          onShowNotification={onShowNotification}
        />
      )}
    </div>
  );
};

export default NextGenCourseList;
