import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import WishlistButton from './WishlistButton';

const CourseList = ({ user, onCourseSelect, onShowNotification }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    level: 'all',
    page: 1,
    limit: 12
  });
  const [totalPages, setTotalPages] = useState(1);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchCategories = async () => {
    try {
      const categoriesData = await api.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.getCourses(filters);
      setCourses(response.courses);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      onShowNotification('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  // Debounced search
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (filters.search !== '') {
        setFilters(prev => ({ ...prev, page: 1 }));
        fetchCourses();
      }
    }, 500);

    setSearchTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [filters.search]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when changing filters
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      level: 'all',
      page: 1,
      limit: 12
    });
  };

  return (
    <div className="course-list">
      <div className="course-list-header">
        <h1>Explore Courses</h1>
        <p>Discover your next learning adventure</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search courses, instructors, or topics..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
            <div className="search-icon">🔍</div>
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