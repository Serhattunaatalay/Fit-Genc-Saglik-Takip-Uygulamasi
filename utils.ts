import { NUTRITION_DATA, PHY_DATA, FIBER_WATER_DATA, CORRECTED_WEIGHT_COEFFICIENTS, SAFE_WEIGHT_LOSS_PER_WEEK_KG, SAFE_WEIGHT_LOSS_PER_MONTH_KG, SAFE_WEIGHT_LOSS_PER_DAY_KG } from './constants';
import { Gender, NutritionNeeds, PercentileResult, NutritionDataGroup, Measurement } from './types';

export function calculateAge(dobString: string): number {
    const dob = new Date(dobString);
    const now = new Date();
    const diffMs = now.getTime() - dob.getTime();
    const rawAge = diffMs / (1000 * 60 * 60 * 24 * 365.25);
    
    const floorAge = Math.floor(rawAge);
    const decimal = rawAge - floorAge;
    
    if (decimal < 0.3) {
        return floorAge;
    } else if (decimal < 0.8) {
        return floorAge + 0.6;
    } else {
        return floorAge + 1;
    }
}

export function getSafeData(age: number, dataset: Record<string, number[]>) {
    if (!dataset) return null;
    const keys = Object.keys(dataset).sort((a, b) => parseFloat(a) - parseFloat(b));
    
    // Key formatını kontrol et: '13', '14' gibi tam sayılar mı yoksa '13.0', '13.6' gibi ondalıklı mı?
    const firstKey = keys[0];
    const isAgeRange = !firstKey.includes('.'); // '13', '14' gibi tam sayılar → yaş aralığı
    
    if (isAgeRange) {
        // Yaş aralıkları için: '13' → 13.0-13.9, '14' → 14.0-14.9, vb.
        // Math.floor(age) ile yaş grubunu bul
        const ageGroup = Math.floor(age);
        const ageGroupKey = ageGroup.toString();
        
        // Eğer key varsa kullan, yoksa en yakın key'i bul
        if (dataset[ageGroupKey]) {
            return { key: ageGroupKey, values: dataset[ageGroupKey] };
        }
        
        // Key yoksa (örneğin 18+ yaş için), en yakın key'i bul
        let closestKey = keys[keys.length - 1]; // Varsayılan: en büyük yaş
        let minDiff = Math.abs(ageGroup - parseFloat(keys[keys.length - 1]));
        for (let i = 0; i < keys.length; i++) {
            const diff = Math.abs(ageGroup - parseFloat(keys[i]));
            if (diff < minDiff) {
                minDiff = diff;
                closestKey = keys[i];
            }
        }
        return { key: closestKey, values: dataset[closestKey] };
    } else {
        // Tam yaşlar için: '13.0', '13.6', '14.0', vb. → En yakın yaşı bul
    let closestKey = keys[0];
    let minDiff = Math.abs(age - parseFloat(keys[0]));
    for (let i = 1; i < keys.length; i++) {
        const diff = Math.abs(age - parseFloat(keys[i]));
        if (diff < minDiff) {
            minDiff = diff;
            closestKey = keys[i];
        }
    }
    return { key: closestKey, values: dataset[closestKey] };
    }
}

export function analyzePercentile(value: number, dataArray: number[], keys: number[]): PercentileResult {
    if (!dataArray || !keys) return { text: "Veri Yok", status: 'unknown', percentileValue: -1 };
    
    let percentileValue = -1;
    
    if (value < dataArray[0]) percentileValue = 1;
    else if (value > dataArray[dataArray.length - 1]) percentileValue = 99;
    else {
        for (let i = 0; i < dataArray.length - 1; i++) { 
            if (value >= dataArray[i] && value <= dataArray[i + 1]) {
                percentileValue = (keys[i] + keys[i+1]) / 2;
                break;
            }
        }
    }

    let text = "";
    let status: PercentileResult['status'] = 'unknown';

    if (value < dataArray[0]) {
        text = `< ${keys[0]}. Persentil (Çok Düşük)`;
        status = 'critical';
    } else if (value > dataArray[dataArray.length - 1]) {
        text = `> ${keys[keys.length - 1]}. Persentil (Çok Yüksek)`;
        status = 'critical';
    } else {
        for (let i = 0; i < dataArray.length - 1; i++) { 
            if (value >= dataArray[i] && value <= dataArray[i + 1]) {
                text = `${keys[i]}. - ${keys[i+1]}. Persentil`;
                const pStart = keys[i];
                const pEnd = keys[i+1];
                
                // PDF'ye göre: BMI ≤3 veya ≥95 persentil → critical
                if (pStart <= 3 || pStart >= 95) status = 'critical';
                else if ((pStart >= 5 && pEnd <= 15) || (pStart >= 85 && pEnd <= 95)) status = 'warning';
                else status = 'ideal';
                break;
            }
        }
    }
    return { text, status, percentileValue };
}

