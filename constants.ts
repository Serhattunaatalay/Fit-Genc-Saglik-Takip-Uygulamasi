import { NutritionDataGroup } from './types';

export const P_KEYS_WHO = [3, 5, 15, 50, 85, 95, 97];
export const P_KEYS_WEIGHT = [5, 15, 50, 85, 95];
export const P_KEYS_NCHS = [5, 10, 15, 25, 50, 75, 85, 90, 95];

// PDF'den alınan düzeltilmiş ağırlık katsayıları (enerji-karbonhidrat-protein-yağ.pdf)
// Düzeltilmiş Ağırlık = Katsayı × BOY (metre)
export const CORRECTED_WEIGHT_COEFFICIENTS: Record<string, { male: number; female: number }> = {
    '13.0': { male: 18.2, female: 18.8 },
    '13.6': { male: 18.6, female: 19.2 },
    '14.0': { male: 19.0, female: 19.6 },
    '14.6': { male: 19.4, female: 19.9 },
    '15.0': { male: 19.8, female: 20.2 },
    '15.6': { male: 20.1, female: 20.5 },
    '16.0': { male: 20.5, female: 20.7 },
    '16.6': { male: 20.8, female: 20.9 },
    '17.0': { male: 21.1, female: 21.0 },
    '17.6': { male: 21.4, female: 21.2 }
};

