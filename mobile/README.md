# RouteWise Mobile Application

Modern, cross-platform mobile application for intelligent route planning and POI recommendations.

## 🚀 Features

- ✅ Email/Password Authentication
- ✅ Google Sign-In
- ✅ Meta (Facebook) Sign-In
- ✅ Clean, modern UI design
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ Accessibility support

## 📱 Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Navigation:** React Navigation 6
- **Authentication:** Firebase Auth
- **UI Components:** Custom components with React Native Paper
- **State Management:** React Context API

## 🛠 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Studio (for Android development)

### Setup Instructions

1. **Install dependencies:**
   ```bash
   cd mobile
   npm install
   ```

2. **Configure Firebase:**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication methods (Email/Password, Google, Apple)
   - Copy your Firebase configuration
   - Create a `.env` file based on `.env.example`:
     ```bash
     cp .env.example .env
     ```
   - Add your Firebase credentials to `.env`

3. **Configure Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Add the Web Client ID to `.env`

4. **Configure Meta (Facebook) OAuth:**
   - Go to [Meta for Developers](https://developers.facebook.com)
   - Create a new app
   - Add Facebook Login product
   - Add App ID and App Secret to `.env`

## 🏃 Running the App

### Start Development Server
```bash
npm start
```

### Run on iOS Simulator
```bash
npm run ios
```

### Run on Android Emulator
```bash
npm run android
```

### Run on Web (for testing)
```bash
npm run web
```

## 📁 Project Structure

```
mobile/
├── App.tsx                 # Main app component
├── src/
│   ├── components/         # Reusable UI components
│   │   └── common/
│   │       ├── Button.tsx
│   │       └── Input.tsx
│   ├── context/           # React contexts
│   │   └── AuthContext.tsx
│   ├── navigation/        # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── screens/           # Screen components
│   │   ├── LoginScreen.tsx
│   │   └── SignUpScreen.tsx
│   ├── services/          # API and external services
│   │   ├── firebase.ts
│   │   └── authService.ts
│   ├── theme/             # Theme configuration
│   │   └── index.ts
│   ├── types/             # TypeScript type definitions
│   │   └── auth.ts
│   └── utils/             # Utility functions
│       └── validation.ts
├── assets/                # Images, fonts, etc.
├── package.json
├── tsconfig.json
└── app.json
```

## 🎨 Design Principles

### Color Palette
- **Primary:** #6366f1 (Indigo) - Modern and trustworthy
- **Secondary:** #10b981 (Green) - Success and nature
- **Accent:** #f59e0b (Amber) - Highlights

### Typography
- Follows Material Design and HIG guidelines
- Clear hierarchy with h1, h2, h3, body, caption styles
- Accessible font sizes and line heights

### Components
- **Button:** Multiple variants (primary, secondary, outline)
- **Input:** With label, error handling, and icon support
- All components follow WCAG AA accessibility standards

## 🔒 Security Features

- JWT token-based authentication
- Secure password storage with Firebase
- Client-side input validation
- Environment variables for sensitive data
- HTTPS for all API communications

## 📝 Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint for code quality
- Component-based architecture
- Single Responsibility Principle

### Naming Conventions
- Components: PascalCase (e.g., `LoginScreen.tsx`)
- Functions: camelCase (e.g., `validateEmail`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_URL`)

### Git Workflow
- Feature branches: `feature/feature-name`
- Bug fixes: `bugfix/bug-name`
- Commit messages: Follow conventional commits

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linter
npm run lint
```

## 📱 Screens Implemented

### Authentication Flow
1. **Login Screen**
   - Email/password login
   - Social login (Google, Meta)
   - Forgot password link
   - Sign up navigation

2. **Sign Up Screen**
   - Full name input
   - Email input
   - Password with requirements
   - Confirm password
   - Social sign up options (Google, Meta)
   - Terms and conditions

## 🚧 Coming Soon

- Home screen with map integration
- Route planning screen
- POI recommendations
- User profile management
- Route history
- Favorites
- Settings

## 📄 License

This project is part of the RouteWise application suite.

## 🤝 Contributing

Please follow the development principles outlined in the main README.md file.

---

**Note:** Make sure to configure Firebase and OAuth providers before running the app.
