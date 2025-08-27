const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/course_recommendation', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  interests: [String], // Array of interests like "programming", "design", etc.
  knownLanguages: [String], // Programming languages user knows
  completedCourses: [{ 
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    completedAt: { type: Date, default: Date.now },
    rating: { type: Number, min: 1, max: 5 }
  }],
  enrolledCourses: [{ 
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    enrolledAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 } // Progress percentage
  }],
  searchHistory: [{
    query: String,
    timestamp: { type: Date, default: Date.now }
  }],
  profilePicture: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Course Schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: String,
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  duration: { type: Number, required: true }, // Duration in hours
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  enrolledStudents: { type: Number, default: 0 },
  languages: [String], // Programming languages covered in course
  prerequisites: [String],
  tags: [String],
  thumbnail: String,
  videoUrl: String,
  modules: [{
    title: String,
    description: String,
    videoUrl: String,
    duration: Number // Duration in minutes
  }],
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
});

// Search Log Schema (for tracking user search patterns)
const searchLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  query: String,
  resultsCount: Number,
  clickedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);
const SearchLog = mongoose.model('SearchLog', searchLogSchema);

// JWT Secret
const JWT_SECRET = 'your_jwt_secret_key';

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, interests, knownLanguages } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      interests: interests || [],
      knownLanguages: knownLanguages || []
    });

    await user.save();

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
    res.status(500).json({ error: error.message });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
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
      enrolledCourses: user.enrolledCourses,
      searchHistory: user.searchHistory.slice(-10) // Last 10 searches
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User Profile
app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { interests, knownLanguages } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { 
        $set: { 
          interests: interests || [],
          knownLanguages: knownLanguages || []
        }
      },
      { new: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        interests: user.interests,
        knownLanguages: user.knownLanguages
      }
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

    // Log search if query exists and user is authenticated
    if (search && req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Add to user search history
        await User.findByIdAndUpdate(decoded.userId, {
          $push: {
            searchHistory: {
              $each: [{ query: search }],
              $slice: -50 // Keep last 50 searches
            }
          }
        });

        // Log detailed search
        const searchLog = new SearchLog({
          userId: decoded.userId,
          query: search,
          resultsCount: totalCourses
        });
        await searchLog.save();
      } catch (err) {
        // Silent fail for search logging
      }
    }

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

