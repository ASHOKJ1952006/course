const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// JWT Secret
const JWT_SECRET = 'your_jwt_secret_key';

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend server is running!', 
    timestamp: new Date().toISOString(),
    status: 'OK'
  });
});

// Test recommendations without auth (for debugging)
app.get('/api/test-recommendations', async (req, res) => {
  try {
    const courses = await Course.find().limit(5);
    res.json({
      message: 'Test recommendations working',
      courses: courses,
      count: courses.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message, message: 'Database not connected' });
  }
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// MongoDB Connection with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/course_recommendation', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️ Server will continue without database - some features may not work');
    console.log('💡 To fix MongoDB:');
    console.log('   1. Install MongoDB Community Server');
    console.log('   2. Start MongoDB service');
    console.log('   3. Restart this server');
  }
};

connectDB();

// Simple User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  bio: { type: String, default: '' },
  interests: [String],
  knownLanguages: [String],
  completedCourses: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    completedAt: { type: Date, default: Date.now },
    rating: { type: Number, min: 1, max: 5 },
    certificateId: String
  }],
  enrolledCourses: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    enrolledAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Simple Course Schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  enrolledStudents: { type: Number, default: 0 },
  languages: [String],
  tags: [String],
  thumbnail: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    console.log('📝 Registration request received:', req.body);
    
    const { username, email, password, phone, bio, interests, knownLanguages } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email or username' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      phone: phone || '',
      bio: bio || '',
      interests: interests || [],
      knownLanguages: knownLanguages || []
    });

    await user.save();
    console.log('✅ User created successfully:', user.username);

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        interests: user.interests,
        knownLanguages: user.knownLanguages
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    console.log('🔐 Login request received');
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    console.log('✅ Login successful for:', user.username);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        interests: user.interests,
        knownLanguages: user.knownLanguages,
        completedCourses: user.completedCourses,
        enrolledCourses: user.enrolledCourses
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get User Profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('completedCourses.courseId')
      .populate('enrolledCourses.courseId');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      interests: user.interests,
      knownLanguages: user.knownLanguages,
      completedCourses: user.completedCourses,
      enrolledCourses: user.enrolledCourses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Courses
