# 🔐 OAuth Kurulum Rehberi - Google & Meta (Facebook)

## 📋 Durum Özeti

OAuth entegrasyonu için iki seçenek var:

### ✅ Seçenek 1: Web OAuth (Mevcut - Basit)
- Firebase Authentication ile web redirect flow
- Expo Go ile çalışır
- Geliştirme aşaması için yeterli
- **Durum:** Kodu yazdık, ancak React Native'de `signInWithRedirect()` çalışmaz

### 🎯 Seçenek 2: Native SDK (Önerilen - Production için)
- Platform-native OAuth experience
- Daha güvenli ve hızlı
- Standalone build gerektirir (Expo Go ile çalışmaz)
- **Durum:** Henüz yapılandırılmadı

---

## 🚀 Seçenek 1: Web OAuth (Hızlı Test için)

### Firebase Console Yapılandırması

#### 1️⃣ Google OAuth Setup
1. **Firebase Console:** https://console.firebase.google.com
2. Project: `route-project-ad117`
3. **Authentication > Sign-in method > Google** etkinleştir
4. **Authorized domains** ekle:
   - `localhost`
   - `192.168.1.101` (sizin local IP)
   - Production domain'iniz

#### 2️⃣ Facebook (Meta) OAuth Setup
1. **Facebook Developers:** https://developers.facebook.com
2. App ID: `807835558492196`
3. **Settings > Basic**:
   - Add platform: iOS
   - Bundle ID: `com.routewise.app`
   - Add platform: Android  
   - Package name: `com.routewise.app`
4. **Facebook Login > Settings**:
   - Valid OAuth Redirect URIs ekle:
   ```
   https://route-project-ad117.firebaseapp.com/__/auth/handler
   ```

### Sorun: React Native Uyumsuzluğu

React Native'de `signInWithRedirect()` ve `signInWithPopup()` **ÇALIŞMAZ**.

Bu yöntemler sadece web browser environment için tasarlanmış.

---

## 🎯 Seçenek 2: Native SDK (Önerilen Çözüm)

### Gerekli Paketler

```bash
# Google Sign-In için
npx expo install expo-auth-session expo-crypto expo-web-browser

# Facebook Login için (opsiyonel)
npx expo install expo-facebook

# Apple Sign-In için (iOS)
npx expo install expo-apple-authentication
```

### Implementation Plan

#### Google Sign-In with Expo Auth Session

```typescript
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const [request, response, promptAsync] = Google.useAuthRequest({
  expoClientId: 'YOUR_EXPO_CLIENT_ID',
  iosClientId: 'YOUR_IOS_CLIENT_ID',
  androidClientId: 'YOUR_ANDROID_CLIENT_ID',
  webClientId: '149523818479-7ge5ju0lsh3kq7ll0h1lohm23rrgb6bd.apps.googleusercontent.com',
});

// Firebase ile bağlan
const credential = firebase.auth.GoogleAuthProvider.credential(
  idToken,
  accessToken
);
await firebase.auth().signInWithCredential(credential);
```

### Yapılması Gerekenler

1. **Google Cloud Console:**
   - iOS OAuth Client ID oluştur
   - Android OAuth Client ID oluştur
   - Expo Client ID oluştur

2. **Facebook Developer Console:**
   - iOS platform ekle
   - Android platform ekle
   - OAuth redirect URLs yapılandır

3. **app.json güncelle:**
```json
{
  "expo": {
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist",
      "bundleIdentifier": "com.routewise.app"
    },
    "android": {
      "googleServicesFile": "./google-services.json",
      "package": "com.routewise.app"
    }
  }
}
```

---

## 🔄 Şu Anki Durum

### ✅ Tamamlanan
- Firebase Authentication setup
- Email/Password authentication çalışıyor
- OAuth credentials mevcut (.env dosyasında)
- Temel OAuth kod yapısı hazır

### ⚠️ Eksik
- Firestore Database henüz oluşturulmadı (öncelikli!)
- Native OAuth SDK entegrasyonu
- iOS/Android OAuth client ID'leri
- Standalone build yapılandırması

---

## 📝 Önerilen Sıralama

### Şimdi (Geliştirme için):
1. ✅ **Email/Password** ile devam et (çalışıyor)
2. 🔥 **Firestore Database** oluştur (zorunlu)
3. 🧪 Temel özellikleri test et

### Sonra (Production hazırlığı):
1. 📱 Native OAuth SDK'ları entegre et
2. 🔑 Platform-specific OAuth client ID'leri al
3. 🏗️ Standalone build oluştur
4. 🧪 OAuth flow'ları test et

---

## 💡 Hızlı Çözüm (Geçici)

Şu anki kodda Google/Meta butonlarına tıklandığında kullanıcıya şu mesaj gösteriliyor:

```
"Google/Meta ile giriş şu anda sadece web platformunda çalışmaktadır.

iOS/Android için yapılandırma henüz tamamlanmadı.

Lütfen email ve şifre ile giriş yapın."
```

Bu geçici bir çözüm ve kullanıcıyı bilgilendiriyor. Production'da native SDK ile değiştirilecek.

---

## 📚 Faydalı Linkler

- [Expo Google Authentication](https://docs.expo.dev/guides/google-authentication/)
- [Expo Facebook Login](https://docs.expo.dev/versions/latest/sdk/facebook/)
- [Firebase Auth with Expo](https://docs.expo.dev/guides/using-firebase/)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Facebook Developers](https://developers.facebook.com/)

---

**Sonuç:** Email/Password authentication çalışıyor ve production-ready. OAuth entegrasyonu opsiyonel bir eklentidir ve native SDK kurulumu gerektirir.
