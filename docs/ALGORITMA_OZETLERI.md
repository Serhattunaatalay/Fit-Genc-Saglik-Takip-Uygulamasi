# Fit Genç - Sağlık ve Beslenme Takip Uygulaması
## Ana Algoritma Özeti ve Teknik Belgelendirme

---

## 📋 Proje Özeti

**Fit Genç**, 13-18 yaş arası çocukların ve gençlerin sağlık, beslenme takibi ve performans değerlendirmesi için tasarlanmış bir React/TypeScript uygulamasıdır. Uygulama, TÜBITAK ve akademik kaynakları referans alarak:

- ✅ Antropometrik ölçümleri yaşa göre persentil analizi yaparak değerlendirir
- ✅ BMI, WHTR, kol yağ alanı ve kas alanını hesaplar
- ✅ Beslenme ihtiyaçlarını Harris-Benedict formülü ile hesaplar
- ✅ Yaşa ve cinsiyete uygun mikro besin önerileri sunar
- ✅ Tarihsel veri ile trend analizi yapılmasını sağlar

---

## 🧮 Ana Algoritmalar

### 1. **Yaş Hesaplama Algoritması** (`calculateAge()`)

**Amaç:** Doğum tarihi → Dönemlendirilmiş Yaş (13, 13.6, 14, 14.6, ...)

```
Giriş: Doğum Tarihi (ISO format)
Çıkış: Sayısal Yaş (0.1 ondalık kesinlik)

Adımlar:
1. Doğum tarihi ile şimdiki tarih arasındaki milisaniye farkını hesapla
2. Farkı 365.25 yılla böl (artık yılları hesaba katan değer)
3. Ondalık kısmı kontrol et:
   - < 0.3 : Math.floor(yaş)           // Dönem başı
   - 0.3-0.8: Math.floor(yaş) + 0.6   // Dönem ortası
   - > 0.8 : Math.floor(yaş) + 1       // Dönem sonu
```

**Neden Dönemlendirilmiş Yaş?**
- Persentil veriler yaş aralıklarına göre sınıflandırılmıştır
- Adolesanlar 6 ayda belirgin değişim gösterir
- Daha hassas ve klinik açıdan uygun sonuçlar verir

---

### 2. **Antropometrik Ölçüm Hesaplama Algoritması**

#### A. **BMI (Body Mass Index)**
```
BMI = weight(kg) / (height(m))²

Örn: 65 kg / (1.65 m)² = 23.86 kg/m²
```

#### B. **WHTR (Waist-to-Height Ratio)**
```
WHTR = waist(cm) / height(cm)

Örn: 75 / 165 = 0.45
İdeal: < 0.5
```

#### C. **Kol Yağ Alanı (AFA)**
```
AFA = (Kol_Çevresi × Triceps_mm/10 / 2) - (π × (Triceps_cm)² / 4)

Örn: (28 × 1.5 / 2) - (3.1416 × 2.25 / 4) ≈ 19.23 cm²
```

#### D. **Kol Kas Alanı (AMA)**
```
innerTerm = Kol_Çevresi - (π × Triceps_cm)
AMA = ((innerTerm)² / (4 × π)) - C

C = 10 (Erkek) veya 6.5 (Kız)

Örn (Erkek): ((23.29)² / 12.566) - 10 ≈ 33.14 cm²
```

---

### 3. **Persentil Analiz Algoritması** (`analyzePercentile()`)

**Amaç:** Ölçüm değeri → Persentil Durum

```
Giriş: Ölçüm Değeri, Referans Veri Dizisi, Persentil Anahtarları
Çıkış: { text, status, percentileValue }

Adımlar:
1. Değer referans verilere karşılaştırılır:
   - Değer < Min → < 3. Persentil (CRİTİK)
   - Değer > Max → > 95. Persentil (CRİTİK)
   - Min ≤ Değer ≤ Max → İki persentil arası

2. Durum Belirleme:
   - CRİTİK: ≤ 3. persentil VEYA ≥ 95. persentil
   - UYARI: 5-15. veya 85-95. persentil
   - İDEAL: 15-85. persentil
```

**Kullanılan Standartlar:**
- **BMI**: WHO Persentilleri (3, 5, 15, 50, 85, 95, 97)
- **Boy**: WHO Persentilleri (3, 5, 15, 50, 85, 95, 97)
- **Kilo**: NCHS Persentilleri (5, 15, 50, 85, 95)
- **Triceps, Kol, Yağ, Kas**: NCHS (5, 10, 15, 25, 50, 75, 85, 90, 95)

**Referans Veri Seçimi:**
```
getSafeData(age, dataset):
1. Dataset formatı kontrol et:
   - Tam sayı (13, 14, 15): Yaş grubu
   - Ondalık (13.0, 13.6, 14.0): Tam yaş
2. En yakın yaş/yaş grubunu bul
3. Karşılık gelen referans veriyi döndür
```

---

