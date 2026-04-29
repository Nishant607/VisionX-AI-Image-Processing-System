@echo off
echo ===================================================
echo Starting VisionX AI System locally...
echo ===================================================

:: Start Backend
echo Starting Django Backend...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
echo Installing requirements...
pip install -r requirements.txt
echo Running migrations...
python manage.py makemigrations processor
python manage.py migrate
echo Starting server...
start "VisionX Backend" cmd /k "venv\Scripts\activate.bat && python manage.py runserver"

:: Start Frontend
echo Starting React Frontend...
cd ../frontend
call npm install
start "VisionX Frontend" cmd /k "npm run dev"

echo ===================================================
echo Environment should be opening in new windows!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo ===================================================
pause
