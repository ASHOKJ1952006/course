const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createCanvas } = require('canvas');

const app = express();

// JWT Secret
const JWT_SECRET = 'your_jwt_secret_key';

// Middleware
app.use(cors());
app.use(express.json());

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

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/course_recommendation', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB successfully');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Define all schemas first
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '' },
  password: { type: String, required: true },
  bio: { type: String, default: '', maxlength: 500 },
  interests: [String], // Array of interests like "programming", "design", etc.
  knownLanguages: [String], // Programming languages user knows

  // Social login information
  socialLogins: {
    google: {
      id: String,
      email: String,
      verified: { type: Boolean, default: false }
    },
    github: {
      id: String,
      username: String,
      verified: { type: Boolean, default: false }
    }
  },

  // Course progress tracking
  completedCourses: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    completedAt: { type: Date, default: Date.now },
    rating: { type: Number, min: 1, max: 5 },
    certificate: {
      id: String,
      issueDate: { type: Date, default: Date.now },
      verificationCode: String
    }
  }],

  enrolledCourses: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    enrolledAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 }, // Progress percentage
    currentLesson: { type: Number, default: 0 }, // Current lesson index
    timeSpent: { type: Number, default: 0 }, // Time spent in minutes
    lastAccessedAt: { type: Date, default: Date.now }
  }],

  // Wishlist and favorites
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],

  // Learning preferences
  learningStreak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastStudyDate: Date
  },

  // Achievements and badges
  achievements: [{
    id: String,
    name: String,
    description: String,
    earnedAt: { type: Date, default: Date.now },
    badgeUrl: String
  }],

  searchHistory: [{
    query: String,
    timestamp: { type: Date, default: Date.now }
  }],

  // Notification preferences
  notificationSettings: {
    email: {
      courseUpdates: { type: Boolean, default: true },
      recommendations: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true },
      reminders: { type: Boolean, default: true }
    },
    push: {
      courseUpdates: { type: Boolean, default: true },
      recommendations: { type: Boolean, default: false },
      achievements: { type: Boolean, default: true },
      reminders: { type: Boolean, default: true }
    }
  },

  profilePicture: { type: String, default: '' },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'pending'],
    default: 'active'
  },

  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: Date.now }
});

// Course Schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: { type: String, maxlength: 200 },
  instructor: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: String,
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  duration: { type: Number, required: true }, // Duration in hours
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  enrolledStudents: { type: Number, default: 0 },
  languages: [String], // Programming languages covered in course
  prerequisites: [String],
  tags: [String],
  thumbnail: String,
  promoVideoUrl: String,

  // Course content structure
  modules: [{
    title: String,
    description: String,
    order: Number,
    lessons: [{
      title: String,
      description: String,
      videoUrl: String,
      duration: Number, // Duration in seconds
      order: Number,
      resources: [{
        title: String,
        type: { type: String, enum: ['pdf', 'link', 'document', 'code'] },
        url: String,
        downloadable: { type: Boolean, default: true }
      }],
      quiz: {
        questions: [{
          question: String,
          type: { type: String, enum: ['multiple-choice', 'true-false', 'fill-blank'] },
          options: [String],
          correctAnswer: String,
          explanation: String
        }],
        passingScore: { type: Number, default: 80 }
      }
    }],
    assignment: {
      title: String,
      description: String,
      instructions: String,
      dueDate: Date,
      maxScore: { type: Number, default: 100 },
      submissions: [{
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        submittedAt: { type: Date, default: Date.now },
        fileUrl: String,
        textSubmission: String,
        score: Number,
        feedback: String,
        graded: { type: Boolean, default: false }
      }]
    }
  }],

  // Course features
  features: {
    hasQuizzes: { type: Boolean, default: false },
    hasAssignments: { type: Boolean, default: false },
    hasCertificate: { type: Boolean, default: true },
    allowDownloads: { type: Boolean, default: true },
    offlineAccess: { type: Boolean, default: false }
  },

  // Course status and visibility
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: Date,

  // Learning outcomes
  learningOutcomes: [String],

  // Course requirements
  requirements: {
    systemRequirements: [String],
    softwareRequired: [String],
    experience: String
  },

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

// Discussion Forum Schema
const discussionSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lessonId: String, // Optional - for lesson-specific discussions
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [String],
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  replies: [{
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isInstructorReply: { type: Boolean, default: false },
    isBestAnswer: { type: Boolean, default: false }
  }],
  isResolved: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['course_update', 'new_reply', 'achievement', 'reminder', 'assignment_due', 'certificate_ready'],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedId: String, // Course ID, Discussion ID, etc.
  relatedType: {
    type: String,
    enum: ['course', 'discussion', 'assignment', 'achievement']
  },
  isRead: { type: Boolean, default: false },
  actionUrl: String,
  createdAt: { type: Date, default: Date.now }
});