### 4. **Beslenme İhtiyacı Hesaplama Algoritması** (`calculateNutritionNeeds()`)

#### Adım 1: Düzeltilmiş Ağırlık
```
Amaç: Aşırı kilolu çocuklarda referans ağırlık tahmini

Katsayı = CORRECTED_WEIGHT_COEFFICIENTS[yaş][cinsiyet]
Düzeltilmiş_Ağırlık = Katsayı × Boy(m)

Örn (Erkek, 14.6 yaş, 165 cm):
Katsayı = 19.4
Düzeltilmiş_Ağırlık = 19.4 × 1.65 = 32.01 kg
```

#### Adım 2: Mobil Ağırlık (BMI Kritik İse)
```
Mobil_Ağırlık = (0.75 × Gerçek_Ağırlık) + (0.25 × Düzeltilmiş_Ağırlık)

%75: Mevcut vücut durumu
%25: Antropometrik referans

Örn: (0.75 × 65) + (0.25 × 32.01) = 57.755 kg
```

#### Adım 3: Bazal Metabolik Hız (BMR) - Harris-Benedict
```
PAL (Fiziksel Aktivite Seviyesi) = 1.6 (Orta aktivite)

Erkek: TEE = (17.5 × Ağırlık + 651) × PAL
Kız: TEE = (12.2 × Ağırlık + 746) × PAL

Örn (Erkek, 60 kg):
TEE = (17.5 × 60 + 651) × 1.6
    = 1701 × 1.6
    = 2721.6 kcal/gün
```

#### Adım 4: Makro Besinler
```
Enerji Dağılımı:
- Protein: %18 → (TEE × 0.18) / 4 gram
- Karbonhidrat: %52 → (TEE × 0.52) / 4 gram
- Yağ: %30 → (TEE × 0.30) / 9 gram

Örn (TEE = 2721.6 kcal):
- Protein: (2721.6 × 0.18) / 4 = 122.47 g
- Karbonhidrat: (2721.6 × 0.52) / 4 = 353.81 g
- Yağ: (2721.6 × 0.30) / 9 = 90.72 g
```

#### Adım 5: Mikro Besinler
```
Yaşa göre:

13.0-13.9 yaş:
- Su: Erkek 2.1 L / Kız 1.9 L
- Lif: 19 g

14.0-14.9 yaş:
- Su: Erkek 2.5 L / Kız 2.0 L
- Lif: 19 g

15.0+ yaş:
- Su: Erkek 2.5 L / Kız 2.0 L
- Lif: 21 g

Vitaminler & Mineraller: Yaş grubuna göre
(A, D, E, K, C, B grubu, Kalsiyum, Demir, Çinko, vb.)
```

---

### 5. **Beslenme Veri Seçimi** (`getNutritionData()`)

```
Yaş Grubu Eşleştirmesi:
- 13.0 ≤ yaş < 15.0: '13-14.6' grubu
- yaş ≥ 15.0: '15-17.6' grubu

Özel Durum:
- Riboflavin: 
  - 13-13.6 yaş: 1.4 mg
  - 14-14.6 yaş: 1.6 mg
  - 15-17.6+ yaş: 1.6 mg

Not: 18+ yaş için 15-17.6 grubu kullanılır (PDF'de 18+ verisi yok)
```

---

## 📊 Veri Yapıları

### Temel Tipler (`types.ts`)

```typescript
interface Student {
  id: number;
  name: string;
  dob: string;          // ISO date: "2010-06-15"
  gender: 'male' | 'female';
  measurements: Measurement[];
}

interface Measurement {
  date: string;         // Ölçüm tarihi
  weight: number;       // kg
  height: number;       // cm
  bmi: number;          // Hesaplanan
  measurements: MeasurementRaw;
  calculatedStats?: {
    whtr: number;
    armFatArea: number;
    armMuscleArea: number;
  }
}

interface MeasurementRaw {
  waist: number;        // cm
  tricepsMM: number;    // mm
  armCirc: number;      // cm
}

interface PercentileResult {
  text: string;         // "45-50. Persentil" gibi
  status: 'critical' | 'warning' | 'ideal' | 'unknown';
  percentileValue: number;
}

interface NutritionNeeds {
  energy: number;       // kcal
  carb: number;         // gram
  fat: number;          // gram
  protein: number;      // gram
  water: number;        // litre
  fiber: number;        // gram
}
```

---

## 📁 Dosya Yapısı

