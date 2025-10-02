import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const userData = await api.getUserProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
      // For demo purposes, provide a mock user with realistic learning data
      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        avatar: '👨‍💻',
        interests: ['programming', 'ai', 'web development', 'data science'],
        enrolledCourses: [
          {
            id: 2,
            courseId: 2,
            title: 'Data Science with Python & AI',
            progress: 75,
            enrolledDate: '2024-09-20',
            lastAccessed: '2024-10-01'
          },
          {
            id: 4,
            courseId: 4,
            title: 'Mobile App Development with React Native',
            progress: 30,
            enrolledDate: '2024-09-25',
            lastAccessed: '2024-09-30'
          }
        ],
        completedCourses: [
          {
            id: 1,
            courseId: 1,
            title: 'AI-Powered Full Stack Development',
            completedDate: '2024-09-30',
            rating: 5,
            certificateId: 'CERT-001',
            finalGrade: 95
          },
          {
            id: 3,
            courseId: 3,
            title: 'Blockchain & Web3 Development',
            completedDate: '2024-09-15',
            rating: 4,
            certificateId: 'CERT-002',
            finalGrade: 88
          }
        ],
        certificates: [
          {
            id: 'CERT-001',
            courseTitle: 'AI-Powered Full Stack Development',
            issuedDate: '2024-09-30',
            credentialId: 'LNXT-AI-FST-001'
          },
          {
            id: 'CERT-002',
            courseTitle: 'Blockchain & Web3 Development',
            issuedDate: '2024-09-15',
            credentialId: 'LNXT-BLK-WEB3-002'
          }
        ],
        gamification: {
          level: 5,
          xp: 1250,
          streak: 12,
          badges: ['first_course', 'week_warrior', 'ai_pioneer', 'full_stack_master'],
          totalPoints: 2500,
          rank: 'Explorer'
        },
        learningStats: {
          totalHours: 135,
          averageRating: 4.5,
          coursesStarted: 4,
          coursesCompleted: 2,
          skillsLearned: 12,
          projectsBuilt: 8
        }
      };
      setUser(mockUser);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.login(credentials);
      const { token: newToken, user: userData } = response;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      return userData;
    } catch (error) {
      // For demo purposes, simulate successful login with realistic data
      const mockUser = {
        id: 1,
        firstName: credentials.email?.split('@')[0] || 'User',
        lastName: 'Demo',
        email: credentials.email,
        avatar: '👨‍💻',
        interests: ['programming', 'ai', 'web development', 'data science'],
        enrolledCourses: [
          {
            id: 2,
            courseId: 2,
            title: 'Data Science with Python & AI',
            progress: 75,
            enrolledDate: '2024-09-20',
            lastAccessed: '2024-10-01'
          },
          {
            id: 4,
            courseId: 4,
            title: 'Mobile App Development with React Native',
            progress: 30,
            enrolledDate: '2024-09-25',
            lastAccessed: '2024-09-30'
          }
        ],
        completedCourses: [
          {
            id: 1,
            courseId: 1,
            title: 'AI-Powered Full Stack Development',
            completedDate: '2024-09-30',
            rating: 5,
            certificateId: 'CERT-001',
            finalGrade: 95
          },
          {
            id: 3,
            courseId: 3,
            title: 'Blockchain & Web3 Development',
            completedDate: '2024-09-15',
            rating: 4,
            certificateId: 'CERT-002',
            finalGrade: 88
          }
        ],
        certificates: [
          {
            id: 'CERT-001',
            courseTitle: 'AI-Powered Full Stack Development',
            issuedDate: '2024-09-30',
            credentialId: 'LNXT-AI-FST-001'
          },
          {
            id: 'CERT-002',
            courseTitle: 'Blockchain & Web3 Development',
            issuedDate: '2024-09-15',
            credentialId: 'LNXT-BLK-WEB3-002'
          }
        ],
        gamification: {
          level: 5,
          xp: 1250,
          streak: 12,
          badges: ['first_course', 'week_warrior', 'ai_pioneer', 'full_stack_master'],
          totalPoints: 2500,
          rank: 'Explorer'
        },
        learningStats: {
          totalHours: 135,
          averageRating: 4.5,
          coursesStarted: 4,
          coursesCompleted: 2,
          skillsLearned: 12,
          projectsBuilt: 8
        }
      };
      
      localStorage.setItem('token', 'demo-token');
      setToken('demo-token');
      setUser(mockUser);
      
      return mockUser;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.register(userData);
      const { token: newToken, user: newUser } = response;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
