# FIT GENÇ - TÜM FORMÜLLER

## 1. KOL YAĞ ALANI (AFA - Arm Fat Area)

```
C = (triceps_mm × kol_çevresi_cm) / 2
AFA = π × (triceps_mm)² / 4 - C
```

**Açıklama:**
- triceps: Triceps katlılığı (milimetre cinsinden)
- kol_çevresi: Üst kol çevresi (santimetre cinsinden)
- C: Düzeltme faktörü
- AFA: Kol yağ alanı (cm² cinsinden)

**Örnek:**
- Triceps: 8 mm
- Kol Çevresi: 26 cm
- C = (8 × 26) / 2 = 104
- AFA = π × 64 / 4 - 104 = 50.27 - 104 = -53.73 cm²

---

## 2. KOL KAS ALANI (AMA - Arm Muscle Area)

```
AMA = ((kol_çevresi_cm - π × triceps_mm)² / (4π)) - C
```

**Cinsiyet Sabitleri:**
```
Erkek:  C = 10
Kız:    C = 6.5
```

**Açıklama:**
- kol_çevresi: Üst kol çevresi (cm)
- triceps: Triceps katlılığı (mm)
- C: Cinsiyete göre sabit değer
- AMA: Kol kas alanı (cm² cinsinden)

**Erkek Örneği (C=10):**
- Kol Çevresi: 26 cm
- Triceps: 8 mm
- AMA = ((26 - π×8)² / (4π)) - 10
- AMA = ((26 - 25.13)² / 12.57) - 10
- AMA = 0.06 - 10 = -9.94 cm²

**Kız Örneği (C=6.5):**
- Kol Çevresi: 24 cm
- Triceps: 10 mm
- AMA = ((24 - π×10)² / (4π)) - 6.5
- AMA = ((24 - 31.42)² / 12.57) - 6.5
- AMA = 4.36 - 6.5 = -2.14 cm²

---

## 3. DÜZELTILMIŞ AĞIRLIK (Corrected Weight)

```
Düzeltilmiş Ağırlık = Katsayı × Boy(m)
```

**Katsayılar Tablosu (Yaş-Cinsiyet):**

| Yaş  | Erkek | Kız   |
|------|-------|-------|
| 13.0 | 18.2  | 18.8  |
| 13.6 | 18.6  | 19.2  |
| 14.0 | 19.0  | 19.6  |
| 14.6 | 19.4  | 19.9  |
| 15.0 | 19.8  | 20.2  |
| 15.6 | 20.1  | 20.5  |
| 16.0 | 20.5  | 20.7  |
| 16.6 | 20.8  | 20.9  |
| 17.0 | 21.1  | 21.0  |
| 17.6 | 21.4  | 21.2  |

**Açıklama:**
- Katsayı: Yaş ve cinsiyete göre belirlenmiş değer
- Boy: Öğrencinin boyu (metre cinsinden)
- Düzeltilmiş Ağırlık: Beslenme hesaplamasında kullanılan ağırlık

**Örnek:**
- Yaş: 14.0 (Erkek)
- Katsayı: 19.0
- Boy: 1.60 m
- Düzeltilmiş Ağırlık = 19.0 × 1.60 = 30.4 kg

---

## 4. MOBİL AĞIRLIQ (Mobile Weight)

```
Mobil Ağırlık = (0.75 × Gerçek Ağırlık) + (0.25 × Düzeltilmiş Ağırlık)
```

**Kullanım Kuralı:**
```
if BMI = Critical:
    Kullanılacak Ağırlık = Mobil Ağırlık
else:
    Kullanılacak Ağırlık = Gerçek Ağırlık
```

**Açıklama:**
- 0.75: Gerçek ağırlığa verilen ağırlık (75%)
- 0.25: Düzeltilmiş ağırlığa verilen ağırlık (25%)
- BMI Critical: BMI ≤3 veya ≥95 persentil

**Örnek:**
- Gerçek Ağırlık: 55 kg
- Düzeltilmiş Ağırlık: 30.4 kg
- BMI Durumu: Critical
- Mobil Ağırlık = (0.75 × 55) + (0.25 × 30.4)
- Mobil Ağırlık = 41.25 + 7.6 = 48.85 kg
- **Beslenme hesaplamasında kullanılacak: 48.85 kg**

---

## 5. YAŞ HESAPLAMA (Age Calculation)

