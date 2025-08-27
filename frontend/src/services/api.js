const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Authentication APIs
export const login = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(credentials)
  });
  return handleResponse(response);
};

export const register = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData)
  });
  return handleResponse(response);
};

// User Profile APIs
export const getUserProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const updateUserProfile = async (profileData) => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData)
  });
  return handleResponse(response);
};

// Course APIs
export const getCourses = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 'all') {
      queryParams.append(key, value);
    }
  });

  const response = await fetch(`${API_BASE_URL}/courses?${queryParams}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const getCourseById = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const enrollInCourse = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const completeCourse = async (courseId, rating = null) => {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/complete`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ rating })
  });
  return handleResponse(response);
};

// Recommendations API
export const getRecommendations = async () => {
  const response = await fetch(`${API_BASE_URL}/recommendations`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

// Categories API
export const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

// Seed data (for development)
export const seedData = async () => {
  const response = await fetch(`${API_BASE_URL}/seed-data`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};