// Learning Progress Schema
const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  moduleId: String,
  lessonId: String,
  videoProgress: { type: Number, default: 0 }, // Seconds watched
  completed: { type: Boolean, default: false },
  quizScores: [{
    lessonId: String,
    score: Number,
    totalQuestions: Number,
    attemptedAt: { type: Date, default: Date.now }
  }],
  assignmentSubmissions: [{
    moduleId: String,
    submissionId: String,
    score: Number,
    submittedAt: { type: Date, default: Date.now }
  }],
  timeSpent: { type: Number, default: 0 }, // Total time in seconds
  lastAccessedAt: { type: Date, default: Date.now }
});

// Profile Routes
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('enrolledCourses.courseId')
      .populate('completedCourses.courseId')
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Certificate Routes
app.get('/api/certificate/:certificateId', authenticateToken, async (req, res) => {
  try {
    const { certificateId } = req.params;
    const completion = await User.findOne({
      'completedCourses.certificate.id': certificateId
    });

    if (!completion) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    // Generate and send certificate
    // ... certificate generation logic ...
    
    res.json({ certificate: completion.certificate });
  } catch (error) {
    console.error('Certificate fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Certificate Schema
const certificateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  certificateId: { type: String, unique: true, required: true },
  verificationCode: { type: String, unique: true, required: true },
  studentName: { type: String, required: true },
  courseName: { type: String, required: true },
  instructorName: { type: String, required: true },
  completionDate: { type: Date, required: true },
  finalScore: Number,
  certificateUrl: String,
  isValid: { type: Boolean, default: true },
  issuedAt: { type: Date, default: Date.now }
});

// Achievement Schema
const achievementSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  category: {
    type: String,
    enum: ['completion', 'streak', 'participation', 'excellence', 'milestone'],
    required: true
  },
  criteria: {
    type: String,
    required: true
  },
  points: { type: Number, default: 0 },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);
const SearchLog = mongoose.model('SearchLog', searchLogSchema);
const Discussion = mongoose.model('Discussion', discussionSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const Progress = mongoose.model('Progress', progressSchema);
const Certificate = mongoose.model('Certificate', certificateSchema);
const Achievement = mongoose.model('Achievement', achievementSchema);

// Certificate Generation Function
const generateCertificate = (studentName, courseName, completionDate, certificateId, instructor) => {
  const canvas = createCanvas(1200, 800);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 1200, 800);
  gradient.addColorStop(0, '#f8f9fa');
  gradient.addColorStop(1, '#e9ecef');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 800);

  // Border
  ctx.strokeStyle = '#4f46e5';
  ctx.lineWidth = 8;
  ctx.strokeRect(40, 40, 1120, 720);

  // Inner border
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 60, 1080, 680);

  // Header
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('CERTIFICATE OF COMPLETION', 600, 150);

  // Decorative line
  ctx.strokeStyle = '#4f46e5';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(300, 180);
  ctx.lineTo(900, 180);
  ctx.stroke();

  // This certifies that
  ctx.fillStyle = '#4b5563';
  ctx.font = '24px Arial';
  ctx.fillText('This certifies that', 600, 240);

  // Student name
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 42px Arial';
  ctx.fillText(studentName, 600, 300);

  // Has successfully completed
  ctx.fillStyle = '#4b5563';
  ctx.font = '24px Arial';
  ctx.fillText('has successfully completed the course', 600, 360);

  // Course name
  ctx.fillStyle = '#4f46e5';
  ctx.font = 'bold 36px Arial';
  ctx.fillText(courseName, 600, 420);

  // Completion date
  ctx.fillStyle = '#4b5563';
  ctx.font = '20px Arial';
  const formattedDate = new Date(completionDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  ctx.fillText(`Completed on: ${formattedDate}`, 600, 480);

  // Instructor info
  ctx.fillStyle = '#1f2937';
  ctx.font = '18px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Instructor:', 200, 580);
  ctx.font = 'bold 18px Arial';
  ctx.fillText(instructor, 200, 610);

  // Certificate ID
  ctx.textAlign = 'right';
  ctx.font = '16px Arial';
  ctx.fillStyle = '#6b7280';
  ctx.fillText(`Certificate ID: ${certificateId}`, 1000, 580);

  // Logo/seal placeholder (you can add actual logo here)
  ctx.beginPath();
  ctx.arc(600, 650, 40, 0, Math.PI * 2);
  ctx.fillStyle = '#4f46e5';
  ctx.fill();
  ctx.fillStyle = 'white';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('✓', 600, 660);

  // Signature line
  ctx.strokeStyle = '#9ca3af';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(750, 610);
  ctx.lineTo(950, 610);
  ctx.stroke();

  ctx.fillStyle = '#4b5563';
  ctx.font = '14px Arial';
  ctx.fillText('Digital Signature', 850, 630);

  return canvas.toBuffer('image/png');
};

