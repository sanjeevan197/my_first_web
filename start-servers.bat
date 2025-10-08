@echo off
echo Starting Nadi Pariksha Servers...

echo.
echo Starting Backend Server...
cd backend
start "Backend Server" cmd /k "node auth-server.js"

echo.
echo Starting Frontend Server...
cd ..
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
pause