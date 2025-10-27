# RouteWise - Team Setup Guide

Ekip arkadaşlarınızın projeyi kendi bilgisayarında çalıştırması için adım adım kurulum rehberi.

## 📋 Gereksinimler

### Backend
- Python 3.12+ 
- PostgreSQL 14+
- Git

### Mobile
- Node.js 18+
- npm veya yarn
- Xcode (iOS için, macOS)
- Android Studio (Android için)
- Expo Go (fiziksel cihazda test için)

---

## 🚀 Kurulum Adımları

### 1️⃣ Repository'yi Clone Et

```bash
git clone git@github.com:MuhammedTBulut/RouteWise.git
cd RouteWise
```

### 2️⃣ Backend Setup

```bash
cd backend

# Virtual environment oluştur
python3 -m venv venv

# Activate et
source venv/bin/activate  # macOS/Linux
# veya
venv\Scripts\activate  # Windows

# Paketleri kur
pip install -r requirements.txt

# PostgreSQL database oluştur
createdb routewise
# veya psql ile:
# psql -U postgres
# CREATE DATABASE routewise;

# .env dosyası oluştur
cp .env.example .env  # Eğer varsa
# veya manuel oluştur:
```

**backend/.env dosyası:**
```env
DATABASE_URL=postgresql://postgres:password@localhost/routewise
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
```

```bash
# Database'i initialize et
python init_database.py

# Server'ı başlat
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend şimdi çalışıyor: http://localhost:8000
API Docs: http://localhost:8000/docs

---

### 3️⃣ Mobile Setup

```bash
cd ../mobile

# Node paketlerini kur
npm install
# veya
yarn install

# iOS dependencies (sadece macOS)
cd ios
pod install
cd ..

# .env dosyası oluştur
```

**mobile/.env dosyası:**
```env
# Firebase Config
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef
FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Google OAuth
GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
GOOGLE_IOS_CLIENT_ID=your_google_ios_client_id
GOOGLE_ANDROID_CLIENT_ID=your_google_android_client_id

# Meta OAuth (Optional)
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
```

```bash
# Expo'yu başlat
npx expo start

# iOS Simulator'de aç
# Terminal'de 'i' tuşuna bas

# Android Emulator'de aç
# Terminal'de 'a' tuşuna bas

# Fiziksel cihazda aç
# Expo Go uygulamasıyla QR kodu okut
```

---

## 🔑 API Keys Nasıl Alınır?

### Google Places API
1. https://console.cloud.google.com/ 
2. Yeni proje oluştur
3. "APIs & Services" > "Enable APIs"
4. "Places API" ara ve enable et
5. "Credentials" > "Create Credentials" > "API Key"

### Firebase
1. https://console.firebase.google.com/
2. Yeni proje oluştur
3. "Project Settings" > "General"
4. "Your apps" > "Add app" > "Web"
5. Config bilgilerini kopyala
6. "Authentication" > "Sign-in method" > Enable "Email/Password" ve "Google"
7. "Firestore Database" > "Create database" > "Test mode"

### Google OAuth (Firebase Authentication için)
1. https://console.cloud.google.com/
2. "APIs & Services" > "Credentials"
3. "Create Credentials" > "OAuth 2.0 Client ID"
4. iOS için: Bundle ID ekle
5. Android için: SHA-1 fingerprint ekle

---

## 🛠️ Yaygın Sorunlar ve Çözümler

### Backend port 8000 zaten kullanımda
```bash
# Process'i bul ve öldür
lsof -ti:8000 | xargs kill -9

# Veya farklı port kullan
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

### PostgreSQL bağlantı hatası
```bash
# PostgreSQL'in çalıştığını kontrol et
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# PostgreSQL'i başlat
brew services start postgresql  # macOS
sudo systemctl start postgresql  # Linux
```

### Python venv aktif değil
```bash
# Terminal'de (venv) görünmüyorsa
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate  # Windows
```

### Node modules hatası
```bash
# Node modules'ı sil ve yeniden kur
rm -rf node_modules package-lock.json
npm install
```

### iOS Simulator açılmıyor
```bash
# Xcode Command Line Tools'u kur
xcode-select --install

# Simulator'ü manuel aç
open -a Simulator
```

### Expo cache sorunu
```bash
# Cache'i temizle
npx expo start --clear
```

---

## 📱 API Endpoint'leri Test Et

### Backend çalışıyor mu?
```bash
curl http://localhost:8000/docs
```

### POI'leri getir
```bash
curl http://localhost:8000/api/v1/pois/istanbul
```

### Swagger UI
Tarayıcıda: http://localhost:8000/docs

---

## 🎯 Geliştirme Workflow'u

### 1. Yeni feature için branch oluştur
```bash
git checkout -b feature/yeni-ozellik
```

### 2. Değişiklikleri yap ve test et

### 3. Commit ve push
```bash
git add .
git commit -m "feat: yeni özellik eklendi"
git push origin feature/yeni-ozellik
```

### 4. Pull Request oluştur
GitHub'da PR aç ve review bekle

---

## 📂 Proje Yapısı

```
RouteWise/
├── backend/               # FastAPI Backend
│   ├── app/
│   │   ├── main.py       # Ana uygulama
│   │   ├── models/       # Database models
│   │   ├── api/v1/       # API endpoints
│   │   ├── services/     # Business logic
│   │   └── db/           # Database config
│   ├── requirements.txt  # Python dependencies
│   └── init_database.py  # DB initialization
│
├── mobile/               # React Native/Expo App
│   ├── src/
│   │   ├── screens/      # App screens
│   │   ├── components/   # Reusable components
│   │   ├── navigation/   # Navigation setup
│   │   ├── services/     # API services
│   │   └── context/      # React context
│   ├── App.tsx           # Ana component
│   └── package.json      # Node dependencies
│
├── DATABASE_ER_DIAGRAM.md  # Database şeması
└── README.md             # Proje açıklaması
```

---

## 🔍 Test Kullanıcı Bilgileri

Firebase'de kendi test kullanıcınızı oluşturun:
1. Mobile app'i aç
2. "Sign Up" tıkla
3. Email ve şifre gir
4. Kayıt ol

---

## 📞 Yardım

Sorun yaşarsan:
1. Bu dokümantasyonu tekrar oku
2. GitHub Issues'a bak
3. Takım liderine sor (Muhammed)

---

## 🎉 Başarılı Kurulum!

Her şey çalışıyorsa:
- ✅ Backend: http://localhost:8000
- ✅ Mobile: Expo Dev Server çalışıyor
- ✅ Database: PostgreSQL bağlantısı var
- ✅ Firebase: Authentication çalışıyor

Happy Coding! 🚀
