# 🚀 Quick Start Guide - Course Recommendation Website

## ⚡ Fast Setup (2 Steps)

### Step 1: Start Backend Server
```bash
cd backend
npm install
npm start
```
**Expected Output:** `Server running on port 5001`

### Step 2: Start Frontend Application
```bash
cd frontend
npm install
npm start
```
**Expected Output:** `Compiled successfully! Website opens at http://localhost:3000`

## 🔧 Troubleshooting

### If Frontend Won't Start:
1. **Delete node_modules and reinstall:**
   ```bash
   cd frontend
   rmdir /s node_modules
   npm install
   npm start
   ```

2. **Clear npm cache:**
   ```bash
   npm cache clean --force
   npm install
   ```

### If Backend Won't Start:
1. **Check MongoDB connection**
2. **Ensure port 5001 is available**
3. **Install dependencies:**
   ```bash
   cd backend
   npm install
   npm start
   ```

### If Website Shows Blank Page:
1. **Check browser console (F12) for errors**
2. **Verify backend is running on port 5001**
3. **Clear browser cache (Ctrl+Shift+R)**

## 📋 Current Features Available:

✅ **User Authentication** - Login/Register
✅ **Course Browsing** - View available courses  
✅ **Course Details** - Detailed course information
✅ **User Dashboard** - Personal learning dashboard
✅ **Course Recommendations** - AI-powered suggestions
✅ **User Profile** - Manage personal information
✅ **Course Enrollment** - Enroll in courses
✅ **Progress Tracking** - Track learning progress

## 🌐 Access Points:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001
- **API Documentation:** Check backend/server.js for endpoints

## 🔑 Test Credentials:

You can register a new account or use the registration form to create test users.

## 📞 Need Help?

1. **Check console logs** in browser (F12)
2. **Verify both servers are running**
3. **Ensure ports 3000 and 5001 are available**
4. **Check network connectivity**

---

**Note:** The website has been simplified to ensure core functionality works properly. Advanced features can be added incrementally once the basic system is stable.
