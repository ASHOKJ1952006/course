@echo off
echo ========================================
echo   Course Recommendation Backend Startup
echo ========================================
echo.

echo Step 1: Installing dependencies...
npm install
echo.

echo Step 2: Starting simplified backend server...
echo.
echo Backend will run on: http://localhost:5001
echo Test endpoint: http://localhost:5001/api/test
echo.
echo If you see errors about MongoDB, that's OK - the server will still work!
echo.

npm start

pause
