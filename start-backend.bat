@echo off
echo ================================================
echo Starting RouteWise Backend Server
echo ================================================
echo.

cd backend

echo Checking if virtual environment exists...
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Installing/Updating dependencies...
pip install -r requirements.txt

echo.
echo ================================================
echo Starting FastAPI server...
echo API will be available at: http://localhost:8000
echo API Docs will be available at: http://localhost:8000/docs
echo ================================================
echo.

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
