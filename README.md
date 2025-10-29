# RouteWise

A mobile application for route planning and navigation, built with React Native and Python FastAPI.

## ⚠️ Seeing TypeScript Errors? READ THIS! ⚠️

**The errors you see are NORMAL and EXPECTED!** They will **automatically disappear** after running:

```cmd
cd mobile
npm install
```

## � Documentation

| Document | Purpose | Read When |
|----------|---------|-----------|
| 🚀 **[START HERE](START_HERE.md)** | Complete overview & quick start | **First time!** |
| ❓ **[ERRORS EXPLAINED](ERRORS_EXPLAINED.md)** | Why you see TypeScript errors | Seeing errors |
| � **[INSTALLATION](INSTALLATION.md)** | Step-by-step setup (30 min) | Installing |
| 🔧 **[SETUP GUIDE](SETUP_GUIDE.md)** | Detailed configuration | Need details |
| 📋 **[CHECKLIST](CHECKLIST.md)** | Task checklist | Track progress |
| 🏗️ **[ARCHITECTURE](ARCHITECTURE.md)** | System design & flow diagrams | Understanding system |
| 🐛 **[TROUBLESHOOTING](TROUBLESHOOTING.md)** | Fix common issues | Having problems |

## Features

✅ **User Authentication**
- Username/Password registration with real-time validation
- Email verification with 6-digit code
- JWT-based authentication
- Google OAuth integration
- Facebook OAuth integration
- Secure password requirements

✅ **Password Security**
- Minimum 8 characters, maximum 128
- Real-time validation feedback
- Must include: uppercase, lowercase, numbers, special characters

✅ **Technology Stack**
- **Frontend**: React Native + TypeScript + Expo
- **Backend**: Python FastAPI + PostgreSQL + Redis
- **Authentication**: JWT tokens with refresh
- **Email**: SMTP for verification codes

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL
- Redis
- Android Studio (for Android development)

### 1. Backend Setup

```bash
# Start backend server (Windows)
start-backend.bat

# Or manually:
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
# Configure .env file (copy from .env.example)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Mobile App Setup

```bash
# Start mobile app (Windows)
start-mobile.bat

# Or manually:
cd mobile
npm install
npm start
```

### 3. Build EAS Development Client (First Time Only)

```bash
cd mobile
npm install -g eas-cli
eas login
eas build --profile development --platform android
```

## Documentation

📖 **[Complete Setup Guide](SETUP_GUIDE.md)** - Detailed instructions for:
- Environment configuration
- Database setup
- OAuth integration (Google & Facebook)
- EAS Development Build
- Troubleshooting

## Project Structure

```
RouteWise-2/
├── mobile/                  # React Native app
│   ├── src/
│   │   ├── screens/        # UI screens
│   │   ├── services/       # API services
│   │   ├── utils/          # Utilities
│   │   ├── types/          # TypeScript types
│   │   └── navigation/     # Navigation
│   ├── app.json
│   ├── eas.json
│   └── package.json
│
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── routes/         # API endpoints
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── utils/          # Utilities
│   │   └── main.py         # FastAPI app
│   └── requirements.txt
│
├── SETUP_GUIDE.md          # Detailed setup instructions
├── start-backend.bat       # Backend startup script
└── start-mobile.bat        # Mobile app startup script
```

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/send-verification` - Resend code
- `POST /api/auth/social` - Google/Facebook login
- `POST /api/auth/refresh` - Refresh token
- `GET /docs` - Interactive API documentation

## Development

### Backend
- API runs on: `http://localhost:8000`
- Docs available at: `http://localhost:8000/docs`

### Mobile
- For Android Emulator: Use `10.0.2.2:8000` as API URL
- For Physical Device: Use your computer's IP address

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/routewise
SECRET_KEY=your-secret-key
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
GOOGLE_CLIENT_ID=your-google-client-id
FACEBOOK_APP_ID=your-facebook-app-id
# See .env.example for all options
```

### Mobile (src/config/api.ts)
```typescript
export const API_BASE_URL = 'http://10.0.2.2:8000/api';
```

## Testing

### Test Registration Flow
1. Open mobile app
2. Tap "Sign Up"
3. Fill in details with password validation
4. Check email for verification code
5. Complete verification

### Test Login Flow
1. Enter username and password
2. Tap "Sign In"
3. Successfully authenticated

## Next Steps

- [ ] Add home screen
- [ ] Implement route planning
- [ ] Add map integration
- [ ] Build iOS version
- [ ] Add user profile management

## License

MIT License - See LICENSE file for details

## Support

For issues or questions, refer to the [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed troubleshooting.
