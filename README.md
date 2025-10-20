# RouteWise

## 🌍 Project Overview / Proje Hakkında

### About RouteWise / RouteWise Hakkında

RouteWise is an **intelligent route planning application** that helps users discover and navigate to places based on their preferences, location, and time constraints.

RouteWise, kullanıcıların tercihlerine, konumlarına ve zaman kısıtlamalarına göre mekanları keşfetmelerine ve rotalarını planlamalarına yardımcı olan **akıllı bir rota planlama uygulamasıdır**.

---

### 🎓 Theoretical Framework / Teorik Çerçeve

This project presents a **theoretical framework for developing a route-based tourism recommender system** that enhances tourist experiences by integrating intelligent point-of-interest (POI) recommendations with route planning.

Bu proje, **rota tabanlı bir turizm öneri sistemi geliştirmek için teorik bir çerçeve** sunmakta ve akıllı ilgi noktası (POI) önerilerini rota planlaması ile entegre ederek turist deneyimlerini geliştirmektedir.

**Our Research Synthesizes / Araştırmamız Sentezler:**
- 📚 Recent academic findings in **hybrid filtering techniques** / Hibrit filtreleme tekniklerindeki son akademik bulgular
- 🧠 **Context-aware computing** principles / Bağlam bilinçli hesaplama prensipleri
- ⚖️ **Multi-stakeholder fairness** considerations / Çok paydaşlı adalet değerlendirmeleri
- 🏛️ **Recommender system principles** / Öneri sistemi prensipleri
- 🌐 **Tourism technology trends** / Turizm teknolojisi trendleri

**Real-World Application / Gerçek Dünya Uygulaması:**

This mobile application addresses **real-world tourism planning challenges** by combining theoretical knowledge with practical implementation considerations for modern mobile applications.

Bu mobil uygulama, teorik bilgiyi modern mobil uygulamalar için pratik uygulama değerlendirmeleriyle birleştirerek **gerçek dünya turizm planlama zorluklarını** çözmektedir.

**Our Comprehensive Understanding Demonstrates / Kapsamlı Anlayışımız Gösterir:**
- ✅ Advanced recommender system architecture / Gelişmiş öneri sistemi mimarisi
- ✅ Integration of multiple data sources and APIs / Çoklu veri kaynakları ve API entegrasyonu
- ✅ Machine learning and AI-driven personalization / Makine öğrenmesi ve yapay zeka güdümlü kişiselleştirme
- ✅ User-centric design and accessibility / Kullanıcı merkezli tasarım ve erişilebilirlik
- ✅ Scalable and maintainable software engineering practices / Ölçeklenebilir ve sürdürülebilir yazılım mühendisliği pratikleri

---

## 📋 Development Principles / Geliştirme Prensipleri

### 1️⃣ Technical Standards / Teknik Standartlar

#### a) Version Control and Documentation / Versiyon Kontrolü ve Dokümantasyon

**🎯 Purpose / Ne İşe Yarar:**
Maintains project history, enables collaboration, and provides clear documentation.
Proje geçmişini tutar, işbirliğini kolaylaştırır ve açık dokümantasyon sağlar.

**✅ How We Apply / Biz Nasıl Uygularız:**
- **Git Commit Messages:** Use clear, descriptive messages
  - ✅ Good: `feat: add route optimization algorithm`
  - ❌ Bad: `update`
  - Git Commit Mesajları: Açık ve tanımlayıcı mesajlar kullan
  
- **Branching Strategy:** Follow Git Flow
  - `main` → Production-ready code / Canlı ortam kodu
  - `develop` → Development branch / Geliştirme dalı
  - `feature/*` → New features / Yeni özellikler
  - `bugfix/*` → Bug fixes / Hata düzeltmeleri
  
- **Documentation:** Keep README, API docs, and inline comments up to date
  - Dokümantasyon: README, API dokümanları ve kod içi yorumları güncel tut
  
- **Semantic Versioning:** Use `v1.0.0` format (MAJOR.MINOR.PATCH)
  - Semantik Versiyonlama: `v1.0.0` formatı kullan

