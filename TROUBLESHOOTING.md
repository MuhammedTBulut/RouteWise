# Troubleshooting Guide

## Quick Fix Index

| Problem | Quick Fix | Details |
|---------|-----------|---------|
| TypeScript errors | `cd mobile && npm install` | [Link](#typescript-errors) |
| Can't connect to API | Check API URL in `api.ts` | [Link](#api-connection-issues) |
| Database error | Verify PostgreSQL running | [Link](#database-issues) |
| Redis error | Verify Redis running | [Link](#redis-issues) |
| Email not sending | Use App Password | [Link](#email-issues) |
| Build failed | Clear cache & reinstall | [Link](#build-issues) |

---

## TypeScript Errors

### ❌ Problem
```
Cannot find module 'react' or its corresponding type declarations.
Cannot find module 'react-native' or its corresponding type declarations.
Cannot use JSX unless the '--jsx' flag is provided.
```

### ✅ Solution
```cmd
cd c:\Users\furka\RouteWise-2\mobile
npm install
```

### Why This Happens
The npm packages haven't been installed yet. TypeScript can't find the type definitions.

### If Still Having Issues
```cmd
# Delete node_modules and reinstall
cd mobile
rmdir /s /q node_modules
del package-lock.json
npm install

# Restart VS Code
```

---

## API Connection Issues

### ❌ Problem 1: "Network request failed"

**For Android Emulator:**
```typescript
// mobile/src/config/api.ts
export const API_BASE_URL = 'http://10.0.2.2:8000/api';
// NOT localhost! Emulator can't reach localhost
```

**For Physical Android Device:**
```cmd
# Find your computer's IP
ipconfig
# Look for IPv4 Address: 192.168.1.XXX

# Update api.ts
export const API_BASE_URL = 'http://192.168.1.XXX:8000/api';
```

### ❌ Problem 2: "Backend not responding"

**Check if backend is running:**
```cmd
# Open browser
http://localhost:8000

# Should see:
{
  "message": "Welcome to RouteWise API",
  "version": "1.0.0",
  "docs": "/docs"
}
```

**If not running:**
```cmd
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### ❌ Problem 3: CORS Error

**Backend terminal shows:**
```
Access to fetch at 'http://localhost:8000/api/auth/login' blocked by CORS
```

**Check backend/app/main.py:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Should include your mobile URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Database Issues

### ❌ Problem: "Connection to database failed"

**Check if PostgreSQL is running:**

**If using Docker:**
```cmd
docker ps
# Should see routewise-postgres running

# If not:
docker start routewise-postgres

# If doesn't exist:
docker run -d --name routewise-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=user -e POSTGRES_DB=routewise -p 5432:5432 postgres:15
```

**If installed locally:**
```cmd
# Windows Services
services.msc
# Look for "postgresql" - should be Running

# Or test connection
psql -U user -d routewise -h localhost
```

### ❌ Problem: "Database 'routewise' does not exist"

```cmd
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE routewise;

# Grant permissions (if needed)
GRANT ALL PRIVILEGES ON DATABASE routewise TO user;

# Exit
\q
```

### ❌ Problem: Wrong DATABASE_URL

**Check backend/.env:**
```env
# Format: postgresql://username:password@host:port/database
DATABASE_URL=postgresql://user:password@localhost:5432/routewise

# Common mistakes:
# ❌ postgresql://user@localhost/routewise  (missing password/port)
# ❌ postgres://...  (should be postgresql://)
# ❌ localhost:5432  (missing postgresql://)
```

**Test connection:**
```python
# In backend directory
python
>>> from app.database import engine
>>> engine.connect()
# Should not throw error
```

---

## Redis Issues

### ❌ Problem: "Connection to Redis failed"

**Check if Redis is running:**

**If using Docker:**
```cmd
docker ps
# Should see routewise-redis running

# If not:
docker start routewise-redis

# If doesn't exist:
docker run -d --name routewise-redis -p 6379:6379 redis:7
```

**If installed locally:**
```cmd
# Test Redis
redis-cli ping
# Should return: PONG

# If not running:
redis-server
```

### ❌ Problem: "Redis key not found"

This is normal! Verification codes expire after 10 minutes.

```python
# Check what's in Redis
redis-cli
> KEYS verification:*
> GET verification:user@example.com
> TTL verification:user@example.com  # Shows remaining seconds
```

---

## Email Issues

### ❌ Problem: "Email not sending"

**Check SMTP settings in backend/.env:**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password  # NOT regular password!
```

### ❌ Problem: "Authentication failed" with Gmail

**You need an App Password, not your regular Gmail password!**

**Steps:**
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification (if not enabled)
3. Go to https://myaccount.google.com/apppasswords
4. Create new App Password
5. Use this 16-character password in .env

### ❌ Problem: "Email goes to spam"

This is normal for development. Check spam folder!

**For production:**
- Use proper email service (SendGrid, AWS SES, Mailgun)
- Set up SPF/DKIM records
- Use verified domain

### ❌ Problem: Email takes long to arrive

```python
# Check backend logs for errors
# Should see: "Email sent successfully to user@example.com"

# Test SMTP directly
python
>>> import aiosmtplib
>>> import asyncio
>>> from app.config import get_settings
>>> settings = get_settings()
# Test connection...
```

---

## Build Issues

### ❌ Problem: "eas build" fails

**Clear cache and try again:**
```cmd
cd mobile

# Clear Expo cache
npx expo start -c

# Clear npm cache
npm cache clean --force

# Reinstall
rmdir /s /q node_modules
npm install

# Try build again
eas build --profile development --platform android
```

### ❌ Problem: "Build queued forever"

Check EAS dashboard: https://expo.dev/accounts/[your-account]/projects/routewise/builds

**Common issues:**
- EAS servers busy (wait 5-10 minutes)
- Build quota exceeded (check your plan)
- Network issues (retry)

### ❌ Problem: "google-services.json missing"

This is for Google OAuth. If you don't need Google login yet:

**Option 1: Skip for now**
```json
// mobile/app.json - Remove or comment out
"plugins": [
  // ["@react-native-google-signin/google-signin"]
]
```

**Option 2: Add placeholder**
```cmd
# Create dummy file
echo {} > mobile/google-services.json
```

### ❌ Problem: Build succeeds but app crashes on open

**Check logs:**
```cmd
# Android
adb logcat | grep ReactNative

# Look for errors
```

**Common causes:**
- API URL wrong (should be 10.0.2.2 for emulator)
- Missing environment variables
- Package version mismatch

**Fix:**
```cmd
cd mobile
npm install
eas build --profile development --platform android --clear-cache
```

---

## Runtime Issues

### ❌ Problem: "Password validation not working"

**Check that you're typing in the password field:**
```typescript
// RegisterScreen.tsx
const [password, setPassword] = useState('');

useEffect(() => {
  if (password) {
    setPasswordValidation(validatePassword(password));
  }
}, [password]);  // ← Depends on password changes
```

**Check validation logic:**
```typescript
// utils/passwordValidation.ts
export const validatePassword = (password: string): PasswordValidation => {
  return {
    minLength: password.length >= 8,
    maxLength: password.length <= 128,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
};
```

### ❌ Problem: "Login successful but nothing happens"

**Update LoginScreen.tsx:**
```typescript
if (response.success) {
  // Add navigation here when you create home screen
  Alert.alert('Success', 'Logged in successfully!');
  // navigation.navigate('Home');  // Uncomment when Home exists
}
```

### ❌ Problem: "Verification code not received"

**Check backend logs:**
```
INFO: Email sent successfully to user@example.com
```

**If no log:**
- SMTP settings wrong
- Email service blocking
- Network firewall

**Check spam folder!**

**Resend code:**
- Tap "Resend" button
- Or call `/api/auth/send-verification` again

### ❌ Problem: "Invalid verification code"

**Reasons:**
1. Code expired (10 minutes)
2. Wrong code entered
3. Redis not running

**Debug:**
```cmd
redis-cli
> KEYS verification:*
> GET verification:user@example.com
> TTL verification:user@example.com
```

---

## Development Issues

### ❌ Problem: "Metro bundler error"

```cmd
cd mobile

# Clear Metro cache
npx react-native start --reset-cache

# Or
npx expo start -c
```

### ❌ Problem: "Cannot resolve module"

```cmd
cd mobile

# Reinstall dependencies
rmdir /s /q node_modules
npm install

# Restart Metro
npm start
```

### ❌ Problem: VS Code showing errors after npm install

```cmd
# Reload VS Code window
Ctrl+Shift+P → "Reload Window"

# Or restart VS Code completely
```

### ❌ Problem: "Port 8000 already in use"

```cmd
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID)
taskkill /PID [PID] /F

# Or use different port
uvicorn app.main:app --reload --port 8001
```

---

## Testing Issues

### ❌ Problem: "Cannot test API endpoints"

**Use Swagger UI:**
```
http://localhost:8000/docs
```

**Or use curl:**
```cmd
curl -X POST http://localhost:8000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"username\":\"testuser\",\"password\":\"Test123!\"}"
```

**Or use Postman/Insomnia:**
- Import the OpenAPI spec from /docs
- Test all endpoints

### ❌ Problem: "Registration fails with validation error"

**Check password requirements:**
```python
# backend/app/schemas/auth.py
@validator('password')
def validate_password(cls, v):
    if len(v) < 8:
        raise ValueError('Password must be at least 8 characters')
    if len(v) > 128:
        raise ValueError('Password must be at most 128 characters')
    if not re.search(r'[A-Z]', v):
        raise ValueError('Must contain uppercase letter')
    if not re.search(r'[a-z]', v):
        raise ValueError('Must contain lowercase letter')
    if not re.search(r'[0-9]', v):
        raise ValueError('Must contain number')
    if not re.search(r'[!@#$%^&*()_+\-=\[\]{};:\'",.<>?/\\|`~]', v):
        raise ValueError('Must contain special character')
    return v
```

**Valid password example:**
```
Password: "MyPass123!"
✅ 8+ characters
✅ Uppercase: M, P
✅ Lowercase: y, a, s, s
✅ Number: 1, 2, 3
✅ Special: !
```

---

## Platform-Specific Issues

### Android Issues

**❌ "Application not installed"**
```cmd
# Uninstall old version
adb uninstall com.routewise.app

# Install new version
adb install path/to/your.apk
```

**❌ "Unable to connect to development server"**
```cmd
# Check Metro bundler is running
npm start

# Check device/emulator can reach your computer
adb reverse tcp:8081 tcp:8081
```

**❌ "Google Play Services not available"**
This is normal for emulators without Google Play. Use physical device for OAuth testing.

---

## Quick Diagnostic Commands

### Check Everything
```cmd
# Backend health
curl http://localhost:8000/health

# Database
psql -U user -d routewise -c "SELECT 1"

# Redis
redis-cli ping

# Mobile packages
cd mobile && npm list --depth=0

# Python packages
cd backend && pip list
```

### View Logs
```cmd
# Backend logs
# Just check the terminal where uvicorn is running

# Mobile logs (Android)
adb logcat | grep -i react

# Redis logs
redis-cli monitor

# PostgreSQL logs
# Check in PostgreSQL data directory
```

### Reset Everything
```cmd
# Database
psql -U postgres
DROP DATABASE routewise;
CREATE DATABASE routewise;
\q

# Redis
redis-cli FLUSHALL

# Mobile
cd mobile
rmdir /s /q node_modules
npm install

# Backend
cd backend
rmdir /s /q venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

---

## Getting Help

### Before Asking for Help

1. ✅ Check this troubleshooting guide
2. ✅ Check backend terminal logs
3. ✅ Check mobile Metro bundler logs
4. ✅ Test API at http://localhost:8000/docs
5. ✅ Verify database and Redis are running

### Useful Information to Provide

```
1. What were you trying to do?
2. What did you expect to happen?
3. What actually happened?
4. Error messages (full text)
5. Backend logs (relevant parts)
6. Mobile logs (relevant parts)
7. Your environment:
   - Windows version
   - Python version (python --version)
   - Node version (node --version)
   - PostgreSQL version
   - Redis version
```

---

## Common Success Indicators

✅ **Backend Working:**
- http://localhost:8000 returns welcome message
- http://localhost:8000/docs shows API documentation
- No errors in terminal
- "Application startup complete" message

✅ **Database Working:**
- Can connect with psql
- Tables created automatically
- No connection errors

✅ **Redis Working:**
- `redis-cli ping` returns PONG
- Verification codes being stored

✅ **Mobile Working:**
- No TypeScript errors in VS Code
- App opens without crashes
- Can navigate between screens
- Password validation animates
- API calls succeed

✅ **Full Stack Working:**
- Can register user → receive email → verify → login
- JWT tokens stored and working
- Real-time validation smooth
- No console errors

---

## Still Having Issues?

1. Read [INSTALLATION.md](INSTALLATION.md) carefully
2. Read [SETUP_GUIDE.md](SETUP_GUIDE.md) for details
3. Check [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system
4. Review error messages carefully
5. Test each component separately

**Most issues are environment configuration!** Double-check your .env file and that all services are running.
