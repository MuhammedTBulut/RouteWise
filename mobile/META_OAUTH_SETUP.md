# 🔐 Meta (Facebook) OAuth Setup Rehberi

## 📋 Meta OAuth Yapılandırması

Meta (Facebook) ile giriş yapmak için Facebook Developer Console'da uygulama ayarları yapmanız gerekiyor.

---

## 🔑 Mevcut Bilgiler

`.env` dosyanızda zaten Meta credentials var:

```bash
META_APP_ID=807835558492196
META_APP_SECRET=f6e077d33761dcff54a85e0dfd5183d0
```

---

## 📝 Yapılması Gerekenler

### 1️⃣ Facebook Developers Console Yapılandırması

#### a) Console'a Giriş:

1. **Facebook Developers**: https://developers.facebook.com/
2. **My Apps** → App seçin (ID: `807835558492196`)
3. Veya yeni app oluşturun: **Create App** → **Consumer**

#### b) Facebook Login Ürününü Ekleyin:

1. Sol menüden **Add Product** tıklayın
2. **Facebook Login** bulun ve **Set Up** tıklayın
3. Platform seçin: **iOS** ve **Android**

#### c) iOS Ayarları:

1. **Facebook Login** → **Settings**
2. **iOS** sekmesine gidin
3. Ayarlar:
   ```
   Bundle ID: com.routewise.app
   ```
4. **Save Changes**

#### d) Android Ayarları:

1. **Facebook Login** → **Settings**
2. **Android** sekmesine gidin
3. Ayarlar:
   ```
   Package Name: com.routewise.app
   Default Activity Class: com.routewise.app.MainActivity
   ```
4. Key Hash gerekebilir (development için):
   ```bash
   keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
   # Password: android
   ```
5. **Save Changes**

---

### 2️⃣ Firebase Console'da Facebook Auth Aktifleştirme

1. **Firebase Console**: https://console.firebase.google.com/
2. Project: `route-project-ad117`
3. **Authentication** → **Sign-in method**
4. **Facebook** provider'ı aktifleştirin
5. Credentials ekleyin:
   ```
   App ID: 807835558492196
   App Secret: f6e077d33761dcff54a85e0dfd5183d0
   ```
6. **OAuth redirect URI**'yi kopyalayın (örn: `https://route-project-ad117.firebaseapp.com/__/auth/handler`)
7. **Save**

---

### 3️⃣ Facebook App'te OAuth Redirect URI Ekleme

1. **Facebook Developers** → Your App
2. **Facebook Login** → **Settings**
3. **Valid OAuth Redirect URIs** alanına Firebase'den kopyaladığınız URI'yi ekleyin:
   ```
   https://route-project-ad117.firebaseapp.com/__/auth/handler
   ```
4. **Save Changes**

---

### 4️⃣ App Privacy Policy ve Terms (Zorunlu)

Facebook, production'da privacy policy ve terms of service gerektirir:

1. **App Dashboard** → **Settings** → **Basic**
2. **Privacy Policy URL** ekleyin (örn: `https://yourwebsite.com/privacy`)
3. **Terms of Service URL** ekleyin (örn: `https://yourwebsite.com/terms`)
4. **Save Changes**

---

### 5️⃣ App Review (Production için)

Development mode'da sadece app admin'leri ve test kullanıcıları giriş yapabilir.

**Herkese açmak için:**

1. **App Review** → **Permissions and Features**
2. **email** ve **public_profile** permissions request edin
3. App'i **Live** mode'a alın:
   - **App Dashboard** → Toggle **Development Mode** → **Live**

---

## 🧪 Test Etme

### Development Mode'da Test:

1. **Roles** → **Test Users** → **Add** tıklayın
2. Test kullanıcısı oluşturun
3. Test user ile giriş yapın

### veya Kendinizi Admin Olarak Ekleyin:

1. **Roles** → **Roles** → **Add Administrators**
2. Facebook hesabınızı ekleyin

---

## 🔄 Uygulamayı Test Etme

```bash
cd /Users/muhammedbulut/Desktop/RouteWise/mobile
npx expo start --clear
```

1. iOS simulator'de uygulamayı açın
2. **Login** veya **SignUp** ekranına gidin
3. **Meta ile Giriş** butonuna tıklayın
4. Facebook hesabı seçin
5. İzin verin
6. Otomatik giriş yapılmalı

---

## 📊 Beklenen Log Çıktısı

Terminal'de şunları göreceksiniz:

```
LOG  🔵 Meta Sign-In button pressed
LOG  🔵 Opening Facebook sign-in prompt...
LOG  🔵 Creating Firebase credential with Facebook access token...
LOG  ✅ Facebook Sign-In successful: user@email.com
```

---

## ⚠️ Olası Hatalar ve Çözümleri

### 1. "App Not Setup" Hatası
**Çözüm:** Facebook Login product'ını ekleyin ve iOS/Android platformlarını yapılandırın.

### 2. "Invalid OAuth Redirect URI"
**Çözüm:** Firebase'den aldığınız redirect URI'yi Facebook app settings'e ekleyin.

### 3. "This app is in Development Mode"
**Çözüm:** 
- Development mode'da sadece app admin'leri ve test users giriş yapabilir
- Test user ekleyin veya app'i Live mode'a alın

### 4. "Operation Not Allowed"
**Çözüm:** Firebase Console'da Facebook provider'ı aktifleştirin.

### 5. "Account Exists with Different Credential"
**Çözüm:** Aynı email adresi başka bir provider (Google, Email) ile kullanılıyor. Farklı bir hesap deneyin.

---

## 🔒 Güvenlik Notları

1. **App Secret'i asla frontend'de kullanmayın** - sadece `.env` dosyasında saklayın
2. **Production'da** `.env` dosyasını `.gitignore`'a ekleyin
3. **App Review** sonrası live mode'a alın
4. **Privacy Policy** ve **Terms of Service** mutlaka ekleyin

---

## 📚 Faydalı Linkler

- [Facebook Developers Console](https://developers.facebook.com/)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)
- [Firebase Facebook Auth](https://firebase.google.com/docs/auth/web/facebook-login)
- [Expo Facebook Login](https://docs.expo.dev/versions/latest/sdk/facebook/)

---

## ✅ Tamamlandığında

Meta OAuth başarıyla çalıştığında:

- ✅ Facebook popup açılır
- ✅ Kullanıcı hesabı seçer ve izin verir
- ✅ Firebase'e otomatik giriş yapılır
- ✅ Kullanıcı verileri Firestore'a kaydedilir
- ✅ Ana sayfaya yönlendirilir

**Başarılar! 🎉**
