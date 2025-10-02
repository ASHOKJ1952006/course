@echo off
echo ========================================
echo   COURSE WEBSITE - COMPLETE SETUP
echo ========================================
echo.

echo Step 1: Installing backend dependencies...
cd backend
call npm install
echo.

echo Step 2: Installing frontend dependencies...
cd ..\frontend
call npm install
echo.

echo Step 3: Starting backend server...
cd ..\backend
start "Backend Server" cmd /k "echo Starting backend... && npm start"
echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Step 4: Adding sample data...
cd ..
node setup_data.js
echo.

echo Step 5: Starting frontend...
cd frontend
start "Frontend App" cmd /k "echo Starting frontend... && npm start"
echo.

echo ========================================
echo   SETUP COMPLETE!
echo ========================================
echo.
echo Backend: http://localhost:5001
echo Frontend: http://localhost:3000
echo.
echo NEXT STEPS:
echo 1. Wait for both servers to fully start
echo 2. Go to http://localhost:3000
echo 3. Register a new account
echo 4. Add interests in your profile
echo 5. Check recommendations!
echo.
pause