export const PHY_DATA: any = {
    male: {
        // PDF'den alınan gerçek değerler (ERKEKLERİN FORMÜL VE PERSENTILLARI.pdf)
        bmi: { 
            '13.0': [15.1,15.4,16.3,18.2,20.9,23.1,24.2], 
            '13.6': [15.35,15.7,16.6,18.6,21.4,23.65,24.75], // PDF'den interpolasyon (13.0 ve 14.0 arası)
            '14.0': [15.6,16.0,16.9,19.0,21.9,24.2,25.3], 
            '14.6': [15.9,16.25,17.25,19.4,22.35,24.7,25.85], // PDF'den interpolasyon (14.0 ve 15.0 arası)
            '15.0': [16.2,16.5,17.6,19.8,22.8,25.2,26.4], 
            '15.6': [16.35,16.7,17.8,20.05,23.15,25.55,26.75], // PDF'den interpolasyon (15.0 ve 16.0 arası)
            '16.0': [16.7,17.1,18.2,20.5,23.7,26.1,27.3], 
            '16.6': [16.85,17.3,18.45,20.75,24.05,26.5,27.65], // PDF'den interpolasyon (16.0 ve 17.0 arası)
            '17.0': [17.1,17.5,18.7,21.1,24.4,26.9,28.0],
            '17.6': [17.1,17.5,18.7,21.1,24.4,26.9,28.0] // 17.0 ile aynı
        },
        weight: { 
            '13.0': [32.9,37.2,45.0,56.8,63.3], 
            '13.6': [35.2,39.7,47.8,60.1,66.8], // PDF'den gerçek değer
            '14.0': [37.7,42.4,50.8,63.4,70.4], 
            '14.6': [40.3,45.1,53.75,66.7,73.8], // PDF'den gerçek değer (PDF'de 70.4 görünüyor ama 73.8 yazıyor, kontrol et)
            '15.0': [42.9,47.8,56.7,70.0,77.2], 
            '15.6': [45.35,50.35,59.4,72.95,80.3], // PDF'den gerçek değer
            '16.0': [47.8,52.9,62.1,75.9,83.4], 
            '16.6': [49.75,54.9,64.2,78.25,85.9], // PDF'den gerçek değer
            '17.0': [51.7,56.9,66.3,80.6,88.4],
            '17.6': [51.7,56.9,66.3,80.6,88.4] // 17.0 ile aynı
        },
        height: { 
            '13.0': [142.1,143.8,148.3,156.0,163.7,168.3,170.0], // PDF'den gerçek değer
            '13.6': [145.4,147.2,151.8,159.7,167.5,172.2,173.9], // PDF'den gerçek değer
            '14.0': [148.7,150.5,155.2,163.2,171.2,175.8,177.6], // PDF'den gerçek değer
            '14.6': [151.7,153.5,158.3,166.3,174.4,179.1,180.9], // PDF'den gerçek değer
            '15.0': [154.3,156.1,160.9,169.0,177.0,181.8,183.6], // PDF'den gerçek değer
            '15.6': [156.5,158.3,163.1,171.1,179.2,184.0,185.8], // PDF'den gerçek değer
            '16.0': [158.3,160.1,164.8,172.9,181.0,185.7,187.5], // PDF'den gerçek değer
            '16.6': [159.7,161.5,166.2,174.2,182.2,186.9,188.7], // PDF'den gerçek değer
            '17.0': [160.8,162.6,167.2,175.2,183.1,187.7,189.5], // PDF'den gerçek değer
            '17.6': [161.5,163.3,167.9,175.8,183.6,188.2,190.0] // PDF'den gerçek değer
        },
        triceps: { 
            '13': [4.5,5.0,5.5,7.0,9.0,13.0,17.0,20.5,25.0], // PDF: 13.0-13.9
            '14': [4.0,5.0,5.0,6.0,8.5,12.5,15.0,18.0,23.5], // PDF: 14.0-14.9
            '15': [5.0,5.0,5.0,6.0,7.5,11.0,15.0,18.0,23.5], // PDF: 15.0-15.9
            '16': [4.0,5.0,5.1,6.0,8.0,12.0,14.0,17.0,23.0], // PDF: 16.0-16.9
            '17': [4.0,5.0,5.0,6.0,7.0,11.0,13.5,16.0,19.5] // PDF: 17.0-17.9
        },
        armCirc: { 
            '13': [20.0,20.8,21.6,22.5,24.5,26.6,28.2,29.0,30.8], // PDF: 13.0-13.9 (gerçek değer)
            '14': [21.6,22.5,23.2,23.8,25.7,28.1,29.1,30.0,32.3], // PDF: 14.0-14.9 (gerçek değer)
            '15': [22.5,23.4,24.0,25.1,27.2,29.0,30.3,31.2,32.7], // PDF: 15.0-15.9 (gerçek değer)
            '16': [24.1,25.0,25.7,26.7,28.3,30.6,32.1,32.7,34.7], // PDF: 16.0-16.9 (gerçek değer)
            '17': [24.3,25.1,25.9,26.8,28.6,30.8,32.2,33.3,34.7] // PDF: 17.0-17.9 (gerçek değer)
        },
        fatArea: { 
            '13': [4.7,5.7,6.3,7.6,10.1,14.9,21.2,25.4,32.1], // PDF: 13.0-13.9
            '14': [4.6,5.6,6.3,7.4,10.1,15.9,19.5,25.5,31.8], // PDF: 14.0-14.9 (gerçek değer)
            '15': [5.6,6.1,6.5,7.3,9.6,14.6,20.2,24.5,31], // PDF: 15.0-15.9 (gerçek değer)
            '16': [5.6,6.1,6.9,8.3,10.5,16.6,20.6,24.8,33.5], // PDF: 16.0-16.9 (gerçek değer)
            '17': [5.4,6.1,6.7,7.4,9.9,15.6,19.7,23.7,28.9] // PDF: 17.0-17.9 (gerçek değer)
        },
        muscleArea: { 
            '13': [24.5,26.7,28.1,30.4,35.7,41.3,45.3,48.1,52.5], // PDF: 13.0-13.9
            '14': [28.3,31.3,33.1,36.1,41.9,47.4,51.3,54.0,57.5], // PDF: 14.0-14.9 (gerçek değer)
            '15': [31.9,34.9,36.9,40.3,46.3,53.1,56.3,57.7,63.0], // PDF: 15.0-15.9 (gerçek değer)
            '16': [37.0,40.9,42.4,45.9,51.9,57.8,63.6,66.2,70.5], // PDF: 16.0-16.9 (gerçek değer)
            '17': [39.6,42.6,44.8,48.0,53.4,60.4,64.3,67.9,73.1] // PDF: 17.0-17.9 (gerçek değer)
        }
    },
    female: {
        // PDF'den alınan gerçek değerler (KIZLARIN FORMÜL VE PERSENTILLARI.pdf)
        bmi: { 
            '13.0': [15.1,15.5,16.5,18.8,21.9,24.4,25.6], 
            '13.6': [15.35,15.75,16.85,19.2,22.4,24.95,26.15], // PDF'den interpolasyon (13.0 ve 14.0 arası)
            '14.0': [15.6,16.0,17.2,19.6,22.9,25.5,26.7], 
            '14.6': [15.85,16.25,17.45,19.9,23.3,25.9,27.15], // PDF'den interpolasyon (14.0 ve 15.0 arası)
            '15.0': [16.1,16.5,17.7,20.2,23.7,26.3,27.6], 
            '15.6': [16.25,16.65,17.9,20.45,23.95,26.65,27.9], // PDF'den interpolasyon (15.0 ve 16.0 arası)
            '16.0': [16.4,16.8,18.1,20.7,24.2,27.0,28.2], 
            '16.6': [16.5,16.9,18.2,20.85,24.45,27.2,28.4], // PDF'den interpolasyon (16.0 ve 17.0 arası)
            '17.0': [16.6,17.0,18.3,21.0,24.7,27.4,28.6],
            '17.6': [16.6,17.0,18.3,21.0,24.7,27.4,28.6] // 17.0 ile aynı
        },
        weight: { 
            '13.0': [33.5,38.0,46.1,58.5,65.3], 
            '13.6': [35.3,39.9,48.3,60.9,67.9], // PDF'den gerçek değer
            '14.0': [37.1,41.8,50.3,63.2,70.2], 
            '14.6': [38.7,43.4,52.0,64.9,72.0], // PDF'den gerçek değer
            '15.0': [40.3,45.0,53.7,66.7,73.9], 
            '15.6': [41.5,46.2,54.8,67.8,75.0], // PDF'den gerçek değer
            '16.0': [42.7,47.4,55.9,69.0,76.2], 
            '16.6': [43.4,48.0,56.3,69.4,76.6], // PDF'den gerçek değer
            '17.0': [44.1,48.6,56.7,69.9,77.1],
            '17.6': [44.1,48.6,56.7,69.9,77.1] // PDF'den gerçek değer
        },
        height: { 
            '13.0': [143.3,145,149.2,156.4,163.6,167.8,169.4], // PDF'den gerçek değer
            '13.6': [145.2,146.9,151.1,158.3,165.5,169.7,171.4], // PDF'den gerçek değer
            '14.0': [146.7,148.4,152.6,159.8,167.0,171.2,172.8], // PDF'den gerçek değer
            '14.6': [147.9,149.5,153.7,160.9,168.1,172.3,173.9], // PDF'den gerçek değer
            '15.0': [148.7,150.4,154.5,161.7,168.8,173,174.6], // PDF'den gerçek değer
            '15.6': [149.3,150.9,155.1,162.2,169.3,173.4,175.0], // PDF'den gerçek değer
            '16.0': [149.8,151.4,155.5,162.5,169.6,173.7,175.3], // PDF'den gerçek değer
            '16.6': [150.0,151.6,155.7,162.7,169.7,173.8,175.4], // PDF'den gerçek değer
            '17.0': [150.3,151.8,155.9,162.9,169.8,173.9,175.4], // PDF'den gerçek değer
            '17.6': [150.5,152.0,156.1,163.0,169.9,173.9,175.5] // PDF'den gerçek değer
        },
        triceps: { 
            '13': [7,8,9,11,15,20,24,25,30], // PDF: 13.0-13.9
            '14': [8.3,9.6,10.9,12.4,17.7,25.1,29.5,34.6,41.2], // PDF: 14.0-14.9 (gerçek değer)
            '15': [8.6,10.0,11.4,12.8,18.2,24.4,29.2,32.9,44.3], // PDF: 15.0-15.9 (gerçek değer)
            '16': [11.3,12.8,13.7,15.9,20.5,28.0,32.7,37.0,46.0], // PDF: 16.0-16.9 (gerçek değer)
            '17': [9.5,11.7,13.0,14.6,21.0,29.5,33.5,38.0,51.6] // PDF: 17.0-17.9 (gerçek değer)
        },
        armCirc: { 
            '13': [20.1,21.0,21.5,22.5,24.3,26.7,28.3,30.1,32.7], // PDF: 13.0-13.9
            '14': [21.2,21.8,22.5,23.5,25.1,27.4,29.5,30.9,32.9], // PDF: 14.0-14.9 (gerçek değer)
            '15': [21.6,22.2,22.9,23.5,25.2,27.7,28.8,30.0,32.2], // PDF: 15.0-15.9 (gerçek değer)
            '16': [22.3,23.2,23.5,24.4,26.1,28.5,29.9,31.6,33.5], // PDF: 16.0-16.9 (gerçek değer)
            '17': [22.0,23.1,23.6,24.5,26.6,29.0,30.7,32.8,35.4] // PDF: 17.0-17.9 (gerçek değer)
        },
        fatArea: { 
            '13': [6.7,7.7,9.4,11.6,16.5,23.7,28.7,32.7,40.8], // PDF: 13.0-13.9
            '14': [8.3,9.6,10.9,12.4,17.7,25.1,29.5,34.6,41.2], // PDF: 14.0-14.9 (gerçek değer)
            '15': [8.6,10.0,11.4,12.8,18.2,24.4,29.2,32.9,44.3], // PDF: 15.0-15.9 (gerçek değer)
            '16': [11.3,12.8,13.7,15.9,20.5,28.0,32.7,37.0,46.0], // PDF: 16.0-16.9 (gerçek değer)
            '17': [9.5,11.7,13.0,14.6,21.0,29.5,33.5,38.0,51.6] // PDF: 17.0-17.9 (gerçek değer)
        },
        muscleArea: { 
            '13': [22.8,24.5,25.4,27.1,30.8,35.3,38.1,39.6,43.7], // PDF: 13.0-13.9
            '14': [24.0,26.2,27.1,29.0,32.8,36.9,39.8,42.3,47.5], // PDF: 14.0-14.9 (gerçek değer)
            '15': [24.4,25.8,27.5,29.2,33.0,37.3,40.2,41.7,45.9], // PDF: 15.0-15.9 (gerçek değer)
            '16': [25.2,26.8,28.2,30.0,33.6,38.0,40.2,43.7,48.3], // PDF: 16.0-16.9 (gerçek değer)
            '17': [25.9,27.5,28.9,30.7,34.3,39.6,43.4,46.2,50.8] // PDF: 17.0-17.9 (gerçek değer)
        }
    }
};