**🧩 In Short / Kısaca:** Write meaningful commit messages, maintain organized branches, and keep documentation current.
Anlamlı commit mesajları yaz, düzenli dallar oluştur ve dokümantasyonu güncel tut.

---

#### b) Architecture and Code / Mimari ve Kod

**🎯 Purpose / Ne İşe Yarar:**
Ensures code is organized, maintainable, and scalable.
Kodun düzenli, bakımı kolay ve geliştirilebilir olmasını sağlar.

**✅ How We Apply / Biz Nasıl Uygularız:**
- **Layered Architecture:** Organize code into clear layers
  - `/ui` → User interface components / Kullanıcı arayüzü bileşenleri
  - `/api` → API endpoints and controllers / API uç noktaları ve kontrolcüler
  - `/services` → Business logic / İş mantığı
  - `/models` → Data models / Veri modelleri
  - `/utils` → Helper functions / Yardımcı fonksiyonlar
  
- **SOLID Principles & Clean Code:**
  - Single Responsibility: Each class does one thing / Her sınıf tek iş yapsın
  - Open/Closed: Open for extension, closed for modification / Genişlemeye açık, değişime kapalı
  - Liskov Substitution: Subtypes must be substitutable / Alt tipler değiştirilebilir olmalı
  - Interface Segregation: Many specific interfaces / Çok sayıda spesifik arayüz
  - Dependency Inversion: Depend on abstractions / Soyutlamalara bağımlı ol
  
- **API Versioning:** Use versioned endpoints
  - `/api/v1/routes` → Version 1 of routes API
  - API Versiyonlama: Versiyonlanmış uç noktalar kullan
  
- **Environment Variables:** Keep secrets in `.env` files
  - **NEVER** commit `.env` to GitHub / `.env` dosyasını GitHub'a asla koyma
  - Use `.env.example` for documentation / Dokümantasyon için `.env.example` kullan

**🧩 In Short / Kısaca:** Keep code modular, readable, and secure.
Kodu modüler, okunabilir ve güvenli tut.

---

#### c) Security and Privacy / Güvenlik ve Gizlilik

**🎯 Purpose / Ne İşe Yarar:**
Protects user data from misuse and ensures application security.
Kullanıcı verilerinin kötüye kullanılmamasını ve uygulamanın güvenliğini sağlar.

**✅ How We Apply / Biz Nasıl Uygularız:**
- **Authentication:** Every request must pass JWT token verification
  - Implement proper token refresh mechanisms
  - Kimlik Doğrulama: Her istek JWT token ile kimlik kontrolünden geçsin
  
- **Data Privacy:** Process location data locally when possible
  - Don't send data to server unless necessary
  - Veri Gizliliği: Konum verisi cihazda işlenebiliyorsa sunucuya gönderilmesin
  
- **GDPR/KVKK Compliance:**
  - Users must be able to delete their data upon request
  - Provide clear privacy policy
  - KVKK'ya Uyum: Kullanıcı verisini isteği üzerine silebilmeli
  
- **Data Encryption:**
  - Use HTTPS for all communications
  - Encrypt sensitive data at rest
  - Veri Şifreleme: Tüm iletişim için HTTPS kullan
  
- **Input Validation:** Sanitize all user inputs to prevent injection attacks
  - Girdi Doğrulama: Tüm kullanıcı girdilerini temizle

**🧩 In Short / Kısaca:** Respect user data, ensure secure access.
Kullanıcının verisine saygı göster, güvenli erişim sağla.

---

#### d) Performance and Resilience / Performans ve Dayanıklılık

**🎯 Purpose / Ne İşe Yarar:**
Ensures the application runs fast and smoothly without issues.
Uygulamanın hızlı ve sorunsuz çalışmasını sağlar.

**✅ How We Apply / Biz Nasıl Uygularız:**
- **Caching Strategy:** Use cache for frequent queries
  - Redis for session data / Oturum verileri için Redis
  - Local cache for static content / Statik içerik için yerel önbellek
  - Önbellek Stratejisi: Sık sorgular için önbellek kullan
  
- **Map Data Loading:** Load map tiles incrementally
  - Tile-based approach for efficient rendering
  - Progressive loading for better UX
  - Harita Verisi Yükleme: Harita verilerini parça parça yükle
  