// Complete Course
app.post('/api/courses/:id/complete', authenticateToken, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.userId;
    const { rating } = req.body;

    const user = await User.findById(userId);
    
    // Check if user is enrolled
    const enrollmentIndex = user.enrolledCourses.findIndex(
      enrollment => enrollment.courseId.toString() === courseId
    );

    if (enrollmentIndex === -1) {
      return res.status(400).json({ error: 'Not enrolled in this course' });
    }

    // Move from enrolled to completed
    const enrollment = user.enrolledCourses[enrollmentIndex];
    user.enrolledCourses.splice(enrollmentIndex, 1);
    
    user.completedCourses.push({
      courseId: courseId,
      completedAt: new Date(),
      rating: rating || null
    });

    await user.save();

    // Update course rating if provided
    if (rating) {
      const course = await Course.findById(courseId);
      const newTotalRatings = course.totalRatings + 1;
      const newRating = ((course.rating * course.totalRatings) + rating) / newTotalRatings;
      
      await Course.findByIdAndUpdate(courseId, {
        rating: newRating,
        totalRatings: newTotalRatings
      });
    }

    res.json({ message: 'Course completed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Course Recommendations
app.get('/api/recommendations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId)
      .populate('completedCourses.courseId')
      .populate('enrolledCourses.courseId');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all courses user hasn't completed or enrolled in
    const completedCourseIds = user.completedCourses.map(c => c.courseId._id);
    const enrolledCourseIds = user.enrolledCourses.map(c => c.courseId._id);
    const excludeIds = [...completedCourseIds, ...enrolledCourseIds];

    let recommendedCourses = [];

    // 1. Content-based recommendations based on interests
    if (user.interests.length > 0) {
      const interestBasedCourses = await Course.find({
        _id: { $nin: excludeIds },
        $or: [
          { category: { $in: user.interests } },
          { tags: { $in: user.interests } }
        ]
      }).limit(5).sort({ rating: -1 });

      recommendedCourses = [...recommendedCourses, ...interestBasedCourses];
    }

    // 2. Language-based recommendations
    if (user.knownLanguages.length > 0) {
      const languageBasedCourses = await Course.find({
        _id: { $nin: [...excludeIds, ...recommendedCourses.map(c => c._id)] },
        languages: { $in: user.knownLanguages }
      }).limit(3).sort({ rating: -1 });

      recommendedCourses = [...recommendedCourses, ...languageBasedCourses];
    }

    // 3. Search history based recommendations
    if (user.searchHistory.length > 0) {
      const recentSearches = user.searchHistory.slice(-5).map(s => s.query);
      const searchBasedCourses = await Course.find({
        _id: { $nin: [...excludeIds, ...recommendedCourses.map(c => c._id)] },
        $or: recentSearches.map(query => ({
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } }
          ]
        }))
      }).limit(3).sort({ rating: -1 });

      recommendedCourses = [...recommendedCourses, ...searchBasedCourses];
    }

    // 4. Similar users recommendations (collaborative filtering)
    const similarUsers = await User.find({
      _id: { $ne: userId },
      $or: [
        { interests: { $in: user.interests } },
        { knownLanguages: { $in: user.knownLanguages } }
      ]
    }).limit(10);

    const similarUsersCompletedCourses = similarUsers
      .flatMap(u => u.completedCourses.map(c => c.courseId))
      .filter(courseId => !excludeIds.includes(courseId));

    if (similarUsersCompletedCourses.length > 0) {
      const collaborativeFilteringCourses = await Course.find({
        _id: { 
          $in: similarUsersCompletedCourses,
          $nin: [...excludeIds, ...recommendedCourses.map(c => c._id)]
        }
      }).limit(3).sort({ rating: -1 });

      recommendedCourses = [...recommendedCourses, ...collaborativeFilteringCourses];
    }

    // 5. Popular courses (fallback)
    if (recommendedCourses.length < 10) {
      const popularCourses = await Course.find({
        _id: { $nin: [...excludeIds, ...recommendedCourses.map(c => c._id)] }
      }).sort({ enrolledStudents: -1, rating: -1 }).limit(10 - recommendedCourses.length);

      recommendedCourses = [...recommendedCourses, ...popularCourses];
    }

    // Remove duplicates and limit to 10
    const uniqueRecommendations = recommendedCourses
      .filter((course, index, self) => 
        index === self.findIndex(c => c._id.toString() === course._id.toString())
      )
      .slice(0, 10);

    res.json({
      recommendations: uniqueRecommendations,
      totalRecommendations: uniqueRecommendations.length
    });
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

// Add Sample Data (for development)
app.post('/api/seed-data', async (req, res) => {
  try {
    // Clear existing data
    await Course.deleteMany({});

    // Sample courses data
    const sampleCourses = [
      {
        title: "Complete JavaScript Course 2024",
        description: "Master JavaScript from basics to advanced concepts including ES6+, DOM manipulation, and async programming.",
        instructor: "John Smith",
        category: "Programming",
        level: "Beginner",
        duration: 40,
        price: 99.99,
        rating: 4.8,
        totalRatings: 150,
        enrolledStudents: 1200,
        languages: ["JavaScript"],
        tags: ["javascript", "web development", "programming"],
        modules: [
          { title: "JavaScript Basics", description: "Variables, functions, and control flow", duration: 60 },
          { title: "DOM Manipulation", description: "Working with HTML elements", duration: 45 }
        ]
      },
      {
        title: "React.js Fundamentals",
        description: "Learn React.js from scratch including hooks, state management, and component architecture.",
        instructor: "Sarah Johnson",
        category: "Web Development",
        level: "Intermediate",
        duration: 35,
        price: 129.99,
        rating: 4.9,
        totalRatings: 200,
        enrolledStudents: 800,
        languages: ["JavaScript", "React"],
        prerequisites: ["Basic JavaScript knowledge"],
        tags: ["react", "frontend", "web development"],
        modules: [
          { title: "React Basics", description: "Components and JSX", duration: 50 },
          { title: "State and Props", description: "Managing component state", duration: 40 }
        ]
      },
      {
        title: "Python for Data Science",
        description: "Complete guide to Python programming for data analysis and machine learning.",
        instructor: "Dr. Michael Chen",
        category: "Data Science",
        level: "Beginner",
        duration: 50,
        price: 149.99,
        rating: 4.7,
        totalRatings: 180,
        enrolledStudents: 950,
        languages: ["Python"],
        tags: ["python", "data science", "machine learning"],
        modules: [
          { title: "Python Basics", description: "Syntax and data structures", duration: 70 },
          { title: "Data Analysis with Pandas", description: "Working with datasets", duration: 60 }
        ]
      },
      {
        title: "UI/UX Design Masterclass",
        description: "Learn user interface and user experience design principles with hands-on projects.",
        instructor: "Emma Wilson",
        category: "Design",
        level: "Beginner",
        duration: 30,
        price: 89.99,
        rating: 4.6,
        totalRatings: 120,
        enrolledStudents: 600,
        languages: [],
        tags: ["ui design", "ux design", "figma", "design thinking"],
        modules: [
          { title: "Design Principles", description: "Color theory and typography", duration: 45 },
          { title: "User Research", description: "Understanding user needs", duration: 35 }
        ]
      },
      {
        title: "Node.js Backend Development",
        description: "Build scalable backend applications with Node.js, Express, and MongoDB.",
        instructor: "Alex Rodriguez",
        category: "Backend Development",
        level: "Intermediate",
        duration: 45,
        price: 159.99,
        rating: 4.8,
        totalRatings: 95,
        enrolledStudents: 450,
        languages: ["JavaScript", "Node.js"],
        prerequisites: ["JavaScript basics"],
        tags: ["nodejs", "backend", "api development", "mongodb"],
        modules: [
          { title: "Node.js Fundamentals", description: "Server-side JavaScript", duration: 55 },
          { title: "Building APIs", description: "RESTful API development", duration: 50 }
        ]
      }
    ];

    await Course.insertMany(sampleCourses);

    res.json({ message: 'Sample data added successfully', courses: sampleCourses.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});