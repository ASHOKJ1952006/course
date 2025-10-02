@echo off
echo ========================================
echo   PROFESSIONAL COURSE WEBSITE STARTUP
echo ========================================
echo.

echo 🚀 Starting Professional EduVerse Platform...
echo.

echo Step 1: Switching to professional version...
cd frontend\src
copy App_Professional.js App.js
echo ✅ Professional app activated
echo.

echo Step 2: Installing dependencies...
cd ..\..
cd backend
call npm install
echo.

cd ..\frontend
call npm install react-router-dom
echo ✅ Dependencies installed
echo.

echo Step 3: Starting backend server...
cd ..\backend
start "EduVerse Backend" cmd /k "echo 🔧 Backend Server Starting... && npm start"
echo ⏳ Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo Step 4: Adding sample data...
cd ..
node setup_data.js
echo.

echo Step 5: Starting frontend...
cd frontend
start "EduVerse Frontend" cmd /k "echo 🌐 Frontend Starting... && npm start"
echo.

echo ========================================
echo   🎓 EDUVERSE PROFESSIONAL LAUNCHED!
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:5001
echo.
echo ✨ PROFESSIONAL FEATURES INCLUDED:
echo • 🤖 AI-Powered Recommendations
echo • 🥽 Virtual Reality Classrooms  
echo • 🔗 Blockchain Certificates
echo • 📊 Advanced Analytics
echo • 💬 AI Learning Assistant
echo • 🎯 Smart Skill Matching
echo • 🌍 Global Expert Network
echo • ⚡ Quantum Computing Ready
echo • 🎨 Creative AI Tools
echo • 📱 Responsive Design
echo.
echo 🎉 Welcome to the future of learning!
echo.
pause
