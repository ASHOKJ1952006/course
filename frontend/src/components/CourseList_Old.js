import React, { useState, useEffect, useRef } from 'react';
import * as api from '../services/api';
import '../styles/course-catalog.css';

const CourseList = ({ user, onCourseSelect, onShowNotification }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popularity');
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    level: 'all',
    price: 'all',
    rating: 'all',
    duration: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [coursesPerPage] = useState(12);
  const [priceRange, setPriceRange] = useState([0, 500]);

  const searchRef = useRef(null);

  const fetchCategories = async () => {
    try {
      const categoriesData = await api.getCategories();
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories(['Programming', 'Web Development', 'Data Science', 'Machine Learning']);
    }
  };
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        sortBy,
        page: currentPage,
        limit: coursesPerPage,
        priceMax: priceRange[1]
      };
      const response = await api.getCourses(params);
      setCourses(response.courses || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      onShowNotification('Failed to load courses', 'error');
      // Fallback with sample data
      setCourses([
        {
          _id: '1',
          title: 'JavaScript Fundamentals',
          instructor: 'John Doe',
          category: 'Programming',
          level: 'Beginner',
          duration: 20,
          price: 99.99,
          rating: 4.5,
          totalRatings: 150,
          enrolledStudents: 500,
          description: 'Learn JavaScript from scratch with hands-on projects',
          thumbnail: '/api/placeholder/300/200',
          tags: ['javascript', 'programming', 'web'],
          languages: ['JavaScript']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    loadWishlist();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [filters, sortBy, currentPage]);

  const loadWishlist = async () => {
    try {
      if (user) {
        const userWishlist = await api.getWishlist();
        setWishlist(userWishlist.map(item => item.courseId));
      }
    } catch (error) {
      console.log('Could not load wishlist');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const toggleWishlist = async (courseId) => {
    try {
      const isInWishlist = wishlist.includes(courseId);
      if (isInWishlist) {
        await api.removeFromWishlist(courseId);
        setWishlist(prev => prev.filter(id => id !== courseId));
        onShowNotification('Removed from wishlist', 'info');
      } else {
        await api.addToWishlist(courseId);
        setWishlist(prev => [...prev, courseId]);
        onShowNotification('Added to wishlist', 'success');
      }
    } catch (error) {
      onShowNotification('Please login to manage wishlist', 'warning');
    }
  };

  const toggleCompare = (courseId) => {
    if (compareList.includes(courseId)) {
      setCompareList(prev => prev.filter(id => id !== courseId));
    } else if (compareList.length < 3) {
      setCompareList(prev => [...prev, courseId]);
    } else {
      onShowNotification('You can compare up to 3 courses', 'warning');
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      level: 'all',
      price: 'all',
      rating: 'all',
      duration: 'all'
    });
    setPriceRange([0, 500]);
    setCurrentPage(1);
  };

  const enrollInCourse = async (courseId) => {
    try {
      await api.enrollInCourse(courseId);
      onShowNotification('Successfully enrolled in course!', 'success');
    } catch (error) {
      onShowNotification('Enrollment failed. Please try again.', 'error');
    }
  };

  const sortOptions = [
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

  const renderCourseCard = (course) => {
    const isInWishlist = wishlist.includes(course._id);
    const isInCompare = compareList.includes(course._id);

    return (
      <div key={course._id} className="course-card-grid">
        <div className="card-inner">
          <div className="course-image-container">
            <img 
              src={course.thumbnail || '/api/placeholder/300/200'} 
              alt={course.title}
              className="course-image"
            />
            
            <div className="course-overlay">
              <div className="overlay-actions">
                <button 
                  className="action-btn preview"
                  onClick={() => setSelectedCourse(course)}
                  title="Quick Preview"
                >
                  👁️
                </button>
                <button 
                  className={`action-btn wishlist ${isInWishlist ? 'active' : ''}`}
                  onClick={() => toggleWishlist(course._id)}
                  title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {isInWishlist ? '❤️' : '🤍'}
                </button>
                <button 
                  className={`action-btn compare ${isInCompare ? 'active' : ''}`}
                  onClick={() => toggleCompare(course._id)}
                  title="Add to compare"
                >
                  ⚖️
                </button>
              </div>
            </div>

            <div className="course-badges">
              <span className="level-badge" style={{ 
                backgroundColor: course.level === 'Beginner' ? '#10b981' : 
                                course.level === 'Intermediate' ? '#f59e0b' : '#ef4444' 
              }}>
                {course.level}
              </span>
            </div>
          </div>

          <div className="course-content">
            <div className="course-header">
              <div className="category-tag">{course.category}</div>
              <div className="course-rating">
                <span className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${i < Math.floor(course.rating) ? 'filled' : ''}`}>
                      ⭐
                    </span>
                  ))}
                </span>
                <span className="rating-number">
                  {course.rating?.toFixed(1)}
                </span>
              </div>
            </div>

            <h3 className="course-title">{course.title}</h3>
            <p className="course-instructor">by {course.instructor}</p>
            
            <p className="course-description">
              {course.description?.length > 100 
                ? `${course.description.substring(0, 100)}...` 
                : course.description}
            </p>

            <div className="course-features">
              <div className="feature-list">
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span>Hands-on projects</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📜</span>
                  <span>Certificate included</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💬</span>
                  <span>Community support</span>
                </div>
              </div>
            </div>

            <div className="course-tags">
              {course.tags?.slice(0, 3).map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>

            <div className="course-languages">
              {course.languages?.map(lang => (
                <span key={lang} className="language-badge">{lang}</span>
              ))}
            </div>
          </div>

          <div className="course-footer">
            <div className="price-section">
              <div className="current-price">${course.price}</div>
            </div>

            <div className="action-buttons">
              <button 
                className="btn-secondary preview-btn"
                onClick={() => setSelectedCourse(course)}
              >
                Preview
              </button>
              <button 
                className="btn-primary enroll-btn"
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

  return (
    <div className="course-catalog">
      {/* Header Section */}
      <div className="catalog-header">
        <div className="header-content">
          <h1 className="catalog-title">
            <span className="title-icon">📚</span>
            Course Catalog
          </h1>
          <p className="catalog-subtitle">
            Discover your next learning adventure from our curated collection
          </p>
        </div>

        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{courses.length}</span>
            <span className="stat-label">Courses</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{categories?.length || 8}</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Instructors</span>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="catalog-controls">
        <div className="search-section" ref={searchRef}>
          <div className="search-container advanced">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search courses, instructors, skills..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="search-input"
              />
              <button className="voice-search-btn" title="Voice Search">
                🎤
              </button>
              <button className="ai-search-btn" title="AI-Powered Search">
                ✨
              </button>
            </div>
          </div>
        </div>

        <div className="control-bar">
          <div className="left-controls">
            <button 
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <span className="filter-icon">🔧</span>
              Filters
              <span className="filter-count">
                {Object.values(filters).filter(v => v !== 'all' && v !== '').length}
              </span>
            </button>

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

          <div className="right-controls">
            <div className="view-modes">
              {viewModes.map(mode => (
                <button
                  key={mode.value}
                  className={`view-mode-btn ${viewMode === mode.value ? 'active' : ''}`}
                  onClick={() => setViewMode(mode.value)}
                  title={mode.label}
                >
                  {mode.icon}
                </button>
              ))}
            </div>

            <div className="results-info">
              Showing {courses.length} courses
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header">
            <h3>Advanced Filters</h3>
            <button className="clear-filters" onClick={clearFilters}>
              Clear All
            </button>
          </div>

          <div className="filters-grid">
            <div className="filter-group">
              <label>Category</label>
              <select 
                value={filters.category} 
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories?.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Level</label>
              <select 
                value={filters.level} 
                onChange={(e) => handleFilterChange('level', e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Rating</label>
              <select 
                value={filters.rating} 
                onChange={(e) => handleFilterChange('rating', e.target.value)}
              >
                <option value="all">All Ratings</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Price Range</label>
              <div className="range-slider">
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                />
                <div className="range-labels">
                  <span>$0</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compare Bar */}
      {compareList.length > 0 && (
        <div className="compare-bar">
          <div className="compare-content">
            <span className="compare-title">Compare Courses ({compareList.length}/3)</span>
            <div className="compare-items">
              {compareList.map(courseId => {
                const course = courses.find(c => c._id === courseId);
                return course ? (
                  <div key={courseId} className="compare-item">
                    <span>{course.title}</span>
                    <button onClick={() => toggleCompare(courseId)}>×</button>
                  </div>
                ) : null;
              })}
            </div>
            <button className="compare-btn-action">Compare Now</button>
          </div>
        </div>
      )}

      {/* Course Grid */}
      <div className="catalog-content">
        {loading ? (
          <div className="loading-grid">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="course-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                  <div className="skeleton-line"></div>
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No courses found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={`courses-container ${viewMode}`}>
            {courses.map(course => renderCourseCard(course))}
          </div>
        )}
      </div>

      {/* Course Preview Modal */}
      {selectedCourse && (
        <div className="course-modal-overlay" onClick={() => setSelectedCourse(null)}>
          <div className="course-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedCourse.title}</h2>
              <button 
                className="close-modal"
                onClick={() => setSelectedCourse(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="modal-left">
                <img 
                  src={selectedCourse.thumbnail || '/api/placeholder/400/250'} 
                  alt={selectedCourse.title}
                />
                <div className="modal-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => enrollInCourse(selectedCourse._id)}
                  >
                    Enroll Now - ${selectedCourse.price}
                  </button>
                  <button 
                    className={`btn-secondary ${wishlist.includes(selectedCourse._id) ? 'active' : ''}`}
                    onClick={() => toggleWishlist(selectedCourse._id)}
                  >
                    {wishlist.includes(selectedCourse._id) ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
                  </button>
                </div>
              </div>
              
              <div className="modal-right">
                <div className="course-details">
                  <p><strong>Instructor:</strong> {selectedCourse.instructor}</p>
                  <p><strong>Category:</strong> {selectedCourse.category}</p>
                  <p><strong>Level:</strong> {selectedCourse.level}</p>
                  <p><strong>Duration:</strong> {selectedCourse.duration} hours</p>
                  <p><strong>Rating:</strong> ⭐ {selectedCourse.rating?.toFixed(1)} ({selectedCourse.totalRatings} reviews)</p>
                </div>
                
                <div className="course-description">
                  <h4>About this course</h4>
                  <p>{selectedCourse.description}</p>
                </div>
                
                <div className="course-curriculum">
                  <h4>What you'll learn</h4>
                  <ul>
                    <li>Master the fundamentals and advanced concepts</li>
                    <li>Build real-world projects and portfolio</li>
                    <li>Get hands-on experience with industry tools</li>
                    <li>Earn a certificate of completion</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseList;
          </div>

          <div className="filter-controls">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
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

            <button 
              onClick={clearFilters}
              className="clear-filters-button"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="results-info">
          {!loading && (
            <p>
              Showing {courses.length} courses 
              {filters.search && ` for "${filters.search}"`}
              {filters.category !== 'all' && ` in ${filters.category}`}
              {filters.level !== 'all' && ` (${filters.level} level)`}
            </p>
          )}
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">📚</div>
          <h3>No courses found</h3>
          <p>Try adjusting your filters or search terms</p>
          <button onClick={clearFilters} className="action-button primary">
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="courses-grid">
            {courses.map(course => (
              <div key={course._id} className="course-card">
                <div className="course-image">
                  <img
                    src={course.thumbnail || '/api/placeholder/300/200'}
                    alt={course.title}
                    onError={(e) => {
                      e.target.src = '/api/placeholder/300/200';
                    }}
                  />
                  <div className="course-level-badge">{course.level}</div>
                  <WishlistButton
                    courseId={course._id}
                    user={user}
                    onShowNotification={onShowNotification}
                    className="course-wishlist-btn"
                  />
                  {course.languages.length > 0 && (
                    <div className="course-languages">
                      {course.languages.slice(0, 2).map(lang => (
                        <span key={lang} className="language-tag">{lang}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="course-content">
                  <div className="course-header">
                    <h3 className="course-title">{course.title}</h3>
                    <div className="course-price">${course.price}</div>
                  </div>

                  <p className="course-instructor">by {course.instructor}</p>
                  
                  <p className="course-description">
                    {course.description.length > 100 
                      ? `${course.description.substring(0, 100)}...` 
                      : course.description}
                  </p>

                  <div className="course-meta">
                    <div className="course-rating">
                      <span className="stars">
                        {'⭐'.repeat(Math.floor(course.rating))}
                      </span>
                      <span className="rating-number">
                        {course.rating.toFixed(1)} ({course.totalRatings})
                      </span>
                    </div>
                    
                    <div className="course-stats">
                      <span className="duration">
                        🕒 {course.duration}h
                      </span>
                      <span className="students">
                        👥 {course.enrolledStudents}
                      </span>
                    </div>
                  </div>

                  <div className="course-tags">
                    {course.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>

                  <div className="course-actions">
                    <button 
                      className="view-course-button"
                      onClick={() => onCourseSelect(course)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-button"
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
              >
                Previous
              </button>

              <div className="pagination-info">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (filters.page <= 3) {
                    pageNumber = i + 1;
                  } else if (filters.page >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = filters.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNumber}
                      className={`pagination-number ${filters.page === pageNumber ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button 
                className="pagination-button"
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseList;