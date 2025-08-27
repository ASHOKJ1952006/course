# Course Recommendation System

A full-stack e-learning platform with intelligent course recommendations based on user interests, search history, completed courses, and known programming languages.

## 🚀 Features

### Core Features
- **User Authentication** - Registration and login with JWT tokens
- **Course Catalog** - Browse courses with advanced filtering and search
- **Intelligent Recommendations** - AI-powered course suggestions
- **Course Enrollment** - Enroll in courses and track progress
- **User Profiles** - Manage interests, skills, and learning preferences
- **Progress Tracking** - Monitor course completion and learning statistics

### Recommendation Algorithm
The system uses multiple recommendation strategies:

1. **Content-Based Filtering**
   - Matches courses to user interests
   - Considers known programming languages
   - Analyzes course categories and tags

2. **Search-Based Recommendations**
   - Uses search history to suggest relevant courses
   - Tracks user behavior patterns

3. **Collaborative Filtering**
   - Finds users with similar interests
   - Recommends courses completed by similar users

4. **Popularity-Based**
   - Suggests highly-rated and popular courses
   - Fallback for new users with limited data

## 🛠️ Technology Stack

### Frontend
- **React.js** - Component-based UI library
- **Plain CSS** - Custom styling with responsive design
- **Fetch API** - HTTP client for API communication

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
course-recommendation-system/
├── backend/
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   └── README.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Header.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── CourseList.js
│   │   │   ├── CourseDetail.js
│   │   │   ├── Recommendations.js
│   │   │   ├── Profile.js
│   │   │   └── LoadingSpinner.js
│   │   ├── services/
│   │   │   └── api.js         # API service functions
│   │   ├── App.js             # Main App component
│   │   ├── App.css            # Comprehensive styling
│   │   └── index.js           # Entry point
│   ├── package.json           # Frontend dependencies
│   └── README.md
└── README.md                  # Main project documentation
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup MongoDB:**
   - **Option 1: Local MongoDB**
     - Install MongoDB locally
     - Start MongoDB service
     - Database will be created automatically as `course_recommendation`

   - **Option 2: MongoDB Atlas**
     - Create a MongoDB Atlas account
     - Create a cluster and get connection string
     - Update the connection string in `server.js`:
     ```javascript
     mongoose.connect('your-mongodb-atlas-connection-string', {
       useNewUrlParser: true,
       useUnifiedTopology: true
     });
     ```

4. **Configure environment variables:**
   ```bash
   # Create .env file (optional)
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   MONGODB_URI=mongodb://localhost:27017/course_recommendation
   PORT=5000
   ```

5. **Start the backend server:**
   ```bash
   npm start
   # or for development with auto-restart:
   npm run dev
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   Application will open at `http://localhost:3000`

## 🎯 Getting Started

### 1. Initial Setup
1. Start both backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Click "Add Sample Data" on the dashboard to populate the database with sample courses

### 2. Create an Account
1. Click "Sign up here" on the login page
2. Fill in your details, interests, and known programming languages
3. These preferences will be used for personalized recommendations

### 3. Explore Features
- **Browse Courses**: Use filters, search, and pagination
- **Get Recommendations**: View personalized course suggestions
- **Enroll in Courses**: Track your learning progress
- **Complete Courses**: Rate courses and build your learning history
- **Update Profile**: Modify interests and skills for better recommendations

## 📊 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### User Management
- `GET /api/profile` - Get user profile (authenticated)
- `PUT /api/profile` - Update user profile (authenticated)

### Courses
- `GET /api/courses` - Get courses with filtering and pagination
- `GET /api/courses/:id` - Get specific course details
- `POST /api/courses/:id/enroll` - Enroll in course (authenticated)
- `POST /api/courses/:id/complete` - Complete course (authenticated)

### Recommendations
- `GET /api/recommendations` - Get personalized recommendations (authenticated)

### Utility
- `GET /api/categories` - Get all course categories
- `POST /api/seed-data` - Add sample data (development)

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication:
- Tokens are stored in localStorage
- Protected routes require valid JWT tokens
- Tokens include user ID for database queries

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)  
- Mobile phones (320px - 767px)

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Smooth Animations**: Hover effects and transitions
- **Loading States**: Spinners and loading indicators
- **Error Handling**: User-friendly error messages
- **Notifications**: Success/error notification system
- **Accessibility**: Keyboard navigation and focus states

## 🤖 Recommendation Engine

### Algorithm Components

1. **Interest Matching**
   - Matches course categories with user interests
   - Weighted scoring based on preference strength

2. **Language Compatibility**
   - Prioritizes courses using known programming languages
   - Helps users build on existing skills

3. **Search Pattern Analysis**
   - Analyzes recent search queries
   - Suggests courses matching search intent

4. **Social Filtering**
   - Finds users with similar profiles
   - Recommends their completed courses

5. **Quality Filtering**
   - Considers course ratings and popularity
   - Ensures high-quality recommendations

## 🚀 Future Enhancements

### Planned Features
- **Video Streaming**: Integrated video player for course content
- **Discussion Forums**: Community features for learners
- **Certificates**: Digital certificates for course completion
- **Mobile App**: Native mobile applications
- **Advanced Analytics**: Detailed learning analytics dashboard
- **AI Chatbot**: Course recommendation chatbot
- **Social Features**: Friend system and shared learning paths

### Technical Improvements
- **Caching**: Redis for improved performance
- **Search Engine**: Elasticsearch for advanced search
- **File Upload**: Course material upload functionality
- **Payment Integration**: Stripe/PayPal for course purchases
- **Email Service**: Automated email notifications
- **Testing**: Comprehensive unit and integration tests

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Error**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:27017
   ```
   **Solution**: Ensure MongoDB is running locally or check Atlas connection string

2. **CORS Issues**
   ```
   Access to fetch blocked by CORS policy
   ```
   **Solution**: Verify backend server is running on port 5000

3. **JWT Token Errors**
   ```
   Error: Invalid token
   ```
   **Solution**: Clear localStorage and login again

4. **Port Already in Use**
   ```
   Error: listen EADDRINUSE :::3000
   ```
   **Solution**: Kill existing processes or use different port

### Debug Tips
- Check browser console for frontend errors
- Monitor backend logs for server errors
- Verify MongoDB connection status
- Ensure all environment variables are set correctly

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

Created by [Your Name] as a comprehensive course recommendation system demonstration.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Follow existing code style and patterns
2. Add comments for complex logic
3. Test new features thoroughly
4. Update documentation as needed

---

**Happy Learning! 📚✨**