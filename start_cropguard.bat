@echo off
echo =========================================
echo Starting CropGuard AI Services...
echo =========================================

echo.
echo [1/3] Starting Python AI Microservice (Port 5001)...
start "CropGuard AI Service (Python)" cmd /k "cd backend\ai_service && title Python AI Service && python app.py"

echo.
echo [2/3] Starting Node.js Backend (Port 5000)...
start "CropGuard Backend (Node.js)" cmd /k "cd backend && title Node.js Backend && node server.js"

echo.
echo [3/3] Starting React Frontend (Vite)...
start "CropGuard Frontend (React)" cmd /k "cd frontend && title React Frontend && npm run dev"

echo.
echo All services have been launched in separate windows!
echo Please wait a moment for all servers to fully initialize.
echo.
pause