export function calculateNutritionNeeds(
    gender: Gender, 
    age: number, 
    currentWeight: number, 
    heightM: number, 
    bmiStatus: PercentileResult['status']
): NutritionNeeds {
    let energy;
    
    // PDF'ye göre düzeltilmiş ağırlık: Yaş bazlı katsayı × BOY (metre)
    // En yakın yaş grubunu bul
    const ageKeys = Object.keys(CORRECTED_WEIGHT_COEFFICIENTS).map(k => parseFloat(k)).sort((a, b) => a - b);
    let closestAgeKey = ageKeys[ageKeys.length - 1]; // Varsayılan: en büyük yaş
    let minDiff = Math.abs(age - ageKeys[ageKeys.length - 1]);
    
    for (const ageKey of ageKeys) {
        const diff = Math.abs(age - ageKey);
        if (diff < minDiff) {
            minDiff = diff;
            closestAgeKey = ageKey;
        }
    }
    
    const ageKeyStr = closestAgeKey.toFixed(1);
    const coeff = CORRECTED_WEIGHT_COEFFICIENTS[ageKeyStr];
    const correctedWeightCoef = gender === 'male' ? coeff.male : coeff.female;
    
    // PDF'de: Düzeltilmiş Ağırlık = Katsayı × BOY (metre cinsinden)
    const correctedWeight = correctedWeightCoef * heightM;
    
    // Mobil ağırlık: (0.75 × girilen ağırlık) + (0.25 × düzeltilmiş ağırlık)
    const mobileWeight = (0.75 * currentWeight) + (0.25 * correctedWeight);
    const isBmiCritical = bmiStatus === 'critical';
    const usedWeight = isBmiCritical ? mobileWeight : currentWeight;
    
    // PDF'ye göre PAL sabit 1.6 (fiziksel aktivite seviyesi)
    const pal = 1.6;
    
    if (gender === 'male') { 
        energy = (17.5 * usedWeight + 651) * pal; 
    } else { 
        energy = (12.2 * usedWeight + 746) * pal; 
    }

    // PDF'ye göre protein hesaplaması: (Enerji × 0.18) / 4
    const proteinNeed = (energy * 0.18) / 4;
    
    // PDF'den alınan sabit değerler (Tüber, 2022) - Cinsiyete ve yaşa göre farklı
    // Erkek: 13-13.6 → 19g/2.1L, 14-14.6 → 19g/2.5L, 15+ → 21g/2.5L
    // Kız: 13-13.6 → 19g/1.9L, 14-14.6 → 19g/2.0L, 15+ → 21g/2.0L
    let waterNeedLiters = 2.5;
    let fiberNeed = 21;
    
    if (age >= 13.0 && age < 14.0) {
        fiberNeed = 19;
        waterNeedLiters = gender === 'male' ? 2.1 : 1.9;
    } else if (age >= 14.0 && age < 15.0) {
        fiberNeed = 19;
        waterNeedLiters = gender === 'male' ? 2.5 : 2.0;
    } else if (age >= 15.0) {
        fiberNeed = 21;
        waterNeedLiters = gender === 'male' ? 2.5 : 2.0;
    }
    
    return {
        energy: energy,
        carb: (energy * 0.52) / 4,
        fat: (energy * 0.30) / 9,
        protein: proteinNeed,
        water: waterNeedLiters,
        fiber: fiberNeed
    };
}

