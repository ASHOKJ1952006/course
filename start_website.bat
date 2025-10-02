@echo off
echo ========================================
echo   Course Recommendation Website Startup
echo ========================================
echo.

echo Step 1: Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm install && npm start"
echo Backend server starting in new window...
echo.

echo Step 2: Starting Frontend Application...
cd ..\frontend
start "Frontend App" cmd /k "npm install && npm start"
echo Frontend application starting in new window...
echo.

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Backend: http://localhost:5001
echo Frontend: http://localhost:3000
echo.
echo Both servers are starting in separate windows.
echo Wait for "Compiled successfully!" message in frontend window.
echo.
pause
