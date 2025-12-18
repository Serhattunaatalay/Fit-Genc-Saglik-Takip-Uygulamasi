# 🏃 Fit Genç - Ergen Sağlık ve Beslenme Takip Uygulaması

<div align="center">

![Fit Genç](https://img.shields.io/badge/Fit-Genç-indigo?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite)

**13-17 yaş arası ergenler için kapsamlı vücut analizi ve beslenme rehberi**

[Özellikler](#-özellikler) • [Kurulum](#-kurulum) • [Kullanım](#-kullanım) • [Teknolojiler](#-teknolojiler)

</div>

---

## 📋 İçindekiler

- [Hakkında](#-hakkında)
- [Özellikler](#-özellikler)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Teknolojiler](#-teknolojiler)
- [Proje Yapısı](#-proje-yapısı)
- [Formüller ve Hesaplamalar](#-formüller-ve-hesaplamalar)
- [Referanslar](#-referanslar)
- [Lisans](#-lisans)

---

## 🎯 Hakkında

**Fit Genç**, 13-18 yaş arası ergenler için geliştirilmiş kapsamlı bir sağlık ve beslenme takip uygulamasıdır. Uygulama, WHO (Dünya Sağlık Örgütü), TÜBER ve NCHS (National Center for Health Statistics) referans değerlerine göre persentil analizleri yaparak, ergenlerin büyüme ve gelişim durumlarını değerlendirir.

### Temel Amaç

- Ergenlerin antropometrik ölçümlerini (boy, kilo, BMI, bel çevresi, triseps deri kıvrımı, kol çevresi) kaydetmek
- Bu ölçümlere göre persentil analizleri yaparak büyüme durumunu değerlendirmek
- Yaş, cinsiyet ve fiziksel duruma göre kişiselleştirilmiş beslenme ihtiyaçlarını hesaplamak
- Zaman içindeki değişimleri görselleştirmek ve takip etmek

---

## ✨ Özellikler

### 📊 Vücut Analizi

- **Antropometrik Ölçümler**
  - Boy uzunluğu (cm)
  - Vücut ağırlığı (kg)
  - Beden Kitle İndeksi (BMI)
  - Bel çevresi (cm)
  - Bel/Boy oranı (WHtR)
  - Triseps deri kıvrım kalınlığı (mm)
  - Üst orta kol çevresi (cm)
  - Üst orta kol yağ alanı (cm²)
  - Üst orta kol kas alanı (cm²)

- **Persentil Analizleri**
  - WHO ve NCHS referans değerlerine göre persentil hesaplama
  - Yaş ve cinsiyete özel persentil tabloları
  - Kritik durum tespiti (≤3. persentil veya ≥95. persentil)
  - Görsel durum göstergeleri (İdeal, Dikkat, Kritik)

### 🥗 Beslenme Raporu

- **Makro Besin Öğeleri**
  - Günlük enerji ihtiyacı (kcal)
  - Protein ihtiyacı (g) - Enerji bazlı hesaplama (%18)
  - Karbonhidrat ihtiyacı (g)
  - Yağ ihtiyacı (g)
  - Su ihtiyacı (L) - Yaş bazlı
  - Lif ihtiyacı (g) - Yaş bazlı

- **Mikro Besin Öğeleri**
  - Vitaminler (A, D, E, K, C, B1, B2, B3, B6, B9, B12, Biotin, Pantotenik Asit)
  - Mineraller (Kalsiyum, Demir, Bakır, Magnezyum, Fosfor, Potasyum, Selenyum, Çinko, İyot, Flor, Manganez)
  - Besin kaynakları önerileri

### 📈 Takip ve Görselleştirme

- **Geçmiş Analizler**
  - Tüm ölçümlerin kronolojik listesi
  - Detaylı sonuç görüntüleme
  - Zaman içindeki değişim grafikleri
  - Ortalama değerlerle karşılaştırma

- **Görselleştirmeler**
  - İnteraktif grafikler (Recharts)
  - Persentil durum kartları
  - Renk kodlu durum göstergeleri

### 👥 Öğrenci Yönetimi

- Öğrenci profili oluşturma
- Birden fazla öğrenci takibi
- Ölçüm geçmişi yönetimi
- Veri silme ve düzenleme

---

## 🚀 Kurulum

### Gereksinimler

- **Node.js** (v18 veya üzeri)
- **npm** veya **yarn**

### Adımlar

1. **Projeyi klonlayın**
   ```bash
   git clone <repository-url>
   cd fit-genç
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Geliştirme sunucusunu başlatın**
   ```bash
   npm run dev
   ```

4. **Tarayıcıda açın**
   ```
   http://localhost:3000
   ```

### Build

Üretim için build almak için:

```bash
npm run build
```

Build çıktısı `dist` klasöründe oluşturulur.

---

## 📖 Kullanım

### 1. Öğrenci Ekleme

1. Ana sayfada "Yeni Öğrenci Ekle" butonuna tıklayın
2. Öğrenci bilgilerini girin:
   - Ad Soyad
   - Doğum Tarihi
   - Cinsiyet
3. "Kaydet" butonuna tıklayın

### 2. Ölçüm Yapma

1. Öğrenci listesinden öğrenciyi seçin
2. "Ölçüm Yap" butonuna tıklayın
3. Ölçüm formunu doldurun:
   - Ölçüm Tarihi
   - Boy (cm)
   - Vücut Ağırlığı (kg)
   - Bel Çevresi (cm)
   - Triseps Deri Kıvrım Kalınlığı (mm)
   - Üst Orta Kol Çevresi (cm)
4. "Hesapla" butonuna tıklayın

### 3. Sonuçları Görüntüleme

Ölçüm sonrası otomatik olarak detaylı analiz sayfası açılır:

- **Özet Kartlar**: BMI, Kilo, Bel/Boy Oranı, Yaş
- **Detaylı Vücut Analizi**: Tüm ölçümlerin persentil analizleri
- **Beslenme Raporu**: Makro ve mikro besin öğeleri ihtiyaçları
- **Görselleştirmeler**: Grafikler ve karşılaştırmalar

### 4. Geçmiş Analizler

1. Öğrenci listesinden öğrenciyi seçin
2. "Geçmiş Analizler" butonuna tıklayın
3. İstediğiniz ölçümün satırına tıklayarak detayları görüntüleyin

---

## 🛠 Teknolojiler

### Frontend Framework
- **React 19.2.3** - UI kütüphanesi
- **TypeScript 5.8** - Tip güvenliği
- **Vite 6.2** - Build tool ve dev server

### UI Kütüphaneleri
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - İkon kütüphanesi
- **Recharts** - Grafik ve görselleştirme

### Veri Yönetimi
- **localStorage** - Yerel veri saklama
- **React Hooks** - State yönetimi

### Referans Veriler
- **WHO Growth Standards** - Boy, kilo, BMI persentilleri
- **NCHS Data** - Triseps, kol çevresi, yağ/kas alanı persentilleri
- **Tüber 2022** - Beslenme referans değerleri

---

## 📁 Proje Yapısı

```
fit-genç/
├── src/
│   ├── App.tsx              # Ana uygulama bileşeni
│   ├── types.ts             # TypeScript tip tanımlamaları
│   ├── constants.ts         # Sabit veriler (persentil tabloları, besin değerleri)
│   ├── utils.ts             # Yardımcı fonksiyonlar (hesaplamalar, analizler)
│   ├── index.tsx            # Uygulama giriş noktası
│   └── index.html           # HTML şablonu
├── docs/                    # Referans PDF'leri ve dokümantasyon
├── package.json             # Proje bağımlılıkları
├── tsconfig.json            # TypeScript yapılandırması
├── vite.config.ts          # Vite yapılandırması
└── README.md               # Bu dosya
```

---

## 🧮 Formüller ve Hesaplamalar

### Beden Kitle İndeksi (BMI)
```
BMI = Ağırlık (kg) / [Boy (m)]²
```

### Bel/Boy Oranı (WHtR)
```
WHtR = Bel Çevresi (cm) / Boy (cm)
```
**Sınıflandırma:**
- < 0.4: Dikkat
- 0.4-0.5: Uygun
- 0.5-0.6: Eylem düşün
- > 0.6: Eyleme Geç

### Üst Orta Kol Yağ Alanı
```
Yağ Alanı = (Kol Çevresi × Triseps / 2) - (π × (Triseps)² / 4)
```

### Üst Orta Kol Kas Alanı
```
Kas Alanı = [(Kol Çevresi - π × Triseps)² / (4 × π)] - Sabit
```
Sabit değerler: Erkek = 10, Kız = 6.5

### Enerji İhtiyacı

**Normal Durum (BMI 3-95 persentil arası):**
- Erkek: `(17.5 × Ağırlık + 651) × 1.6`
- Kız: `(12.2 × Ağırlık + 746) × 1.6`

**Kritik Durum (BMI ≤3 veya ≥95 persentil):**
- Mobil Ağırlık = `(0.75 × Girilen Ağırlık) + (0.25 × Düzeltilmiş Ağırlık)`
- Düzeltilmiş Ağırlık = `Yaş Bazlı Katsayı × Boy (m)`
- Enerji hesaplaması mobil ağırlık ile yapılır

### Protein İhtiyacı
```
Protein (g) = (Enerji × 0.18) / 4
```

### Persentil Analizi
- WHO referans değerleri: Boy, Kilo, BMI
- NCHS referans değerleri: Triseps, Kol Çevresi, Yağ/Kas Alanı
- Yaş ve cinsiyete özel persentil tabloları kullanılır

---

## 📚 Referanslar

Uygulama aşağıdaki bilimsel kaynaklara dayanmaktadır:

- **WHO Multicentre Growth Reference Study Group** (2006, 2007)
- **National Center for Health Statistics (NCHS)**
- **Tüber, 2022** - Beslenme referans değerleri
- **Ashwell & Hsieh, 2005** - Bel/Boy oranı çalışması

Detaylı kaynakça listesi uygulama içinde "Kaynakça" bölümünde bulunmaktadır.

---

## 📝 Notlar

- Uygulama **13-17 yaş arası** ergenler için tasarlanmıştır
- Tüm hesaplamalar **WHO ve NCHS** referans değerlerine göre yapılmaktadır
- Veriler **localStorage**'da saklanır (tarayıcı bazlı)
- Fiziksel aktivite seviyesi **sabit 1.6 (PAL)** olarak kullanılmaktadır

---

## 🤝 Katkıda Bulunma

Bu proje açık kaynaklıdır ve katkılarınızı bekliyoruz. Lütfen:

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

---

## 📄 Lisans

Bu proje özel bir lisans altındadır. Detaylar için lisans dosyasına bakınız.

---

## 👨‍💻 Geliştiriciler

- **Proje Ekibi** - Fit Genç Uygulaması

---

## 📞 İletişim

Sorularınız veya önerileriniz için lütfen issue açın.

---

<div align="center">

**⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın! ⭐**

Made with ❤️ for adolescent health

</div>