- **API Rate Limiting:** Monitor and respect external API limits
  - Implement exponential backoff for retries
  - Provide fallback data sources
  - API Limit Kontrolü: Harici API limitlerini kontrol et
  
- **Error Handling:**
  - Graceful degradation when services fail
  - User-friendly error messages
  - Automatic retry with exponential backoff
  - Hata Yönetimi: Hata durumunda alternatif kaynak sun
  
- **Performance Monitoring:**
  - Track response times and bottlenecks
  - Optimize database queries
  - Performans İzleme: Yanıt sürelerini ve darboğazları takip et

**🧩 In Short / Kısaca:** Build a fast, smooth, and error-resistant system.
Hızlı, akıcı ve hatalara karşı dayanıklı bir sistem kur.

---

### 2️⃣ Product and Design (UX/UI) Principles / Ürün ve Tasarım (UX/UI) Prensipleri

**🎯 Purpose / Ne İşe Yarar:**
Ensures the user interface is aesthetic, understandable, and accessible.
Kullanıcı arayüzünün estetik, anlaşılır ve erişilebilir olmasını sağlar.

**✅ How We Apply / Biz Nasıl Uygularız:**

#### Design Systems / Tasarım Sistemleri
- **Android:** Follow Material Design guidelines
  - Material Design kılavuzlarını takip et
- **iOS:** Apply HIG (Human Interface Guidelines) principles
  - HIG prensiplerine uy

#### User Flow / Kullanıcı Akışı
- **Clear Navigation:** Maintain consistent flow
  - Home → Route → Recommendations → Details
  - Ana sayfa → Rota → Öneriler → Detay
  
#### Feedback and Empty States / Geri Bildirim ve Boş Durumlar
- **Explain Why:** Always provide context to users
  - ✅ "No open places found at this time" / "Bu saatte açık yer bulunamadı"
  - ❌ "No results" / "Sonuç yok"
  
#### Accessibility / Erişilebilirlik
- **Color Contrast:** Ensure WCAG AA compliance
  - Text contrast ratio ≥ 4.5:1
  - Renk Kontrastı: WCAG AA uyumu sağla
  
- **Button Labels:** Keep them short and clear
  - "Add to Route" / "Rotaya Ekle"
  - "Share" / "Paylaş"
  - "Retry" / "Yeniden Dene"
  
- **Screen Reader Support:**
  - Add alt text to icons / İkonlara alt metin ekle
  - Label all form inputs / Tüm form girdilerine etiket ekle
  - Semantic HTML elements / Anlamsal HTML öğeleri

#### Transparency / Şeffaflık
- **Explain Recommendations:** Tell users why they see certain suggestions
  - "Nearby and currently open" / "Yakın ve şu anda açık"
  - "Based on your preferences" / "Tercihlerinize göre"

**🧩 In Short / Kısaca:** Simple, accessible, explanatory, and visually clean interface.
Basit, erişilebilir, açıklayıcı ve görsel olarak temiz bir arayüz.

---

### 3️⃣ Team Agreement / Ekip Sözleşmesi

**🎯 Purpose / Ne İşe Yarar:**
Defines how the team works together.
Ekip içinde nasıl çalışılacağını tanımlar.

**✅ How We Apply / Biz Nasıl Uygularız:**

#### Code Review / Kod İncelemesi
- **Pull Request Reviews:** Every merge requires code review
  - At least one approval before merging
  - Her merge öncesi kodu biri gözden geçirsin
  
#### Feature Deployment / Özellik Dağıtımı
- **Feature Flags:** Gradually activate new features
  - Test with small user groups first
  - Yeni özellikleri feature flag ile yavaş yavaş aktif et
  
#### Design-Code Consistency / Tasarım-Kod Tutarlılığı
- **Figma-Code Sync:** Design and code must match 1:1
  - Regular sync meetings between designers and developers
  - Figma'daki tasarım kodla birebir uyumlu olsun
  
#### ML Model Management / Makine Öğrenmesi Model Yönetimi
- **Separate Models:** Keep ML models in dedicated folders
  - Document model versions
  - Track performance metrics
  - Makine öğrenmesi modelleri ayrı klasörde dursun, sürümü not alınsın