```
rawAge = (şimdiki_tarih - doğum_tarihi) / (365.25 × 24 × 60 × 60 × 1000)

Decimal Dönemlendirilme:
if decimal < 0.3:
    Sonuç = floor(age)
else if 0.3 ≤ decimal < 0.8:
    Sonuç = floor(age) + 0.6
else if decimal ≥ 0.8:
    Sonuç = floor(age) + 1
```

**Açıklama:**
- rawAge: Ham yaş (ondalık sayı)
- decimal: Yaşın ondalık kısmı
- Sonuç: 13, 13.6, 14, 14.6, ..., 17.6 formatında

**Örnek:**
- Ham Yaş: 14.504
- Decimal: 0.504
- 0.3 ≤ 0.504 < 0.8 → **Sonuç: 14.6**

- Ham Yaş: 14.960
- Decimal: 0.960
- 0.960 ≥ 0.8 → **Sonuç: 15.0**

- Ham Yaş: 14.259
- Decimal: 0.259
- 0.259 < 0.3 → **Sonuç: 14.0**

---

## 6. BMI HESAPLAMA (Body Mass Index)

```
BMI = Ağırlık(kg) / Boy(m)²
```

**Persentil Aralıkları (WHO):**
```
3., 5., 15., 50., 85., 95., 97. Persentiller
```

**Durum Sınıflandırması:**
```
Critical:  BMI ≤3. veya ≥95. Persentil
Warning:   5.-15. veya 85.-95. Persentil
Ideal:     15.-85. Persentil
```

**Örnek:**
- Ağırlık: 55 kg
- Boy: 1.60 m
- BMI = 55 / (1.60)²
- BMI = 55 / 2.56 = 21.48

---

## 7. WHTR HESAPLAMA (Waist-to-Height Ratio)

```
WHTR = Bel Çevresi(cm) / Boy(cm)
```

**İdeal Değer:**
```
WHTR < 0.5 (İdeal)
```

**Persentil Aralıkları (NCHS):**
```
5., 10., 15., 25., 50., 75., 85., 90., 95. Persentiller
```

**Örnek:**
- Bel Çevresi: 72 cm
- Boy: 160 cm
- WHTR = 72 / 160 = 0.45 (İdeal)

---

## 8. HARRIS-BENEDICT FORMÜLÜ (TEE - Total Energy Expenditure)

```
ERKEK:
TEE = (17.5 × Ağırlık(kg) + 651) × PAL

KIZ:
TEE = (12.2 × Ağırlık(kg) + 746) × PAL

PAL = 1.6 (Orta Aktivite Seviyesi)
```

**Açıklama:**
- 17.5, 651, 12.2, 746: Harris-Benedict sabitleri
- Ağırlık: Kullanılacak ağırlık (gerçek veya mobil)
- PAL: Physical Activity Level (1.6 = Orta Aktivite)
- TEE: Günlük toplam enerji harcaması (kcal)

**Erkek Örneği:**
- Ağırlık: 48.85 kg (mobil)
- TEE = (17.5 × 48.85 + 651) × 1.6
- TEE = (854.88 + 651) × 1.6
- TEE = 1505.88 × 1.6 = 2409.40 kcal

**Kız Örneği:**
- Ağırlık: 48.85 kg (mobil)
- TEE = (12.2 × 48.85 + 746) × 1.6
- TEE = (596.01 + 746) × 1.6
- TEE = 1342.01 × 1.6 = 2147.22 kcal

---

## 9. MAKRO BESİNLER HESAPLAMA

```
Protein(g) = (TEE × 0.18) / 4

Karbohidrat(g) = (TEE × 0.52) / 4

Yağ(g) = (TEE × 0.30) / 9
```

**Dağılım Yüzdeleri:**
```
Protein:      %18
Karbohidrat:  %52
Yağ:          %30
```

**Açıklama:**
- TEE: Harris-Benedict ile hesaplanan günlük enerji
- 4: Protein ve Karbohidrat kalori değeri (kcal/g)
- 9: Yağ kalori değeri (kcal/g)

**Erkek Örneği (TEE=2409.40 kcal):**
- Protein = (2409.40 × 0.18) / 4 = 108.42 g
- Karbohidrat = (2409.40 × 0.52) / 4 = 313.22 g
- Yağ = (2409.40 × 0.30) / 9 = 80.31 g

**Kız Örneği (TEE=2147.22 kcal):**
- Protein = (2147.22 × 0.18) / 4 = 96.62 g
- Karbohidrat = (2147.22 × 0.52) / 4 = 279.24 g
- Yağ = (2147.22 × 0.30) / 9 = 71.57 g

---

## 10. SU VE LİF İHTİYACI (Fiber & Water Needs)

