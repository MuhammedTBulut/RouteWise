# RouteWise - Setup Guide

## Project Overview

RouteWise is a mobile application built with React Native (frontend) and Python FastAPI (backend). This guide will help you set up and run the complete authentication system with the following features:

- ✅ Username/Password registration with real-time password validation
- ✅ Email verification with 6-digit code
- ✅ Login with username and password
- ✅ Google OAuth integration
- ✅ Facebook OAuth integration
- ✅ JWT-based authentication with refresh tokens
- ✅ EAS Development Build support (no Expo Go)

## Prerequisites

### For Backend (Python FastAPI)
- Python 3.9 or higher
- PostgreSQL database
- Redis server
- SMTP server (Gmail, SendGrid, etc.) for email verification

### For Mobile (React Native)
- Node.js 18 or higher
- npm or yarn
- Android Studio (for Android development)
- Expo CLI
- EAS CLI

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` and update the following:

```env
# Database - Install PostgreSQL and create a database
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/routewise

# JWT Settings - Generate a secure secret key
SECRET_KEY=your-super-secret-key-here-use-openssl-rand-hex-32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Email Settings - For Gmail:
# 1. Enable 2FA on your Google account
# 2. Generate an App Password: https://myaccount.google.com/apppasswords
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
SMTP_FROM=noreply@routewise.com

# Redis - Install Redis or use Docker: docker run -d -p 6379:6379 redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# Google OAuth
# Get credentials from: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
# Get credentials from: https://developers.facebook.com/
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Other
FRONTEND_URL=http://localhost:8081
ENVIRONMENT=development
```

### 3. Set Up PostgreSQL

**Option A: Install PostgreSQL locally**
- Download from: https://www.postgresql.org/download/
- Create a database: `createdb routewise`

**Option B: Use Docker**
```bash
docker run -d \
  --name routewise-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_USER=user \
  -e POSTGRES_DB=routewise \
  -p 5432:5432 \
  postgres:15
```

### 4. Set Up Redis

**Option A: Install Redis locally**
- Windows: https://github.com/microsoftarchive/redis/releases
- Download and install Redis

**Option B: Use Docker**
```bash
docker run -d --name routewise-redis -p 6379:6379 redis:7
```

### 5. Run the Backend

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Interactive Docs: http://localhost:8000/docs

## Mobile App Setup

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Install EAS CLI

```bash
npm install -g eas-cli
```

### 3. Configure API Endpoint

Edit `mobile/src/config/api.ts`:

```typescript
// For Android Emulator (use 10.0.2.2 instead of localhost)
export const API_BASE_URL = 'http://10.0.2.2:8000/api';

// For physical device, use your computer's IP address
// export const API_BASE_URL = 'http://192.168.1.X:8000/api';
```

### 4. Set Up Google OAuth (Android)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Select "Android"
6. Get your SHA-1 fingerprint:
   ```bash
   cd mobile/android
   # For debug builds:
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
7. Enter package name: `com.routewise.app`
8. Add the SHA-1 fingerprint
9. Download `google-services.json` and place it in `mobile/android/app/`
10. Update `GOOGLE_CLIENT_ID` in backend `.env`

### 5. Set Up Facebook OAuth (Android)

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select existing
3. Add "Facebook Login" product
4. Configure OAuth redirect URIs
5. Get your App ID and App Secret
6. Create `mobile/android/app/res/values/strings.xml`:
   ```xml
   <?xml version="1.0" encoding="utf-8"?>
   <resources>
       <string name="facebook_app_id">YOUR_FACEBOOK_APP_ID</string>
       <string name="fb_login_protocol_scheme">fbYOUR_FACEBOOK_APP_ID</string>
   </resources>
   ```
7. Update `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET` in backend `.env`

### 6. Build and Run with EAS Development Build

#### First Time Setup

```bash
cd mobile

# Login to Expo
eas login

# Configure your project
eas build:configure
```

#### Build Development Client for Android

```bash
# Build for Android (will take 10-15 minutes first time)
eas build --profile development --platform android

# After build completes, download and install the APK on your device/emulator
```

#### Run the App

```bash
# Start the development server
npm start

# The app will connect to your EAS development build
# Press 'a' to open on Android device/emulator with the dev build installed
```

## Testing the Authentication Flow

### 1. Register a New User

1. Open the app
2. Tap "Sign Up"
3. Enter email, username, and password
4. Watch real-time password validation
5. Complete registration

### 2. Verify Email

1. Check your email for verification code
2. Enter the 6-digit code
3. Email verified!

### 3. Login

1. Enter your username and password
2. Tap "Sign In"
3. Successfully logged in!

### 4. Social Login (After OAuth Setup)

1. Tap "Continue with Google" or "Continue with Facebook"
2. Complete OAuth flow
3. Automatically logged in!

## Password Requirements

The app enforces these password requirements in real-time:
- ✅ Minimum 8 characters
- ✅ Maximum 128 characters
- ✅ At least one uppercase letter
- ✅ At least one lowercase letter
- ✅ At least one number
- ✅ At least one special character

## Project Structure

```
RouteWise-2/
├── mobile/                  # React Native app
│   ├── src/
│   │   ├── screens/        # Login, Register, EmailVerification
│   │   ├── services/       # API services
│   │   ├── utils/          # Password validation, storage
│   │   ├── types/          # TypeScript types
│   │   ├── navigation/     # Navigation setup
│   │   └── config/         # API configuration
│   ├── app.json
│   ├── eas.json            # EAS Build configuration
│   └── package.json
│
└── backend/                 # FastAPI backend
    ├── app/
    │   ├── routes/         # API routes
    │   ├── models/         # Database models
    │   ├── schemas/        # Pydantic schemas
    │   ├── utils/          # Security, email, Redis
    │   ├── config.py       # Configuration
    │   ├── database.py     # Database setup
    │   └── main.py         # FastAPI app
    └── requirements.txt
```

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/send-verification` - Send verification code
- `POST /api/auth/verify-email` - Verify email with code
- `POST /api/auth/social` - Google/Facebook login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

## Troubleshooting

### Backend Issues

**Database connection error:**
- Verify PostgreSQL is running
- Check DATABASE_URL in `.env`

**Email not sending:**
- Verify SMTP credentials
- For Gmail, use App Password, not regular password
- Check spam folder

**Redis connection error:**
- Verify Redis is running: `redis-cli ping` should return `PONG`

### Mobile Issues

**"Cannot connect to API":**
- For emulator: Use `10.0.2.2` instead of `localhost`
- For physical device: Use your computer's IP address
- Ensure backend is running and accessible

**Build errors:**
- Clear cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**EAS Build fails:**
- Check `eas build` logs
- Ensure all required files are present
- Verify `app.json` and `eas.json` configuration

## Next Steps

Now that you have authentication working, you can:

1. Add more screens (Home, Profile, etc.)
2. Implement route planning features
3. Add map integration
4. Create user preferences
5. Build the iOS version

## Support

For issues or questions:
- Check the documentation
- Review error logs
- Test API endpoints in http://localhost:8000/docs

Enjoy building with RouteWise! 🚀
