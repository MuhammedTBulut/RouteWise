@echo off
echo ================================================
echo Starting RouteWise Mobile App
echo ================================================
echo.

cd mobile

echo Installing/Updating dependencies...
call npm install

echo.
echo ================================================
echo Starting Expo Development Server
echo ================================================
echo.
echo IMPORTANT: 
echo 1. Make sure you have built the EAS development client
echo 2. Install it on your Android device/emulator
echo 3. The app will connect to the dev client
echo.
echo To build dev client (first time only):
echo   eas build --profile development --platform android
echo.
echo ================================================

npm start