```
ERKEK:
13-13.6 yaş:  19g lif,  2.1L su
14-14.6 yaş:  19g lif,  2.5L su
15-17.6 yaş:  21g lif,  2.5L su

KIZ:
13-13.6 yaş:  19g lif,  1.9L su
14-14.6 yaş:  19g lif,  2.0L su
15-17.6 yaş:  21g lif,  2.0L su
```

**Kaynak:** Türkiye Beslenme Rehberi (Tüber, 2022)

---

## 11. MİKRO BESİNLER (Vitaminler ve Mineraller)

### VİTAMİNLER (13 adet)

**13-14.6 Yaş Grubu:**
```
Vitamin A:               600 mcg
Vitamin D:               15 mcg
Vitamin E:               13 mg
Vitamin K:               45 mcg
Vitamin B1 (Tiamin):     1.1 mg
Vitamin B2 (Riboflavin): 1.4 mg (13-13.6) / 1.6 mg (14-14.6)
Niasin (B3):             16 mg (Erkek) / 14 mg (Kız)
Vitamin B6:              1.4 mg
Vitamin B12:             3.5 mcg
Folat:                   270 mcg
Vitamin C:               70 mg
Biotin:                  35 mcg
Pantotenik Asit:         5 mg
```

**15-17.6 Yaş Grubu:**
```
Vitamin A:               750 mcg
Vitamin D:               15 mcg
Vitamin E:               13 mg
Vitamin K:               65 mcg
Vitamin B1 (Tiamin):     1.2 mg (Erkek) / 1.0 mg (Kız)
Vitamin B2 (Riboflavin): 1.6 mg
Niasin (B3):             16 mg (Erkek) / 14 mg (Kız)
Vitamin B6:              1.7 mg
Vitamin B12:             4 mcg
Folat:                   330 mcg
Vitamin C:               100 mg
Biotin:                  35 mcg
Pantotenik Asit:         5 mg
```

### MİNERALLER (11 adet)

**13-14.6 Yaş Grubu:**
```
Kalsiyum:    1150 mg
Fosfor:      640 mg
Magnezyum:   250 mg
Demir:       13 mg
Çinko:       10.7 mg (Erkek) / 10.7 mg (Kız)
İyot:        120 mcg
Bakır:       1.1 mg
Potasyum:    2700 mg
Selenyum:    55 mcg
Flor:        2.3 mg
Manganez:    2 mg
```

**15-17.6 Yaş Grubu:**
```
Kalsiyum:    1150 mg
Fosfor:      640 mg
Magnezyum:   250 mg
Demir:       13 mg
Çinko:       11.9 mg (Erkek) / 11.9 mg (Kız)
İyot:        130 mcg
Bakır:       1.1 mg
Potasyum:    3500 mg (Erkek) / 3500 mg (Kız)
Selenyum:    70 mcg
Flor:        2.8 mg
Manganez:    3 mg
```

---

## 12. PERSENTİL ANALİZİ (Percentile Analysis)

```
if değer < min_değer:
    Sonuç = 1. Persentil (Critical)

else if değer > max_değer:
    Sonuç = 99. Persentil (Critical)

else:
    Sonuç = (p_başlangıç + p_bitiş) / 2
```

**Durum Sınıflandırması:**
```
Critical:  Persentil ≤3 veya ≥95
Warning:   Persentil 5-15 veya 85-95
Ideal:     Persentil 15-85
```

**Referans Standartları:**
```
WHO:   7 Persentil (3, 5, 15, 50, 85, 95, 97)
NCHS:  9 Persentil (5, 10, 15, 25, 50, 75, 85, 90, 95)
```

---

## ÖZET TABLO

| Formül | Giriş | Çıkış | Kullanım |
|--------|-------|-------|----------|
| Yaş | Doğum Tarihi | 13-17.6 | Tüm hesaplamalarda |
| BMI | Kilo, Boy | Sayı | Mobil ağırlık kararı |
| Düzeltilmiş Ağırlık | Katsayı, Boy | kg | Mobil ağırlık hesapları |
| Mobil Ağırlık | Gerçek, Düzeltilmiş, BMI | kg | TEE hesaplaması |
| TEE | Ağırlık, Cinsiyet | kcal | Makro besin hesapları |
| Protein | TEE | g | Beslenme planı |
| Karbohidrat | TEE | g | Beslenme planı |
| Yağ | TEE | g | Beslenme planı |
| AFA | Triceps, Kol Çevresi | cm² | Vücut Bileşimi |
| AMA | Triceps, Kol Çevresi, Cinsiyet | cm² | Vücut Bileşimi |