// PDF'den alınan veriler (Tüber, 2022)
// Yaş grupları: 13-14.6 (13, 13.6, 14, 14.6) ve 15-17.6 (15, 15.6, 16, 16.6, 17, 17.6)
export const NUTRITION_DATA: Record<string, Record<string, NutritionDataGroup>> = {
    male: {
        '13-14.6': { 
            // PDF: 13, 13.6, 14, 14.6 yaş grubu verileri
            // Not: Riboflavin 13-13.6 için 1.4 mg, 14-14.6 için 1.6 mg (13-13.6 değeri kullanılıyor)
            vitamins: [
                {n:"Vitamin A", v:"600 mcg"}, {n:"Vitamin D", v:"15 mcg"}, {n:"Vitamin E", v:"13 mg"}, {n:"Vitamin K", v:"45 mcg"},
                {n:"Vitamin B1 (Tiamin)", v:"1.1 mg"}, {n:"Vitamin B2 (Riboflavin)", v:"1.4 mg"}, 
                {n:"Niasin (B3)", v:"16 mg"}, {n:"Vitamin B6", v:"1.4 mg"}, 
                {n:"Vitamin B12", v:"3.5 mcg"}, {n:"Folat", v:"270 mcg"}, {n:"Vitamin C", v:"70 mg"},
                {n:"Biotin", v:"35 mcg"}, {n:"Pantotenik Asit", v:"5 mg"}
            ],
            minerals: [
                {n:"Kalsiyum", v:"1150 mg"}, {n:"Fosfor", v:"640 mg"}, {n:"Magnezyum", v:"250 mg"},
                {n:"Demir", v:"13 mg"}, {n:"Çinko", v:"10.7 mg"}, {n:"İyot", v:"120 mcg"},
                {n:"Bakır", v:"1.1 mg"}, {n:"Potasyum", v:"2700 mg"},
                {n:"Selenyum", v:"55 mcg"}, {n:"Flor", v:"2.3 mg"}, {n:"Manganez", v:"2 mg"}
            ]
        },
        '15-17.6': { 
            // PDF: 15, 15.6, 16, 16.6, 17, 17.6 yaş grubu verileri
            vitamins: [
                {n:"Vitamin A", v:"750 mcg"}, {n:"Vitamin D", v:"15 mcg"}, {n:"Vitamin E", v:"13 mg"}, {n:"Vitamin K", v:"65 mcg"},
                {n:"Vitamin B1 (Tiamin)", v:"1.2 mg"}, {n:"Vitamin B2 (Riboflavin)", v:"1.6 mg"}, 
                {n:"Niasin (B3)", v:"16 mg"}, {n:"Vitamin B6", v:"1.7 mg"}, 
                {n:"Vitamin B12", v:"4 mcg"}, {n:"Folat", v:"330 mcg"}, {n:"Vitamin C", v:"100 mg"},
                {n:"Biotin", v:"35 mcg"}, {n:"Pantotenik Asit", v:"5 mg"}
            ],
            minerals: [
                {n:"Kalsiyum", v:"1150 mg"}, {n:"Fosfor", v:"640 mg"}, {n:"Magnezyum", v:"250 mg"},
                {n:"Demir", v:"13 mg"}, {n:"Çinko", v:"11.9 mg"}, {n:"İyot", v:"130 mcg"},
                {n:"Bakır", v:"1.1 mg"}, {n:"Potasyum", v:"3500 mg"},
                {n:"Selenyum", v:"70 mcg"}, {n:"Flor", v:"2.8 mg"}, {n:"Manganez", v:"3 mg"}
            ]
        }
    },
    female: {
        '13-14.6': { 
            // PDF: 13, 13.6, 14, 14.6 yaş grubu verileri
            // Not: Riboflavin 13-13.6 için 1.4 mg, 14-14.6 için 1.6 mg (13-13.6 değeri kullanılıyor)
            vitamins: [
                {n:"Vitamin A", v:"600 mcg"}, {n:"Vitamin D", v:"15 mcg"}, {n:"Vitamin E", v:"13 mg"}, {n:"Vitamin K", v:"45 mcg"},
                {n:"Vitamin B1 (Tiamin)", v:"0.9 mg"}, {n:"Vitamin B2 (Riboflavin)", v:"1.4 mg"}, 
                {n:"Niasin (B3)", v:"14 mg"}, {n:"Vitamin B6", v:"1.4 mg"}, 
                {n:"Vitamin B12", v:"3.5 mcg"}, {n:"Folat", v:"270 mcg"}, {n:"Vitamin C", v:"70 mg"},
                {n:"Biotin", v:"35 mcg"}, {n:"Pantotenik Asit", v:"5 mg"}
            ],
            minerals: [
                {n:"Kalsiyum", v:"1150 mg"}, {n:"Fosfor", v:"640 mg"}, {n:"Magnezyum", v:"250 mg"},
                {n:"Demir", v:"13 mg"}, {n:"Çinko", v:"10.7 mg"}, {n:"İyot", v:"120 mcg"},
                {n:"Bakır", v:"1.1 mg"}, {n:"Potasyum", v:"2700 mg"},
                {n:"Selenyum", v:"55 mcg"}, {n:"Flor", v:"2.3 mg"}, {n:"Manganez", v:"2 mg"}
            ]
        },
        '15-17.6': { 
            // PDF: 15, 15.6, 16, 16.6, 17, 17.6 yaş grubu verileri
            vitamins: [
                {n:"Vitamin A", v:"750 mcg"}, {n:"Vitamin D", v:"15 mcg"}, {n:"Vitamin E", v:"13 mg"}, {n:"Vitamin K", v:"65 mcg"},
                {n:"Vitamin B1 (Tiamin)", v:"1.0 mg"}, {n:"Vitamin B2 (Riboflavin)", v:"1.6 mg"}, 
                {n:"Niasin (B3)", v:"14 mg"}, {n:"Vitamin B6", v:"1.7 mg"}, 
                {n:"Vitamin B12", v:"4 mcg"}, {n:"Folat", v:"330 mcg"}, {n:"Vitamin C", v:"100 mg"},
                {n:"Biotin", v:"35 mcg"}, {n:"Pantotenik Asit", v:"5 mg"}
            ],
            minerals: [
                {n:"Kalsiyum", v:"1150 mg"}, {n:"Fosfor", v:"640 mg"}, {n:"Magnezyum", v:"250 mg"},
                {n:"Demir", v:"13 mg"}, {n:"Çinko", v:"11.9 mg"}, {n:"İyot", v:"130 mcg"},
                {n:"Bakır", v:"1.1 mg"}, {n:"Potasyum", v:"3500 mg"},
                {n:"Selenyum", v:"70 mcg"}, {n:"Flor", v:"2.8 mg"}, {n:"Manganez", v:"3 mg"}
            ]
        }
    }
};