```
Fit-Genc-Cocuk-Saglik-ve-Beslenme-Takip-Uygulamasi/
├── App.tsx                        # Ana uygulama komponenti
├── index.tsx                      # React entry point
├── types.ts                       # TypeScript tipler
├── constants.ts                   # Persentil veriler & katsayılar
├── utils.ts                       # Algoritma fonksiyonları
├── package.json                   # Bağımlılıklar
├── tsconfig.json                  # TypeScript ayarları
├── vite.config.ts                 # Vite build ayarları
├── capacitor.config.ts            # Capacitor (Android) config
├── ALGORITMA_ŞEMALARI.puml        # Ana algoritma akış şeması
├── PERCENTIL_ANALIZ_ALGORITMA.puml # Persentil detaylı akışı
├── BESLENME_HESAPLAMA_ALGORITMA.puml # Beslenme detaylı akışı
├── YAŞ_HESAPLAMA_ALGORITMA.puml   # Yaş hesaplama detaylı akışı
├── ANTROPOMETRIK_OLCUM_ALGORITMA.puml # Antropometrik detaylı akışı
├── GENEL_VERI_AKIŞI.puml          # Bileşen etkileşim şeması
└── android/                       # Android derleme yapısı
```

---

## 🔗 Akademik Referanslar

1. **WHO (Dünya Sağlık Örgütü)**
   - Growth Reference Data for 5-19 years
   - BMI, Boy, Kilo Persentilleri

2. **NCHS (National Center for Health Statistics - ABD)**
   - Anthropometric Reference Data for Children and Adults
   - Triceps, Kol Çevresi, Yağ ve Kas Alanı Persentilleri

3. **Türkiye Beslenme Rehberi (2022) - Tüber**
   - Harris-Benedict Formülü ile TEE Hesaplaması
   - Makro-Mikro Besin Önerileri
   - Cinsiyete-Yaşa Göre Su ve Lif İhtiyacı
   - Düzeltilmiş Ağırlık Katsayıları

4. **TÜBITAK Başvuru Dokümanları**
   - Proje detayları ve düzeltme raporları
   - (docs/tübitak_proje_düzeltme_raporu.txt)

---

## 🛠️ Kullanılan Teknolojiler

- **Frontend**: React 19.2, TypeScript 5.8
- **Visualize**: Recharts 3.6 (Line & Bar Charts)
- **Icons**: Lucide React 0.561
- **Build**: Vite 6.2
- **Mobile**: Capacitor 8.0 (Android)
- **Styling**: Tailwind CSS
- **Storage**: Browser LocalStorage

---

## 💡 Ana Özellikler

### Fonksiyonelite
1. ✅ Çok öğrencili profil yönetimi
2. ✅ Antropometrik ölçüm giriş sistemi
3. ✅ Persentil tabanlı değerlendirme
4. ✅ Beslenme ihtiyacı hesaplama
5. ✅ Tarihsel veri ve trend analizi
6. ✅ Detaylı bilgilendirme modalleri
7. ✅ Mobil uyumlu arayüz

### Veri Güvenliği
- LocalStorage'da kişi bazlı bilgiler
- Üzeri yazılabilir veri yapısı
- Silme işlemleri için onay mekanizması

### Standartlara Uygunluk
- WHO/NCHS persentil standartları
- Türkiye Beslenme Rehberi (2022)
- Harris-Benedict metabolik formül
- Age-specific PAL değerleri

---

## 📈 Algoritma Karmaşıklığı

| Algoritma | Zaman | Mekan | Notlar |
|-----------|-------|--------|--------|
| Yaş Hesaplama | O(1) | O(1) | Sabit operasyon |
| Antropometrik | O(1) | O(1) | Sabit formüller |
| Persentil Analiz | O(n) | O(1) | n = persentil sayısı (7-9) |
| Beslenme Hesaplama | O(1) | O(1) | Sabit işlemler |
| Veri Seçimi | O(k) | O(1) | k = yaş/veri setinde key sayısı |

---

## 🔍 Hata Yönetimi

```typescript
// Yaş doğrulaması
if (age < 13 || age > 18) {
  alert("Bu uygulama sadece 13-18 yaş arası içindir.");
  return;
}

// Veri eksikliği
if (!dataArray || !keys) 
  return { text: "Veri Yok", status: 'unknown', percentileValue: -1 };

// Güvenli veri erişimi
const safeData = getSafeData(age, dataset);
```

---

## 📞 PlantUML Şemaları

Aşağıdaki .puml dosyaları PlantUML formatında detaylı algoritmalar içerir:

1. **ALGORITMA_ŞEMALARI.puml** - Ana sistem bileşenleri
2. **PERCENTIL_ANALIZ_ALGORITMA.puml** - Persentil akış diyagramı
3. **BESLENME_HESAPLAMA_ALGORITMA.puml** - Beslenme hesaplama detayları
4. **YAŞ_HESAPLAMA_ALGORITMA.puml** - Yaş hesaplama akışı
5. **ANTROPOMETRIK_OLCUM_ALGORITMA.puml** - Ölçüm hesaplama formülleri
6. **GENEL_VERI_AKIŞI.puml** - Bileşen etkileşimi

Bu dosyaları PlantUML editörlerde (online veya VS Code extension) açarak görselleştirebilirsiniz.

---

*Son Güncelleme: 18 Aralık 2024*
*Versiyon: 1.0*