export function getNutritionData(gender: Gender, age: number): NutritionDataGroup | null {
    // PDF'deki yaş gruplarına göre birebir eşleştirme (Tüber, 2022):
    // 13-14.6 yaş grubu: 13, 13.6, 14, 14.6 → '13-14.6'
    // 15-17.6 yaş grubu: 15, 15.6, 16, 16.6, 17, 17.6 → '15-17.6'
    // 18+ yaş için en yakın grup (15-17.6) kullanılıyor (PDF'de 18+ verisi yok)
    const dataSet = NUTRITION_DATA[gender];
    
    let nutritionData: NutritionDataGroup;
    
    if (age >= 13.0 && age < 15.0) {
        nutritionData = JSON.parse(JSON.stringify(dataSet['13-14.6'])); // Deep copy
        // Riboflavin: 13-13.6 için 1.4 mg, 14-14.6 için 1.6 mg (PDF'ye göre)
        const riboflavinIndex = nutritionData.vitamins.findIndex(v => v.n === "Vitamin B2 (Riboflavin)");
        if (riboflavinIndex !== -1) {
            if (age >= 14.0) {
                nutritionData.vitamins[riboflavinIndex].v = "1.6 mg"; // 14-14.6 yaş için
            } else {
                nutritionData.vitamins[riboflavinIndex].v = "1.4 mg"; // 13-13.6 yaş için
            }
        }
        return nutritionData;
    }
    
    // 15+ yaş için (PDF'de 18+ verisi olmadığı için en yakın grup kullanılıyor)
    return dataSet['15-17.6'];
}

export function getStatusColor(status: PercentileResult['status'], type: 'bg' | 'text' | 'badge' = 'badge'): string {
    if (type === 'badge') {
        switch (status) {
            case 'critical': return 'bg-red-100 text-red-700 border-red-200';
            case 'warning': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'ideal': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-100 text-slate-600';
        }
    }
    return '';
}

export interface WeightChangeWarning {
    weeklyLossKg: number;
    monthlyLossKg: number;
    dailyLossKg: number;
    isWeeklyUnsafe: boolean;
    isMonthlyUnsafe: boolean;
    isDailyUnsafe: boolean;
    message: string;
}

export function computeWeightChangeWarning(measurements: Measurement[]): WeightChangeWarning {
    if (!measurements || measurements.length < 2) {
        return { weeklyLossKg: 0, monthlyLossKg: 0, dailyLossKg: 0, isWeeklyUnsafe: false, isMonthlyUnsafe: false, isDailyUnsafe: false, message: '' };
    }

    const sorted = [...measurements].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const msDiff = new Date(last.date).getTime() - new Date(first.date).getTime();
    let days = msDiff / (1000 * 60 * 60 * 24);
    // Eğer ölçümler aynı gün olarak kaydedildiyse (msDiff === 0), aynı-gün değişimini tespit etmek için
    // günlük hesaplamada 1 gün kabul ediyoruz (kullanıcı aynı gün içinde birden fazla ölçüm kaydetmiş olabilir).
    if (days <= 0) {
        days = 1; // aynı gün veya zaman bilgisi yoksa günlük bazda hesapla
    }

    const kgChange = last.weight - first.weight; // pozitif: kilo arttı, negatif: kilo azaldı
    const ratePerDay = kgChange / days;
    const dailyLossKg = Math.max(0, -ratePerDay);
    const weeklyLossKg = Math.max(0, -ratePerDay * 7);
    const monthlyLossKg = Math.max(0, -ratePerDay * 30);

    const isDailyUnsafe = dailyLossKg >= SAFE_WEIGHT_LOSS_PER_DAY_KG;
    const isWeeklyUnsafe = weeklyLossKg >= SAFE_WEIGHT_LOSS_PER_WEEK_KG;
    const isMonthlyUnsafe = monthlyLossKg >= SAFE_WEIGHT_LOSS_PER_MONTH_KG;

    let message = '';
    if (isDailyUnsafe || isWeeklyUnsafe || isMonthlyUnsafe) {
        const parts: string[] = [];
        if (isDailyUnsafe) parts.push(`günlük ~${dailyLossKg.toFixed(2)} kg`);
        if (isWeeklyUnsafe) parts.push(`haftada ~${weeklyLossKg.toFixed(2)} kg`);
        if (isMonthlyUnsafe) parts.push(`ayda ~${monthlyLossKg.toFixed(2)} kg`);
        message = `Uyarı: ${parts.join(', ')} kayıp tespit edildi. Bu hız sağlıksız olabilir; lütfen sağlık uzmanına danışın.`;
    }

    return { weeklyLossKg, monthlyLossKg, dailyLossKg, isWeeklyUnsafe, isMonthlyUnsafe, isDailyUnsafe, message };
}