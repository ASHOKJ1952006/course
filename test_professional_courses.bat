@echo off
echo ========================================
echo   PROFESSIONAL COURSE CATALOG TEST
echo ========================================
echo.

echo 🚀 Testing Professional Course Display...
echo.

echo Step 1: Replacing CourseList with professional version...
cd frontend\src\components
copy CourseList_New.js CourseList.js
echo ✅ Professional CourseList activated
echo.

echo Step 2: Starting backend server...
cd ..\..\..\backend
start "Course Backend" cmd /k "echo 🔧 Backend Starting... && npm start"
echo ⏳ Waiting for backend...
timeout /t 3 /nobreak >nul

echo Step 3: Adding sample data...
cd ..
node setup_data.js
echo.

echo Step 4: Starting frontend...
cd frontend
start "Course Frontend" cmd /k "echo 🌐 Frontend Starting... && npm start"
echo.

echo ========================================
echo   🎓 PROFESSIONAL COURSE CATALOG READY!
echo ========================================
echo.
echo 🌐 Open: http://localhost:3000
echo 📚 Navigate to: Browse Courses
echo.
echo ✨ NEW PROFESSIONAL FEATURES:
echo • 🎨 Modern glassmorphism design
echo • 🔍 Advanced search with voice & AI
echo • 🔧 Smart filtering system
echo • ⚖️ Course comparison (up to 3)
echo • ❤️ Wishlist functionality
echo • 👁️ Quick preview modals
echo • 📊 Multiple view modes (grid/list/compact)
echo • 🏷️ Dynamic sorting options
echo • 💰 Price range sliders
echo • ⭐ Rating filters
echo • 🎯 Interactive hover effects
echo • 📱 Fully responsive design
echo.
echo 🎉 Experience the future of course browsing!
echo.
pause