#### Communication / İletişim
- **Daily Standups:** Brief daily sync meetings
  - What did you do yesterday?
  - What will you do today?
  - Any blockers?
  
- **Documentation:** Document decisions and architecture
  - Use ADR (Architecture Decision Records) for major decisions
  - Kararları ve mimariyi belgele

**🧩 In Short / Kısaca:** Maintain team discipline and order.
Ekip içi disiplin ve düzen.

---

## 🚀 Getting Started / Başlangıç

### Mobile Application / Mobil Uygulama

The mobile application is built with **React Native** and **Expo**, supporting both iOS and Android platforms.

Mobil uygulama **React Native** ve **Expo** ile geliştirilmiştir, iOS ve Android platformlarını destekler.

#### Quick Start / Hızlı Başlangıç

```bash
# Navigate to mobile directory / Mobil dizinine git
cd mobile

# Install dependencies / Bağımlılıkları yükle
npm install

# Start development server / Geliştirme sunucusunu başlat
npm start

# Run on iOS / iOS'ta çalıştır
npm run ios

# Run on Android / Android'de çalıştır
npm run android
```

#### Current Features / Mevcut Özellikler

✅ **Authentication Screens / Kimlik Doğrulama Ekranları:**
- Login with email/password / E-posta/şifre ile giriş
- Sign up with validation / Doğrulama ile kayıt
- Google Sign-In / Google ile giriş
- Meta (Facebook) Sign-In / Meta (Facebook) ile giriş
- Password recovery / Şifre kurtarma

✅ **UI Components / UI Bileşenleri:**
- Custom Button (multiple variants) / Özel Buton (çoklu varyant)
- Custom Input (with validation) / Özel Girdi (doğrulama ile)
- Theme system / Tema sistemi
- Loading states / Yükleme durumları
- Error handling / Hata yönetimi

#### Configuration / Yapılandırma

1. Copy `.env.example` to `.env` / `.env.example`'ı `.env`'ye kopyala
2. Add Firebase credentials / Firebase kimlik bilgilerini ekle
3. Add OAuth provider credentials / OAuth sağlayıcı kimlik bilgilerini ekle

See `mobile/README.md` for detailed instructions.
Detaylı talimatlar için `mobile/README.md` dosyasına bakın.

---

## 🔌 APIs and External Services / API'ler ve Harici Servisler

### 4.1. Google Maps Platform APIs

**Purpose / Amaç:** Route calculation and POI data retrieval / Rota hesaplama ve POI veri alımı

#### APIs Used / Kullanılan API'ler:

**1. Directions API**
- **Purpose:** Calculates optimal routes between origin and destination
- **Amaç:** Başlangıç ve varış noktaları arasında optimal rotalar hesaplar
- **Response includes / Yanıt içeriği:**
  - Route polyline / Rota çizgisi
  - Distance / Mesafe
  - Duration / Süre
  - Step-by-step directions / Adım adım yol tarifleri
- **Cost:** $5 per 1,000 requests / 1.000 istek başına $5

**2. Places API**
- **Purpose:** Retrieves POI (Point of Interest) information
- **Amaç:** POI (İlgi Noktası) bilgilerini alır
- **Features / Özellikler:**
  - **Nearby Search:** Finds POIs within radius of coordinates / Koordinatların yarıçapı içinde POI'leri bulur
  - **Place Details:** Gets comprehensive information (reviews, photos, hours) / Kapsamlı bilgi alır (yorumlar, fotoğraflar, saatler)
- **Cost:** $17 per 1,000 Nearby Search + $17 per 1,000 Details requests

#### Cost Estimate / Maliyet Tahmini

For 5,000 monthly active users with average 10 routes per user:
Ortalama 10 rota kullanan 5.000 aylık aktif kullanıcı için:

- **Directions:** 50,000 requests × $5/1,000 = **$250**
- **Places Nearby:** 500,000 requests × $17/1,000 = **$8,500**
- **Places Details:** 50,000 requests × $17/1,000 = **$850**
- **Monthly Total / Aylık Toplam:** **~$9,600**

---

### 4.2. OpenWeatherMap API

