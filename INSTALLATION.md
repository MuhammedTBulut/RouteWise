# Quick Installation & Testing Guide

## Understanding the TypeScript Errors

The TypeScript errors you're seeing are **EXPECTED** and will be automatically resolved when you run `npm install`. These errors occur because:

1. ✅ The code is correct
2. ❌ The dependencies haven't been installed yet
3. ✅ TypeScript can't find the type definitions for `react`, `react-native`, etc.

**Solution:** Simply run the installation steps below.

## Step-by-Step Installation

### 1. Install Backend Dependencies (2 minutes)

Open a terminal in the project root:

```cmd
cd c:\Users\furka\RouteWise-2\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Install Mobile Dependencies (5 minutes)

Open another terminal:

```cmd
cd c:\Users\furka\RouteWise-2\mobile
npm install
```

**After `npm install` completes, all TypeScript errors will disappear! ✓**

### 3. Set Up PostgreSQL

**Option A - Using Docker (Easiest):**
```cmd
docker run -d --name routewise-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=user -e POSTGRES_DB=routewise -p 5432:5432 postgres:15
```

**Option B - Manual Installation:**
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Install and remember your password
3. Create database:
   ```cmd
   psql -U postgres
   CREATE DATABASE routewise;
   \q
   ```

### 4. Set Up Redis

**Option A - Using Docker (Easiest):**
```cmd
docker run -d --name routewise-redis -p 6379:6379 redis:7
```

**Option B - Manual Installation:**
1. Download from https://github.com/microsoftarchive/redis/releases
2. Install and run Redis server

### 5. Configure Backend Environment

```cmd
cd c:\Users\furka\RouteWise-2\backend
copy .env.example .env
notepad .env
```

**Minimal Configuration for Testing:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/routewise

# Generate a secret key:
# python -c "import secrets; print(secrets.token_hex(32))"
SECRET_KEY=your-generated-secret-key-here

# For Gmail (get App Password from: https://myaccount.google.com/apppasswords)
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password

# Rest can use defaults
```

### 6. Test Backend

```cmd
cd c:\Users\furka\RouteWise-2\backend
venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

✅ **Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

Test it: Open browser → http://localhost:8000/docs

### 7. Configure Mobile API Endpoint

Edit `mobile\src\config\api.ts`:

For Android Emulator:
```typescript
export const API_BASE_URL = 'http://10.0.2.2:8000/api';
```

For Physical Device (find your IP with `ipconfig`):
```typescript
export const API_BASE_URL = 'http://192.168.1.XXX:8000/api';
```

### 8. Build EAS Development Client

```cmd
cd c:\Users\furka\RouteWise-2\mobile
npm install -g eas-cli
eas login
eas build:configure
eas build --profile development --platform android
```

⏱️ This takes **10-15 minutes** the first time.

Download and install the APK on your Android device/emulator when done.

### 9. Start Mobile App

```cmd
cd c:\Users\furka\RouteWise-2\mobile
npm start
```

Press `a` to open on Android with your EAS development build installed.

## Testing the Complete Flow

### Test 1: Registration with Real-Time Validation ✓

1. Open app → Tap "Sign Up"
2. Start typing a password
3. **Watch the magic:** Each requirement turns green in real-time!
   - Type "abc" → See minimum length checker
   - Type "Abc1" → See uppercase, lowercase, number checkers turn green
   - Type "Abc1!" → See special character checker turn green
4. Complete registration

### Test 2: Email Verification ✓

1. Check your email inbox
2. Find the 6-digit code
3. Enter it in the verification screen
4. ✅ Email verified!

### Test 3: Login ✓

1. Go back to login screen
2. Enter your username and password
3. Tap "Sign In"
4. ✅ Logged in successfully!

## Troubleshooting Common Issues

### TypeScript Errors Still Show After `npm install`?

```cmd
cd mobile
# Close VS Code
rm -rf node_modules
npm install
# Reopen VS Code
```

### "Cannot connect to backend"

- ✅ Backend running? Check http://localhost:8000
- ✅ Using correct URL? 
  - Emulator: `10.0.2.2:8000`
  - Device: Your computer's IP address
- ✅ Firewall blocking? Allow port 8000

### "Database connection failed"

```cmd
# Test PostgreSQL connection
psql -U user -d routewise -h localhost
# If fails, check DATABASE_URL in .env
```

### "Redis connection failed"

```cmd
# Test Redis
redis-cli ping
# Should return: PONG
# If not, start Redis or Docker container
```

### "Email not sending"

- ✅ Using Gmail App Password (not regular password)?
- ✅ 2FA enabled on Google account?
- ✅ Check spam folder
- ✅ Verify SMTP settings in .env

## Quick Commands Reference

### Start Everything

**Terminal 1 - Backend:**
```cmd
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Mobile:**
```cmd
cd mobile
npm start
```

### Or Use Batch Files:

```cmd
# Start backend
start-backend.bat

# Start mobile (in another terminal)
start-mobile.bat
```

## Verifying Installation Success

### ✅ Backend Working:
- [ ] http://localhost:8000 shows welcome message
- [ ] http://localhost:8000/docs shows API documentation
- [ ] No errors in terminal

### ✅ Mobile Working:
- [ ] `npm install` completed without errors
- [ ] All TypeScript errors disappeared
- [ ] EAS build completed successfully
- [ ] App opens on device/emulator

### ✅ Full Stack Working:
- [ ] Can register a new user
- [ ] Receive verification email
- [ ] Can verify email with code
- [ ] Can login with credentials
- [ ] Password validation shows in real-time

## Next Steps After Installation

Once everything is working:

1. **Try Social Auth:**
   - Follow Google OAuth setup in SETUP_GUIDE.md
   - Follow Facebook OAuth setup in SETUP_GUIDE.md

2. **Customize:**
   - Change app colors in screen styles
   - Add your app logo
   - Modify password requirements if needed

3. **Build Your Features:**
   - Add home screen
   - Implement route planning
   - Add map integration

## Need Help?

1. Check error messages carefully
2. Review SETUP_GUIDE.md for detailed explanations
3. Test API endpoints at http://localhost:8000/docs
4. Verify backend logs for errors
5. Check mobile Metro bundler logs

## Success Indicators

When everything is working correctly:

✅ No TypeScript errors in VS Code  
✅ Backend shows "Application startup complete"  
✅ Mobile app opens without crashes  
✅ Password validation animates in real-time  
✅ Verification emails arrive within seconds  
✅ Login redirects successfully  

Enjoy building RouteWise! 🚀
