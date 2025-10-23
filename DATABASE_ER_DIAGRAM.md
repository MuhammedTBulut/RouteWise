# RouteWise Database ER Diagram

## Veritabanı Şeması

```mermaid
erDiagram
    USERS ||--o{ USER_PREFERENCES : has
    USERS ||--o{ FAVORITES : creates
    USERS ||--o{ INTERACTIONS : performs
    USERS ||--o{ ROUTES : creates
    
    POIS ||--o{ FAVORITES : included_in
    POIS ||--o{ INTERACTIONS : receives
    
    USERS {
        string id PK "UUID"
        string firebase_uid UK "Firebase UID"
        string email UK "Email"
        string display_name "Display Name"
        string phone_number "Phone"
        string profile_picture_url "Profile Picture"
        string city "City"
        string country "Country"
        string language "Language (tr/en)"
        boolean is_active "Active Status"
        datetime created_at "Created At"
        datetime updated_at "Updated At"
    }
    
    USER_PREFERENCES {
        string user_id PK,FK "User ID"
        int culture "Culture (0-10)"
        int nightlife "Nightlife (0-10)"
        int shopping "Shopping (0-10)"
        int nature "Nature (0-10)"
        int food "Food (0-10)"
        int sports "Sports (0-10)"
        int history "History (0-10)"
        int entertainment "Entertainment (0-10)"
        string budget_level "Budget Level"
        string pace "Travel Pace"
        string group_size "Group Size"
        float max_travel_distance_km "Max Distance"
        int preferred_visit_duration_minutes "Visit Duration"
        int public_transport_preference "Transport Pref"
        json available_times "Available Times"
        json tags "Tags"
        json avoid_categories "Avoid Categories"
        datetime created_at "Created At"
        datetime updated_at "Updated At"
    }
    
    POIS {
        string id PK "UUID"
        string google_place_id UK "Google Place ID"
        string name "Name"
        text description "Description"
        string address "Address"
        string city "City"
        string country "Country"
        float latitude "Latitude"
        float longitude "Longitude"
        string category "Category"
        json types "Types Array"
        float rating "Rating (0-5)"
        int rating_count "Rating Count"
        string phone_number "Phone"
        string website "Website"
        json opening_hours "Opening Hours"
        int price_level "Price Level (0-4)"
        float estimated_cost_per_person "Est. Cost"
        int average_visit_duration_minutes "Avg Duration"
        json best_visit_time "Best Time"
        json features "Features"
        json tags "Tags"
        json photos "Photos Array"
        string cover_photo_url "Cover Photo"
        int is_active "Active (0/1)"
        datetime created_at "Created At"
        datetime updated_at "Updated At"
    }
    
    FAVORITES {
        string id PK "UUID"
        string user_id FK "User ID"
        string poi_id FK "POI ID"
        text notes "Personal Notes"
        datetime created_at "Created At"
        datetime updated_at "Updated At"
    }
    
    INTERACTIONS {
        string id PK "UUID"
        string user_id FK "User ID"
        string poi_id FK "POI ID"
        string interaction_type "Type (view/visit/rating)"
        float rating "Rating (1-5)"
        text review_text "Review Text"
        int visit_duration_minutes "Visit Duration"
        datetime created_at "Created At"
    }
    
    ROUTES {
        string id PK "UUID"
        string user_id FK "User ID"
        string name "Route Name"
        text description "Description"
        json pois "POIs Array"
        float total_distance_km "Total Distance"
        int estimated_duration_minutes "Est. Duration"
        string transport_mode "Transport Mode"
        int optimize_route "Optimize (0/1)"
        int is_completed "Completed (0/1)"
        datetime completion_date "Completion Date"
        int is_public "Public (0/1)"
        string share_url "Share URL"
        datetime created_at "Created At"
        datetime updated_at "Updated At"
    }
```

## Tablo İlişkileri

### 1. USERS (Ana Tablo)
- **Primary Key**: id (UUID)
- **Unique Keys**: firebase_uid, email
- **İlişkiler**:
  - 1:1 → USER_PREFERENCES (bir kullanıcının bir tercih kaydı)
  - 1:N → FAVORITES (bir kullanıcının birden fazla favorisi)
  - 1:N → INTERACTIONS (bir kullanıcının birden fazla etkileşimi)
  - 1:N → ROUTES (bir kullanıcının birden fazla rotası)

