@echo off
echo Starting ARIADOS Services...
echo.

set PROJECT_ROOT=%~dp0..

echo Starting Backend (Port 8000)...
start "ARIADOS Backend" cmd /k "cd /d %PROJECT_ROOT%\backend && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
timeout /t 3 >nul

echo Starting ML Service (Port 8001)...
start "ARIADOS ML Service" cmd /k "cd /d %PROJECT_ROOT%\ml_service && uvicorn ml.main:app --host 0.0.0.0 --port 8001"
timeout /t 3 >nul

echo Starting Frontend (Port 5173)...
start "ARIADOS Frontend" cmd /k "cd /d %PROJECT_ROOT%\frontend && npm run dev"
timeout /t 3 >nul

echo.
echo ======================================
echo All services started!
echo.
echo Backend:    http://localhost:8000
echo ML Service: http://localhost:8001
echo Frontend:   http://localhost:5173
echo ======================================
echo.
pause
