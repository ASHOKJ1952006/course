@echo off
echo Fixing CourseList.js file...

REM Delete the corrupted CourseList.js
del "frontend\src\components\CourseList.js"

REM Copy the fixed version
copy "frontend\src\components\CourseListFixed.js" "frontend\src\components\CourseList.js"

echo CourseList.js has been fixed!
echo You can now run npm start to test the application.

pause
