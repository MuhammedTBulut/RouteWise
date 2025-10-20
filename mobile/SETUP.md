# RouteWise Mobile - Setup Guide

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: `routewise`
4. Follow the setup wizard

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Enable the following sign-in methods:
   - **Email/Password** (required)
   - **Google** (optional but recommended)
   - **Apple** (iOS only, optional)

### 3. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click on the **Web** app icon `</>`
4. Register your app
5. Copy the `firebaseConfig` object

### 4. Configure Environment Variables

Create a `.env` file in the `mobile/` directory:

```env
FIREBASE_API_KEY=AIza...
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abc123def456
```

---

## 🔐 Google OAuth Setup

### 1. Create OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (or create new)
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `https://auth.expo.io/@your-username/your-app-slug`
   - `http://localhost:19000`

### 2. Add to Environment

```env
GOOGLE_WEB_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
```

### 3. Configure Firebase

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Google**
3. Paste your Web Client ID
4. Save

---

## 🍎 Apple Sign-In Setup (iOS Only)

### 1. Apple Developer Account

- Requires Apple Developer Program membership ($99/year)

### 2. Configure in Apple Developer Portal

1. Go to [Apple Developer](https://developer.apple.com)
2. Go to **Certificates, Identifiers & Profiles**
3. Create a new **App ID**
4. Enable **Sign In with Apple** capability

### 3. Configure Firebase

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Apple**
3. Follow the configuration instructions
4. Add your Service ID

### 4. Add to Environment

```env
APPLE_SERVICE_ID=com.yourcompany.routewise.auth
```

---

## 📱 Expo Configuration

### Update app.json

```json
{
  "expo": {
    "extra": {
      "firebaseApiKey": process.env.FIREBASE_API_KEY,
      "firebaseAuthDomain": process.env.FIREBASE_AUTH_DOMAIN,
      // ... other Firebase config
    }
  }
}
```

---

## 🧪 Testing Authentication

### Test Email/Password

1. Run the app: `npm start`
2. Open on simulator/emulator
3. Go to Sign Up screen
4. Create test account:
   - Name: Test User
   - Email: test@example.com
   - Password: Test1234!

### Test Google Sign-In

1. Make sure GOOGLE_WEB_CLIENT_ID is configured
2. Click "Continue with Google"
3. Select Google account
4. Approve permissions

### Test Apple Sign-In (iOS)

1. Only works on physical iOS device or iOS simulator
2. Click "Continue with Apple"
3. Use Apple ID to sign in

---

## 🐛 Troubleshooting

### "Firebase not configured"

- Check `.env` file exists
- Verify all Firebase credentials are correct
- Restart development server: `npm start --clear`

### "Google sign-in not yet configured"

- Add GOOGLE_WEB_CLIENT_ID to `.env`
- Configure OAuth credentials in Google Cloud Console
- Add client ID to Firebase

### "Module not found"

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm start --clear
```

### iOS Build Issues

```bash
# Clear iOS build
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### Android Build Issues

```bash
# Clear Android build
cd android
./gradlew clean
cd ..
```

---

## 📚 Additional Resources

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Expo Authentication Guide](https://docs.expo.dev/guides/authentication/)
- [React Navigation Docs](https://reactnavigation.org/docs/getting-started)
- [React Native Paper](https://callstack.github.io/react-native-paper/)

---

## ✅ Checklist

- [ ] Firebase project created
- [ ] Firebase Auth enabled (Email/Password)
- [ ] Firebase configuration added to `.env`
- [ ] Google OAuth configured (optional)
- [ ] Apple Sign-In configured (iOS, optional)
- [ ] Dependencies installed (`npm install`)
- [ ] App runs on simulator/emulator
- [ ] Test account created
- [ ] Login/SignUp flow tested

---

**Ready to develop!** 🚀