**Purpose / Amaç:** Weather-based filtering for outdoor activities / Açık hava aktiviteleri için hava durumu bazlı filtreleme

**API Used / Kullanılan API:** Current Weather Data / Güncel Hava Durumu Verisi

**Response includes / Yanıt içeriği:**
- Temperature / Sıcaklık
- Conditions / Koşullar
- Humidity / Nem
- Wind speed / Rüzgar hızı

**Cost / Maliyet:**
- Free tier: 60 calls/minute / Ücretsiz: 60 çağrı/dakika
- Paid tier: $40/month for 300,000 calls / Ücretli: 300.000 çağrı için $40/ay

---

### 4.3. Firebase Authentication

**Purpose / Amaç:** User authentication and session management / Kullanıcı kimlik doğrulama ve oturum yönetimi

**Features / Özellikler:**
- Email/password authentication / E-posta/şifre kimlik doğrulama
- Social login (Google, Facebook) / Sosyal medya girişi
- JWT token generation / JWT token oluşturma

**Cost / Maliyet:** Free tier (up to 10,000 monthly users) / Ücretsiz (10.000 aylık kullanıcıya kadar)

---

### 4.4. Public Datasets / Açık Veri Setleri

#### Yelp Open Dataset

**Source / Kaynak:** https://www.yelp.com/dataset

**Coverage / Kapsam:**
- 6.9 million reviews / 6,9 milyon yorum
- 150,000 businesses / 150.000 işletme
- 200,000 pictures / 200.000 fotoğraf
- Focus areas: US, Canada, UK cities / Odak alanları: ABD, Kanada, İngiltere şehirleri

**Usage in Our System / Sistemimizde Kullanımı:**
- Training collaborative filtering models with historical user-business interactions
- İşbirlikçi filtreleme modellerini geçmiş kullanıcı-işletme etkileşimleriyle eğitme
- Building content-based profiles using review text
- Yorum metinlerini kullanarak içerik tabanlı profiller oluşturma
- Cold-start POI recommendations using textual descriptions
- Metinsel açıklamalar kullanarak soğuk başlangıç POI önerileri

#### OpenStreetMap (OSM) Data