### 2. USER_PREFERENCES
- **Primary Key**: user_id (aynı zamanda Foreign Key)
- **İlişki**: 1:1 → USERS
- **Amaç**: Kullanıcı tercihlerini saklar (kategoriler, bütçe, tempo vb.)

### 3. POIS (Point of Interest - Mekanlar)
- **Primary Key**: id (UUID)
- **Unique Keys**: google_place_id, foursquare_id
- **İlişkiler**:
  - 1:N → FAVORITES (bir POI birden fazla kullanıcı tarafından favorilere eklenebilir)
  - 1:N → INTERACTIONS (bir POI ile birden fazla etkileşim olabilir)
- **Amaç**: Ziyaret edilebilecek mekan bilgilerini saklar

### 4. FAVORITES (Favoriler)
- **Primary Key**: id (UUID)
- **Foreign Keys**: user_id, poi_id
- **İlişki**: Many-to-Many bridge table (USERS ↔ POIS)
- **Cascade**: User veya POI silindiğinde otomatik silinir
- **Amaç**: Kullanıcıların favori mekanlarını saklar

### 5. INTERACTIONS (Etkileşimler)
- **Primary Key**: id (UUID)
- **Foreign Keys**: user_id, poi_id
- **İlişki**: Many-to-Many bridge table (USERS ↔ POIS)
- **Cascade**: User veya POI silindiğinde otomatik silinir
- **Amaç**: Kullanıcı-mekan etkileşimlerini takip eder (görüntüleme, değerlendirme, yorum vb.)

### 6. ROUTES (Rotalar)
- **Primary Key**: id (UUID)
- **Foreign Key**: user_id
- **İlişki**: N:1 → USERS
- **Cascade**: User silindiğinde otomatik silinir
- **Amaç**: Kullanıcıların oluşturduğu seyahat rotalarını saklar

## Kategori Değerleri

### POI Kategorileri
- `culture` - Kültür (müzeler, galeriler)
- `nightlife` - Gece Hayatı (barlar, kulüpler)
- `shopping` - Alışveriş (çarşılar, AVM'ler)
- `nature` - Doğa (parklar, plajlar)
- `food` - Yemek (restoranlar, kafeler)
- `sports` - Spor (fitness, aktiviteler)
- `history` - Tarih (tarihi yerler, anıtlar)
- `entertainment` - Eğlence (sinema, konser)

### Etkileşim Tipleri
- `view` - Görüntüleme
- `click` - Tıklama
- `visit` - Ziyaret
- `rating` - Değerlendirme
- `review` - Yorum
- `share` - Paylaşım
- `route_added` - Rotaya Ekleme

## İndeksler

### USERS
- `firebase_uid` (UNIQUE INDEX)
- `email` (UNIQUE INDEX)

### POIS
- `google_place_id` (UNIQUE INDEX)
- `name` (INDEX)
- `city` (INDEX)
- `country` (INDEX)
- `latitude` (INDEX)
- `longitude` (INDEX)
- `category` (INDEX)

### FAVORITES
- `user_id` (INDEX)
- `poi_id` (INDEX)

### INTERACTIONS
- `user_id` (INDEX)
- `poi_id` (INDEX)
- `interaction_type` (INDEX)
- `created_at` (INDEX)

### ROUTES
- `user_id` (INDEX)

## Cascade Delete Davranışları

| Ebeveyn Tablo | Çocuk Tablo | Davranış |
|---------------|-------------|----------|
| USERS | USER_PREFERENCES | CASCADE DELETE |
| USERS | FAVORITES | CASCADE DELETE |
| USERS | INTERACTIONS | CASCADE DELETE |
| USERS | ROUTES | CASCADE DELETE |
| POIS | FAVORITES | CASCADE DELETE |
| POIS | INTERACTIONS | CASCADE DELETE |

## JSON Alan Yapıları

### POIS.opening_hours
```json
{
  "monday": {"open": "09:00", "close": "18:00"},
  "tuesday": {"open": "09:00", "close": "18:00"},
  ...
}
```

### USER_PREFERENCES.available_times
```json
{
  "monday": {
    "morning": true,
    "afternoon": true,
    "evening": false
  },
  ...
}
```

### ROUTES.pois
```json
[
  {"poi_id": "uuid-1", "order": 1},
  {"poi_id": "uuid-2", "order": 2},
  ...
]
```