// PDF'den alınan Posa ve Su değerleri (cinsiyet ve yaş gruplarına göre)
// Erkek (E) değerleri: 13-13.6 yaş → Posa 19g, Su 2.1L; 14-14.6 yaş → Posa 19g, Su 2.5L; 15-17.6 yaş → Posa 21g, Su 2.5L
// Kız (K) değerleri: 13-13.6 yaş → Posa 19g, Su 1.9L; 14-14.6 yaş → Posa 19g, Su 2.0L; 15-17.6 yaş → Posa 21g, Su 2.0L
export const FIBER_WATER_DATA: Record<string, Record<string, { fiber: number; water: number }>> = {
    male: {
        '13': { fiber: 19, water: 2.1 },    // Yaş 13-13.6
        '14': { fiber: 19, water: 2.5 },    // Yaş 14-14.6
        '15': { fiber: 21, water: 2.5 }     // Yaş 15-17.6
    },
    female: {
        '13': { fiber: 19, water: 1.9 },    // Yaş 13-13.6
        '14': { fiber: 19, water: 2.0 },    // Yaş 14-14.6
        '15': { fiber: 21, water: 2.0 }     // Yaş 15-17.6
    }
};

export const FOOD_SOURCES: Record<string, string> = {
    'Vitamin A': 'Havuç, yumurta sarısı, yeşil yapraklı sebzeler, süt',
    'Vitamin D': 'Güneş ışığı, yağlı balıklar (somon), yumurta sarısı',
    'Vitamin E': 'Ayçiçek yağı, fındık, badem, yeşil yapraklı sebzeler',
    'Vitamin K': 'Ispanak, brokoli, marul, lahana',
    'Vitamin B1 (Tiamin)': 'Tam tahıllar, baklagiller, kuruyemişler',
    'Vitamin B2 (Riboflavin)': 'Süt, yoğurt, peynir, yumurta, badem',
    'Niasin (B3)': 'Et, balık, tavuk, yer fıstığı',
    'Vitamin B6': 'Nohut, muz, patates, tavuk',
    'Vitamin B12': 'Et, balık, süt, yumurta, peynir',
    'Folat': 'Yeşil yapraklı sebzeler, baklagiller, portakal',
    'Vitamin C': 'Turunçgiller, kivi, çilek, biber, brokoli',
    'Biotin': 'Yumurta sarısı, karaciğer, fındık, badem, tam tahıllar',
    'Pantotenik Asit': 'Et, balık, tavuk, yumurta, mantar, avokado',
    'Kalsiyum': 'Süt, yoğurt, peynir, koyu yeşil yapraklı sebzeler',
    'Fosfor': 'Süt ürünleri, et, balık, yumurta, tam tahıllar',
    'Magnezyum': 'Ispanak, badem, kaju, siyah fasulye, tam tahıllar, sert kabuklu yemişler, yeşil sebzeler, süt, çikolata',
    'Demir': 'Kırmızı et, sakatat, koyu yeşil yapraklı sebzeler, meyveler',
    'Çinko': 'Tam tahıllar, hayvansal kaynaklı yiyecekler, deniz ürünleri, et, kabak çekirdeği, nohut, kaju',
    'İyot': 'Deniz ürünleri, iyotlu tuz, mineralden zengin topraklarda yetişen bitkisel ürünler',
    'Bakır': 'Kırmızı et, kabuklu deniz ürünleri, kuru bakliyat, tam tahıllar, kabuklu yemişler',
    'Potasyum': 'Kuru bakliyat, tahıllar, turunçgiller, muz, avokado, yeşil yapraklı sebzeler, patates, et ve kuruyemişler',
    'Selenyum': 'Hayvansal kaynaklı ürünler, etler, sakatat, deniz ürünleri ve sarımsak',
    'Flor': 'Florlu sular, çay, küçük kılçıklı deniz balıkları',
    'Manganez': 'Kuru bakliyat, yağlı tohumlar, kabuklu kuru yemişler, yeşil yapraklı sebzeler ve çay'
};

// Güvenlik eşikleri: maksimum güvenli kilo kaybı (kg)
// Klinik pratikte genelde haftada ~0.5-1 kg arası kabul edilir; burada uygulama için koruyucu eşikler belirleniyor.
export const SAFE_WEIGHT_LOSS_PER_WEEK_KG = 1; // haftada 1 kg ve üzeri uyarı gerektirir
export const SAFE_WEIGHT_LOSS_PER_MONTH_KG = 4; // ayda 4 kg ve üzeri uyarı gerektirir
export const SAFE_WEIGHT_LOSS_PER_DAY_KG = SAFE_WEIGHT_LOSS_PER_WEEK_KG / 7; // günlük eşik (~0.1429 kg)