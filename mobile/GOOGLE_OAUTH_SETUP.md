# 🔐 Google OAuth Setup Rehberi

## ❌ Aldığınız Hata

```
Erişim engellendi: Yetkilendirme hatası
You can't sign in to this app because it doesn't comply with Google's OAuth 2.0 policy
Hata 400: invalid_request
```

## ✅ Çözüm

Bu hata, Expo Go ile çalışırken Google OAuth'un doğru client ID'leri gerektirmesinden kaynaklanıyor.

---

## 📝 Yapılması Gerekenler

### 1️⃣ Google Cloud Console'da OAuth Client ID Oluşturma

#### İOS Client ID:

1. **Google Cloud Console**: https://console.cloud.google.com/
2. Proje seçin: `route-project-ad117` veya ID: `149523818479`
3. **APIs & Services** → **Credentials**
4. **+ CREATE CREDENTIALS** → **OAuth client ID**
5. Application type: **iOS**
6. Ayarlar:
   ```
   Name: RouteWise iOS
   Bundle ID: com.routewise.app
   ```
7. **CREATE** tıklayın
8. **Client ID'yi kopyalayın**

#### Android Client ID (Opsiyonel):

1. Aynı şekilde **+ CREATE CREDENTIALS** → **OAuth client ID**
2. Application type: **Android**  
3. Ayarlar:
   ```
   Name: RouteWise Android
   Package name: com.routewise.app
   ```
4. SHA-1 certificate fingerprint:
   ```bash
   # Development için:
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
5. **CREATE** tıklayın
6. **Client ID'yi kopyalayın**

---

### 2️⃣ .env Dosyasını Güncelleme

`.env` dosyasını açın ve şu satırları güncelleyin:

```bash
# Google OAuth
GOOGLE_WEB_CLIENT_ID=149523818479-7ge5ju0lsh3kq7ll0h1lohm23rrgb6bd.apps.googleusercontent.com
GOOGLE_IOS_CLIENT_ID=BURAYA_IOS_CLIENT_ID_YAPISIRIN
GOOGLE_ANDROID_CLIENT_ID=BURAYA_ANDROID_CLIENT_ID_YAPISIRIN
```

**Örnek:**
```bash
GOOGLE_IOS_CLIENT_ID=149523818479-abc123def456.apps.googleusercontent.com
GOOGLE_ANDROID_CLIENT_ID=149523818479-xyz789uvw012.apps.googleusercontent.com
```

---

### 3️⃣ app.json URL Scheme Ekleme (iOS için)

`app.json` dosyasına reverse client ID ekleyin:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.routewise.app",
      "scheme": "com.googleusercontent.apps.149523818479-abc123def456"
    }
  }
}
```

**Not:** `149523818479-abc123def456` kısmını kendi iOS Client ID'nizin client kısmı ile değiştirin.

---

### 4️⃣ Uygulamayı Yeniden Başlatma

```bash
# Terminal'de:
cd /Users/muhammedbulut/Desktop/RouteWise/mobile
npx expo start --clear
```

Sonra **i** tuşuna basarak iOS simulator'de açın.

---

## 🧪 Test Etme

1. Login veya SignUp ekranına gidin
2. **Google ile Giriş** butonuna tıklayın
3. Google hesabı seçin
4. İzin verin
5. Otomatik olarak giriş yapılmalı

---

## 🔍 Sorun Giderme

### Hala "invalid_request" hatası alıyorsanız:

1. **.env dosyasını kontrol edin** - Client ID'ler doğru mu?
2. **Bundle ID kontrol edin** - Tam olarak `com.routewise.app` olmalı
3. **Cache temizleyin**: `npx expo start --clear`
4. **Google Cloud Console'da authorized domains** kontrol edin
5. **Firebase Console'da Google Auth** aktif mi?

### Bundle ID'yi kontrol etmek için:

```bash
# app.json dosyasını kontrol edin:
cat app.json | grep bundleIdentifier
```

Çıktı: `"bundleIdentifier": "com.routewise.app"` olmalı

---

## 📚 Faydalı Linkler

- [Google Cloud Console](https://console.cloud.google.com/)
- [Expo Google Authentication](https://docs.expo.dev/guides/google-authentication/)
- [Firebase Console](https://console.firebase.google.com/)

---

## ✅ Başarılı Olduğunda

Terminal'de şu logları göreceksiniz:

```
LOG  🔵 Opening Google sign-in prompt...
LOG  🔵 Creating Firebase credential with Google ID token...
LOG  ✅ Google Sign-In successful: user@gmail.com
```

Ve kullanıcı otomatik olarak ana sayfaya yönlendirilecek!
