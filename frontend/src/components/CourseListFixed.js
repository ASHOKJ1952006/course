import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './CourseList.css';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, searchTerm]);

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
      const params = {};
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const coursesData = await api.getCourses(params);
      setCourses(coursesData || []);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setError('Failed to load courses. Please try again.');
      setCourses([
        {
          id: 1,
          title: 'React Fundamentals',
          description: 'Learn the basics of React',
          category: 'Programming',
          price: 99,
          rating: 4.5,
          instructor: 'John Doe'
        },
        {
          id: 2,
          title: 'Node.js Backend Development',
          description: 'Build scalable backend applications',
          category: 'Programming',
          price: 149,
          rating: 4.7,
          instructor: 'Jane Smith'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await api.enrollInCourse(courseId);
      alert('Successfully enrolled in course!');
    } catch (error) {
      console.error('Failed to enroll:', error);
      alert('Failed to enroll. Please try again.');
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="course-list-container">
        <div className="loading">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="course-list-container">
      <header className="course-list-header">
        <h1>Available Courses</h1>
        <p>Discover and enroll in our comprehensive course catalog</p>
      </header>

      <div className="filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="courses-grid">
        {filteredCourses.length === 0 ? (
          <div className="no-courses">
            <p>No courses found matching your criteria.</p>
          </div>
        ) : (
          filteredCourses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-header">
                <h3 className="course-title">{course.title}</h3>
                <div className="course-rating">
                  ⭐ {course.rating}
                </div>
              </div>
              
              <div className="course-content">
                <p className="course-description">{course.description}</p>
                <div className="course-meta">
                  <span className="course-category">{course.category}</span>
                  <span className="course-instructor">by {course.instructor}</span>
                </div>
              </div>
              
              <div className="course-footer">
                <div className="course-price">
                  ${course.price}
                </div>
                <button
                  className="enroll-button"
                  onClick={() => handleEnroll(course.id)}
                >
                  Enroll Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseList;