**Source / Kaynak:** 
- Overpass API
- GeoFabrik downloads (https://www.openstreetmap.org)

**Coverage / Kapsam:** Global, community-maintained geographic database / Küresel, topluluk tarafından sürdürülen coğrafi veritabanı

**Data Elements / Veri Öğeleri:**
- Road networks (for route calculation backup) / Yol ağları (rota hesaplama yedeği için)
- POI locations (when Google Places unavailable) / POI konumları (Google Places mevcut olmadığında)
- Building footprints / Bina izleri
- Administrative boundaries / İdari sınırlar

**Usage / Kullanım:**
- Fallback POI data source / Yedek POI veri kaynağı
- Road network analysis / Yol ağı analizi
- Spatial joins and geospatial operations / Mekansal birleştirmeler ve coğrafi işlemler

---

## 📊 Data Integration Approach / Veri Entegrasyon Yaklaşımı

### 5.1. Integration Strategy / Entegrasyon Stratejisi

Our integration strategy follows a multi-layered approach:
Entegrasyon stratejimiz çok katmanlı bir yaklaşım izler:

#### Initial Population / İlk Popülasyon
- Extract Yelp dataset POIs matching our geographic focus
- Coğrafi odağımıza uyan Yelp veri seti POI'lerini çıkar
- Supplement with Google Places API for current information
- Güncel bilgi için Google Places API ile destekle
- Enrich with OSM data for missing attributes
- Eksik öznitelikler için OSM verisi ile zenginleştir

#### Ongoing Updates / Devam Eden Güncellemeler
- **Daily updates:** Trending locations / Günlük güncellemeler: Trend konumlar
- **Weekly refreshes:** Weather patterns for seasonal adjustments / Haftalık yenilemeler: Mevsimsel ayarlamalar için hava durumu desenleri
- **Monthly re-training:** Machine learning models with new interaction data / Aylık yeniden eğitim: Yeni etkileşim verileriyle makine öğrenmesi modelleri

#### Quality Assurance / Kalite Güvencesi
- **Deduplication:** Fuzzy name matching combined with geospatial proximity checks
- **Tekilleştirme:** Coğrafi yakınlık kontrolleri ile birleştirilmiş bulanık ad eşleştirme
- **Validation:** All coordinates within valid geographic bounds
- **Doğrulama:** Tüm koordinatlar geçerli coğrafi sınırlar içinde
- **Normalization:** Ratings across different scales for consistency
- **Normalleştirme:** Tutarlılık için farklı ölçeklerdeki değerlendirmeler

---

## 🛠 Technology Stack Rationale / Teknoloji Yığını Gerekçesi

### 7.1. Frontend Technology / Ön Yüz Teknolojisi

**Selected / Seçilen:** React Native

**Rationale / Gerekçe:**

React Native provides **cross-platform development capability**, allowing us to deploy to both iOS and Android from a single codebase. This choice significantly reduces development time while maintaining native performance for map rendering and animations.

React Native, tek bir kod tabanından hem iOS hem de Android'e dağıtım yapmamızı sağlayan **çapraz platform geliştirme yeteneği** sunar. Bu seçim, harita render etme ve animasyonlar için yerel performansı korurken geliştirme süresini önemli ölçüde azaltır.

**Key Benefits / Ana Faydalar:**
- ✅ Cross-platform compatibility / Çapraz platform uyumluluğu
- ✅ Extensive ecosystem with robust libraries:
  - **React Native Maps:** Map integration / Harita entegrasyonu
  - **React Navigation:** Navigation / Navigasyon
  - **React Native Paper:** UI components / UI bileşenleri
- ✅ Large community and comprehensive documentation
- ✅ Geniş topluluk ve kapsamlı dokümantasyon
- ✅ JavaScript familiarity among team members reduces learning curve
- ✅ Ekip üyeleri arasında JavaScript bilgisi öğrenme eğrisini azaltır

---

### 7.2. Backend Framework / Arka Yüz Framework'ü

**Selected / Seçilen:** FastAPI (Python)

**Rationale / Gerekçe:**

FastAPI offers optimal balance between **performance and machine learning integration**. Python's dominance in the machine learning ecosystem provides seamless integration with recommendation libraries.

FastAPI, **performans ve makine öğrenmesi entegrasyonu** arasında optimal denge sunar. Python'un makine öğrenmesi ekosistemindeki hakimiyeti, öneri kütüphaneleri ile sorunsuz entegrasyon sağlar.

**Key Benefits / Ana Faydalar:**
- ✅ ML/AI library integration:
  - **Surprise:** Collaborative filtering / İşbirlikçi filtreleme
  - **scikit-learn:** Content-based filtering / İçerik tabanlı filtreleme
  - **Sentence-Transformers:** Text embeddings / Metin gömmeleri
- ✅ Asynchronous capabilities ensure high performance comparable to Node.js
- ✅ Asenkron yetenekler Node.js'e benzer yüksek performans sağlar
- ✅ Built-in OpenAPI documentation generation
- ✅ Yerleşik OpenAPI dokümantasyon oluşturma
- ✅ API testing and maintenance facilitation
- ✅ API test ve bakım kolaylığı

---

### 7.3. Database Systems / Veritabanı Sistemleri

**Selected / Seçilen:** PostgreSQL with PostGIS

**Rationale / Gerekçe:**

PostgreSQL's **ACID compliance** ensures data consistency critical for recommendation accuracy, while the PostGIS extension provides industrial-strength spatial operations essential for route-aware recommendations.

PostgreSQL'in **ACID uyumluluğu** öneri doğruluğu için kritik olan veri tutarlılığını sağlar, PostGIS uzantısı ise rota bilinçli öneriler için gerekli endüstriyel güçte mekansal işlemler sunar.

**Key Benefits / Ana Faydalar:**
- ✅ **ACID compliance:** Data consistency / Veri tutarlılığı
- ✅ **PostGIS extension:** Spatial operations / Mekansal işlemler
- ✅ **Native JSONB support:** Flexible POI attributes / Esnek POI özellikleri
- ✅ **User preferences storage:** Efficient handling / Verimli yönetim

#### Caching Layer / Önbellek Katmanı

**Selected / Seçilen:** Redis

**Purpose / Amaç:** Caching frequently accessed data, reducing database load by 60-70% for common queries.
Sık erişilen verileri önbellekleme, yaygın sorgular için veritabanı yükünü %60-70 azaltma.

#### Vector Database / Vektör Veritabanı

**Options / Seçenekler:** Pinecone or Weaviate

**Purpose / Amaç:** Storing BERT embeddings as 768-dimensional vectors, enabling fast approximate nearest neighbor searches for content-based recommendations.
BERT gömmelerini 768 boyutlu vektörler olarak saklama, içerik tabanlı öneriler için hızlı yaklaşık en yakın komşu aramaları sağlama.

---

## 🎨 Mobile Application Design Concept / Mobil Uygulama Tasarım Konsepti

### 8.1. Design Philosophy / Tasarım Felsefesi

Our application design follows principles of **simplicity, map-centricity, and contextual information delivery**. The interface prioritizes the map as the primary interaction surface, with overlays and modals for additional information.

Uygulama tasarımımız **basitlik, harita merkezlilik ve bağlamsal bilgi sunumu** prensiplerine uyar. Arayüz, haritayı birincil etkileşim yüzeyi olarak önceliklendirir, ek bilgi için katmanlar ve modal'lar kullanır.

**Design Guidelines / Tasarım Kılavuzları:**
- ✅ **Android:** Material Design principles / Material Design prensipleri
- ✅ **iOS:** Human Interface Guidelines (HIG) / İnsan Arayüzü Kılavuzları
- ✅ **Native feel:** Platform-specific patterns / Platform spesifik desenler
- ✅ **Map-centric:** Primary interaction surface / Birincil etkileşim yüzeyi

---

### 8.2. Key Screens and User Flow / Ana Ekranlar ve Kullanıcı Akışı

The application consists of four primary screens:
Uygulama dört ana ekrandan oluşur:

#### 1. 🏠 Home Page / Ana Sayfa
- **Purpose / Amaç:** Displays map interface with quick access to route planning
- Rota planlamaya hızlı erişimli harita arayüzü görüntüler
- **Features / Özellikler:**
  - Interactive map view / Etkileşimli harita görünümü
  - Current location marker / Mevcut konum işaretleyicisi
  - Quick route planning button / Hızlı rota planlama butonu
  - Search bar for locations / Konumlar için arama çubuğu

#### 2. 🗺 Route Planning / Rota Planlama
- **Purpose / Amaç:** Input origin and destination with preferences
- Tercihlerle başlangıç ve varış noktası girişi
- **Features / Özellikler:**
  - Origin/destination input fields / Başlangıç/varış giriş alanları
  - Route preferences (fastest, scenic, etc.) / Rota tercihleri (en hızlı, manzaralı, vb.)
  - Time constraints / Zaman kısıtlamaları
  - Activity type selection / Aktivite türü seçimi

#### 3. 💡 Route Recommendations / Rota Önerileri
- **Purpose / Amaç:** Visual display of recommended POIs along route
- Rota boyunca önerilen POI'lerin görsel gösterimi
- **Features / Özellikler:**
  - Map with route polyline / Rota çizgisi ile harita
  - POI markers with icons / İkonlu POI işaretleyicileri
  - Swipeable POI cards / Kaydırılabilir POI kartları
  - Recommendation reasons / Öneri nedenleri
  - Add/remove from route actions / Rotaya ekle/çıkar işlemleri

#### 4. 👤 Login/Profile / Giriş/Profil
- **Purpose / Amaç:** Authentication and user preference management
- Kimlik doğrulama ve kullanıcı tercihi yönetimi
- **Features / Özellikler:**
  - Email/password login / E-posta/şifre girişi
  - Social login options / Sosyal medya giriş seçenekleri
  - User preferences editor / Kullanıcı tercihleri düzenleyici
  - Route history / Rota geçmişi
  - Privacy settings / Gizlilik ayarları

---

## 📝 License / Lisans

_(Coming soon / yakında)_

---

**Note:** All code written for this project must follow these principles.
**Not:** Bu proje için yazılan tüm kodlar bu prensiplere uygun olmalıdır.
