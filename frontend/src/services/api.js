const API_BASE_URL = "http://localhost:5001/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }
  return response.json();
};

// Authentication APIs
export const login = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const register = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

// User Profile APIs
export const getUserProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const updateUserProfile = async (profileData) => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });
  return handleResponse(response);
};

// Course APIs
export const getCourses = async (filters = {}) => {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== "all") {
      queryParams.append(key, value);
    }
  });

  const response = await fetch(`${API_BASE_URL}/courses?${queryParams}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getCourseById = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const enrollInCourse = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const completeCourse = async (courseId, rating = null) => {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/complete`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ rating }),
  });
  return handleResponse(response);
};

// Recommendations API
export const getRecommendations = async () => {
  const response = await fetch(`${API_BASE_URL}/recommendations`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Categories API
export const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Wishlist APIs
export const addToWishlist = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/wishlist/${courseId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const removeFromWishlist = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/wishlist/${courseId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getWishlist = async () => {
  const response = await fetch(`${API_BASE_URL}/wishlist`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Favorites APIs
export const addToFavorites = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/favorites/${courseId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const removeFromFavorites = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/favorites/${courseId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getFavorites = async () => {
  const response = await fetch(`${API_BASE_URL}/favorites`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Certificate APIs
export const downloadCertificate = async (certificateId) => {
  const response = await fetch(`${API_BASE_URL}/certificate/${certificateId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  // Return blob for download
  return response.blob();
};

export const getCertificates = async () => {
  const response = await fetch(`${API_BASE_URL}/certificates`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Add Sample Data
export const addSampleData = async () => {
  const response = await fetch(`${API_BASE_URL}/add-sample-data`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Seed data (for development)
export const seedData = async () => {
  const response = await fetch(`${API_BASE_URL}/seed-data`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// AI-Powered Features APIs
export const getAIRecommendations = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/recommendations/${userId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    // Fallback to mock data if API not available
    return [
      { id: 1, title: 'AI-Recommended Course 1', score: 95 },
      { id: 2, title: 'AI-Recommended Course 2', score: 88 },
      { id: 3, title: 'AI-Recommended Course 3', score: 82 }
    ];
  }
};

export const getUserSkills = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/skills`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    // Fallback to mock data if API not available
    return [
      { name: 'JavaScript', level: 75, verified: true },
      { name: 'React', level: 60, verified: false },
      { name: 'Python', level: 45, verified: true }
    ];
  }
};

export const getTrendingSkills = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/skills/trending`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    // Fallback to mock data if API not available
    return [
      'Artificial Intelligence',
      'Blockchain Development', 
      'React.js',
      'Python',
      'Machine Learning',
      'Cloud Computing',
      'Cybersecurity',
      'Data Science',
      'Mobile Development',
      'DevOps',
      'UI/UX Design',
      'Digital Marketing'
    ];
  }
};

// Gamification APIs
export const getUserGamificationData = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/gamification`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    // Fallback to mock data
    return {
      level: 5,
      xp: 1250,
      streak: 7,
      badges: ['first_course', 'week_warrior'],
      totalPoints: 2500,
      rank: 'Explorer'
    };
  }
};

export const updateUserXP = async (userId, xpAmount, reason) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/xp`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ xpAmount, reason }),
    });
    return handleResponse(response);
  } catch (error) {
    console.log('XP update failed, using offline mode');
    return { success: true, newXP: 1250 + xpAmount };
  }
};

// Analytics APIs
export const getUserAnalytics = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/analytics`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    // Fallback to mock data
    return {
      totalLearningTime: 120,
      coursesCompleted: 8,
      averageRating: 4.6,
      skillProgress: [
        { skill: 'JavaScript', progress: 75 },
        { skill: 'React', progress: 60 },
        { skill: 'Python', progress: 45 }
      ]
    };
  }
};