// Routes

// Placeholder Image Generator
app.get('/api/placeholder/:width/:height', (req, res) => {
  try {
    const width = parseInt(req.params.width) || 300;
    const height = parseInt(req.params.height) || 200;

    // Limit image size for security
    const maxSize = 2000;
    const finalWidth = Math.min(width, maxSize);
    const finalHeight = Math.min(height, maxSize);

    // Create canvas
    const canvas = createCanvas(finalWidth, finalHeight);
    const ctx = canvas.getContext('2d');

    // Generate a pleasant color based on dimensions
    const hue = (finalWidth + finalHeight) % 360;
    const lightness = 85;
    const saturation = 30;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, finalWidth, finalHeight);
    gradient.addColorStop(0, `hsl(${hue}, ${saturation}%, ${lightness}%)`);
    gradient.addColorStop(1, `hsl(${(hue + 30) % 360}, ${saturation}%, ${lightness - 10}%)`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, finalWidth, finalHeight);

    // Add border
    ctx.strokeStyle = `hsl(${hue}, ${saturation + 20}%, ${lightness - 30}%)`;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, finalWidth - 2, finalHeight - 2);

    // Add text
    ctx.fillStyle = `hsl(${hue}, ${saturation + 20}%, ${lightness - 40}%)`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Responsive font size
    const fontSize = Math.max(12, Math.min(finalWidth, finalHeight) * 0.08);
    ctx.font = `${fontSize}px Arial, sans-serif`;

    const text = `${finalWidth} × ${finalHeight}`;
    ctx.fillText(text, finalWidth / 2, finalHeight / 2);

    // Add small course placeholder icon (simple rectangle)
    const iconSize = Math.min(finalWidth, finalHeight) * 0.15;
    const iconX = (finalWidth - iconSize) / 2;
    const iconY = (finalHeight - iconSize) / 2 - fontSize;

    ctx.fillStyle = `hsl(${hue}, ${saturation + 30}%, ${lightness - 20}%)`;
    ctx.fillRect(iconX, iconY, iconSize, iconSize * 0.7);

    // Set response headers
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

    // Send image
    canvas.createPNGStream().pipe(res);

  } catch (error) {
    console.error('Error generating placeholder:', error);
    res.status(500).json({ error: 'Failed to generate placeholder image' });
  }
});

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, phone, password, bio, interests, knownLanguages } = req.body;

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
      phone: phone || '',
      password: hashedPassword,
      bio: bio || '',
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
    
    // Generate certificate ID
    const certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    user.completedCourses.push({
      courseId: courseId,
      completedAt: new Date(),
      rating: rating || null,
      certificateId: certificateId
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

    res.json({
      message: 'Course completed successfully',
      certificateId: certificateId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Course Recommendations
app.get('/api/recommendations', async (req, res) => {
  try {
    // Check if user is authenticated
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    let user = null;
    let excludeIds = [];

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        user = await User.findById(decoded.userId)
          .populate('completedCourses.courseId')
          .populate('enrolledCourses.courseId');

        if (user) {
          // Get all courses user hasn't completed or enrolled in
          const completedCourseIds = user.completedCourses.map(c => c.courseId._id);
          const enrolledCourseIds = user.enrolledCourses.map(c => c.courseId._id);
          excludeIds = [...completedCourseIds, ...enrolledCourseIds];
        }
      } catch (err) {
        // Invalid token, treat as non-authenticated user
        user = null;
      }
    }

    let recommendedCourses = [];

    if (user) {
      // Personalized recommendations for authenticated users

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
    }

    // General popular courses (for non-authenticated users or as fallback)
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

// Add to Wishlist
app.post('/api/wishlist/:courseId', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Add to wishlist if not already there
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: courseId } },
      { new: true }
    );

    res.json({ message: 'Course added to wishlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove from Wishlist
app.delete('/api/wishlist/:courseId', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: courseId } },
      { new: true }
    );

    res.json({ message: 'Course removed from wishlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Wishlist
app.get('/api/wishlist', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate('wishlist');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to Favorites
app.post('/api/favorites/:courseId', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Add to favorites if not already there
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: courseId } },
      { new: true }
    );

    res.json({ message: 'Course added to favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove from Favorites
app.delete('/api/favorites/:courseId', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: courseId } },
      { new: true }
    );

    res.json({ message: 'Course removed from favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Favorites
app.get('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate('favorites');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.favorites);
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
        shortDescription: "Learn JavaScript from scratch with hands-on projects and real-world examples.",
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
        thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500&h=300&fit=crop&crop=entropy&cs=tinysrgb",
        promoVideoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        status: "published",
        publishedAt: new Date(),
        learningOutcomes: [
          "Master JavaScript fundamentals and ES6+ features",
          "Build interactive web applications",
          "Understand asynchronous programming concepts",
          "Work with APIs and handle data effectively"
        ],
        requirements: {
          systemRequirements: ["Modern web browser", "Text editor or IDE"],
          softwareRequired: ["VS Code (recommended)", "Node.js"],
          experience: "No prior programming experience required"
        },
        features: {
          hasQuizzes: true,
          hasAssignments: true,
          hasCertificate: true,
          allowDownloads: true,
          offlineAccess: false
        },
        modules: [
          {
            title: "JavaScript Fundamentals",
            description: "Learn the core concepts of JavaScript programming",
            order: 1,
            lessons: [
              {
                title: "Introduction to JavaScript",
                description: "What is JavaScript and why learn it?",
                videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
                duration: 600, // 10 minutes
                order: 1,
                resources: [
                  {
                    title: "JavaScript Cheat Sheet",
                    type: "pdf",
                    url: "https://example.com/js-cheatsheet.pdf",
                    downloadable: true
                  }
                ],
                quiz: {
                  questions: [
                    {
                      question: "What is JavaScript primarily used for?",
                      type: "multiple-choice",
                      options: ["Styling websites", "Web development", "Database management", "Graphics design"],
                      correctAnswer: "Web development",
                      explanation: "JavaScript is primarily used for web development to create interactive web pages."
                    }
                  ],
                  passingScore: 80
                }
              },
              {
                title: "Variables and Data Types",
                description: "Understanding variables, numbers, strings, and booleans",
                videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
                duration: 900, // 15 minutes
                order: 2,
                resources: [
                  {
                    title: "Variable Examples",
                    type: "code",
                    url: "https://codepen.io/example/variables",
                    downloadable: false
                  }
                ]
              }
            ],
            assignment: {
              title: "Build a Calculator",
              description: "Create a simple calculator using JavaScript variables and functions",
              instructions: "Build a calculator that can perform basic arithmetic operations (+, -, *, /)",
              maxScore: 100
            }
          },
          {
            title: "DOM Manipulation",
            description: "Learn to interact with HTML elements using JavaScript",
            order: 2,
            lessons: [
              {
                title: "Selecting Elements",
                description: "How to find and select HTML elements",
                videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_3mb.mp4",
                duration: 720, // 12 minutes
                order: 1,
                quiz: {
                  questions: [
                    {
                      question: "Which method is used to select an element by its ID?",
                      type: "multiple-choice",
                      options: ["getElementsByClass", "getElementById", "querySelector", "selectById"],
                      correctAnswer: "getElementById",
                      explanation: "getElementById() is the method used to select an element by its ID attribute."
                    }
                  ],
                  passingScore: 80
                }
              }
            ]
          }
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
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&h=300&fit=crop&crop=entropy&cs=tinysrgb",
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
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop&crop=entropy&cs=tinysrgb",
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
        thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop&crop=entropy&cs=tinysrgb",
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
        thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop&crop=entropy&cs=tinysrgb",
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

// Download Certificate
app.get('/api/certificate/:certificateId', authenticateToken, async (req, res) => {
  try {
    const { certificateId } = req.params;
    const userId = req.user.userId;

    // Find user and the specific completion record
    const user = await User.findById(userId).populate('completedCourses.courseId');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the completion record with this certificate ID
    const completion = user.completedCourses.find(c => c.certificateId === certificateId);

    if (!completion) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    // Generate certificate
    const certificateBuffer = generateCertificate(
      user.username,
      completion.courseId.title,
      completion.completedAt,
      certificateId,
      completion.courseId.instructor
    );

    // Set headers for download
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${certificateId}.png"`);
    res.setHeader('Content-Length', certificateBuffer.length);

    res.send(certificateBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Certificates
app.get('/api/certificates', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate('completedCourses.courseId');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const certificates = user.completedCourses
      .filter(completion => completion.courseId) // Filter out null course references
      .map(completion => ({
        certificateId: completion.certificateId,
        courseName: completion.courseId.title || 'Unknown Course',
        instructor: completion.courseId.instructor || 'Unknown Instructor',
        completedAt: completion.completedAt,
        rating: completion.rating
      }));

    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});