app.get('/api/courses', async (req, res) => {
  try {
    const { category, level, search, page = 1, limit = 12 } = req.query;
    
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (level && level !== 'all') {
      query.level = level;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { instructor: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalCourses = await Course.countDocuments(query);

    res.json({
      courses,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: parseInt(page),
      totalCourses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Course by ID
app.get('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enroll in Course
app.post('/api/courses/:id/enroll', authenticateToken, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.userId;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if user is already enrolled
    const user = await User.findById(userId);
    const alreadyEnrolled = user.enrolledCourses.some(
      enrollment => enrollment.courseId.toString() === courseId
    );

    if (alreadyEnrolled) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Enroll user
    await User.findByIdAndUpdate(userId, {
      $push: {
        enrolledCourses: {
          courseId: courseId,
          enrolledAt: new Date(),
          progress: 0
        }
      }
    });

    // Update course enrollment count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { enrolledStudents: 1 }
    });

    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Course.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Recommendations based on user interests and completed courses
app.get('/api/recommendations', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's completed course IDs
    const completedCourseIds = user.completedCourses.map(c => c.courseId);
    const enrolledCourseIds = user.enrolledCourses.map(c => c.courseId);
    const excludeIds = [...completedCourseIds, ...enrolledCourseIds];

    let recommendedCourses = [];

    // 1. Recommend based on user interests
    if (user.interests && user.interests.length > 0) {
      const interestBasedCourses = await Course.find({
        _id: { $nin: excludeIds },
        $or: [
          { category: { $in: user.interests } },
          { tags: { $in: user.interests.map(interest => new RegExp(interest, 'i')) } }
        ]
      }).limit(6);
      
      recommendedCourses = [...recommendedCourses, ...interestBasedCourses];
    }

    // 2. Recommend based on completed course categories
    if (user.completedCourses.length > 0) {
      const completedCourses = await Course.find({
        _id: { $in: completedCourseIds }
      });
      
      const completedCategories = [...new Set(completedCourses.map(c => c.category))];
      
      const categoryBasedCourses = await Course.find({
        _id: { $nin: excludeIds },
        category: { $in: completedCategories },
        level: { $in: ['Intermediate', 'Advanced'] } // Suggest higher level courses
      }).limit(4);
      
      recommendedCourses = [...recommendedCourses, ...categoryBasedCourses];
    }

    // 3. Fill with popular courses if not enough recommendations
    if (recommendedCourses.length < 8) {
      const popularCourses = await Course.find({
        _id: { $nin: [...excludeIds, ...recommendedCourses.map(c => c._id)] }
      })
      .sort({ enrolledStudents: -1, rating: -1 })
      .limit(8 - recommendedCourses.length);
      
      recommendedCourses = [...recommendedCourses, ...popularCourses];
    }

    // Remove duplicates and limit to 12
    const uniqueCourses = recommendedCourses.filter((course, index, self) => 
      index === self.findIndex(c => c._id.toString() === course._id.toString())
    ).slice(0, 12);

    res.json({
      courses: uniqueCourses,
      recommendationReason: {
        interests: user.interests || [],
        completedCourses: user.completedCourses.length,
        totalRecommendations: uniqueCourses.length
      }
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add some sample data endpoint
app.post('/api/add-sample-data', async (req, res) => {
  try {
    // Check if data already exists
    const existingCourses = await Course.countDocuments();
    if (existingCourses > 0) {
      return res.json({ message: 'Sample data already exists', courses: existingCourses });
    }

    const sampleCourses = [
      {
        title: "JavaScript Fundamentals",
        description: "Learn the basics of JavaScript programming language from scratch",
        instructor: "John Doe",
        category: "Programming",
        level: "Beginner",
        duration: 20,
        price: 99.99,
        rating: 4.5,
        totalRatings: 150,
        enrolledStudents: 500,
        languages: ["JavaScript"],
        tags: ["javascript", "programming", "web development", "frontend"],
        thumbnail: "https://via.placeholder.com/300x200/4f46e5/ffffff?text=JavaScript"
      },
      {
        title: "React.js Complete Course",
        description: "Master React.js from beginner to advanced level with hands-on projects",
        instructor: "Jane Smith",
        category: "Web Development",
        level: "Intermediate",
        duration: 35,
        price: 149.99,
        rating: 4.8,
        totalRatings: 200,
        enrolledStudents: 800,
        languages: ["JavaScript", "React"],
        tags: ["react", "javascript", "frontend", "components"],
        thumbnail: "https://via.placeholder.com/300x200/61dafb/000000?text=React"
      },
      {
        title: "Python for Data Science",
        description: "Complete guide to Python programming for data analysis and machine learning",
        instructor: "Dr. Alice Johnson",
        category: "Data Science",
        level: "Beginner",
        duration: 40,
        price: 179.99,
        rating: 4.7,
        totalRatings: 300,
        enrolledStudents: 1200,
        languages: ["Python"],
        tags: ["python", "data science", "machine learning", "analytics"],
        thumbnail: "https://via.placeholder.com/300x200/3776ab/ffffff?text=Python"
      },
      {
        title: "Node.js Backend Development",
        description: "Build scalable backend applications with Node.js and Express",
        instructor: "Mike Wilson",
        category: "Backend Development",
        level: "Intermediate",
        duration: 30,
        price: 129.99,
        rating: 4.6,
        totalRatings: 180,
        enrolledStudents: 600,
        languages: ["JavaScript", "Node.js"],
        tags: ["nodejs", "backend", "express", "api"],
        thumbnail: "https://via.placeholder.com/300x200/339933/ffffff?text=Node.js"
      },
      {
        title: "Machine Learning Fundamentals",
        description: "Introduction to machine learning concepts and algorithms",
        instructor: "Dr. Sarah Chen",
        category: "Machine Learning",
        level: "Intermediate",
        duration: 45,
        price: 199.99,
        rating: 4.9,
        totalRatings: 250,
        enrolledStudents: 900,
        languages: ["Python", "R"],
        tags: ["machine learning", "ai", "algorithms", "data science"],
        thumbnail: "https://via.placeholder.com/300x200/ff6b6b/ffffff?text=ML"
      },
      {
        title: "CSS Grid and Flexbox Mastery",
        description: "Master modern CSS layout techniques with Grid and Flexbox",
        instructor: "Emma Davis",
        category: "Web Development",
        level: "Beginner",
        duration: 15,
        price: 79.99,
        rating: 4.4,
        totalRatings: 120,
        enrolledStudents: 400,
        languages: ["CSS", "HTML"],
        tags: ["css", "layout", "responsive", "frontend"],
        thumbnail: "https://via.placeholder.com/300x200/1572b6/ffffff?text=CSS"
      },
      {
        title: "Advanced JavaScript Concepts",
        description: "Deep dive into advanced JavaScript concepts and patterns",
        instructor: "Robert Brown",
        category: "Programming",
        level: "Advanced",
        duration: 25,
        price: 159.99,
        rating: 4.7,
        totalRatings: 190,
        enrolledStudents: 350,
        languages: ["JavaScript"],
        tags: ["javascript", "advanced", "patterns", "async"],
        thumbnail: "https://via.placeholder.com/300x200/f7df1e/000000?text=JS+Advanced"
      },
      {
        title: "Database Design with MongoDB",
        description: "Learn NoSQL database design and MongoDB operations",
        instructor: "Lisa Garcia",
        category: "Database",
        level: "Intermediate",
        duration: 28,
        price: 139.99,
        rating: 4.5,
        totalRatings: 160,
        enrolledStudents: 450,
        languages: ["MongoDB", "JavaScript"],
        tags: ["mongodb", "database", "nosql", "backend"],
        thumbnail: "https://via.placeholder.com/300x200/4db33d/ffffff?text=MongoDB"
      }
    ];

    await Course.insertMany(sampleCourses);
    res.json({ message: 'Sample data added successfully', courses: sampleCourses.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log('🚀 Server starting...');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 API available at: http://localhost:${PORT}/api`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log('📝 Ready to accept requests!');
});
