import React, { useState, useEffect, useCallback } from 'react';
import { 
    Activity, 
    UserPlus, 
    Users, 
    Trash2, 
    ArrowLeft, 
    Info, 
    Scale, 
    Ruler, 
    ChartPie, 
    ChevronRight, 
    ChevronDown,
    Dna, 
    BookOpen, 
    X,
    Lock,
    Droplets,
    Leaf
} from 'lucide-react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    ReferenceLine
} from 'recharts';
import { 
    PHY_DATA, 
    P_KEYS_WHO, 
    P_KEYS_WEIGHT, 
    P_KEYS_NCHS, 
    FOOD_SOURCES 
} from './constants';
import { 
    calculateAge, 
    getSafeData, 
    analyzePercentile, 
    calculateNutritionNeeds, 
    getNutritionData, 
    getStatusColor,
    computeWeightChangeWarning
} from './utils';
import { 
    Student, 
    Measurement, 
    ViewState, 
    NutritionNeeds, 
    NutritionDataGroup,
    PercentileResult
} from './types';

// --- Sub-Components ---

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: React.ReactNode; children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl relative z-10 flex flex-col animate-[fadeEnter_0.3s_ease-out]">
                <div className="bg-slate-800 p-6 text-white flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-2">{title}</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"><X size={18} /></button>
                </div>
                <div className="p-6 overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

const Card = ({ title, value, badge, icon }: { title: string; value: string; badge?: PercentileResult; icon?: React.ReactNode }) => {
    const badgeClass = badge ? getStatusColor(badge.status) : 'bg-slate-100 text-slate-500';
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-indigo-50 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
                {icon && <div className="text-indigo-200">{icon}</div>}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1 truncate">{value}</h3>
            {badge && (
                <div className="mt-3">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${badgeClass} inline-block`}>
                        {badge.text}
                    </span>
                </div>
            )}
        </div>
    );
};

// --- Main Component ---

export default function App() {
    // State
    const [students, setStudents] = useState<Student[]>(() => {
        try {
            const saved = localStorage.getItem('students');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });
    const [currentView, setCurrentView] = useState<ViewState>('list');
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    const [lastResult, setLastResult] = useState<{
        student: Student;
        measurement: Measurement;
        nutrition: NutritionNeeds;
        micro: NutritionDataGroup | null;
        percentiles: Record<string, PercentileResult>;
        age: number;
        avgComparison: { w: number, bmi: number };
    } | null>(null);

    // Modals
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [isPercentileInfoOpen, setIsPercentileInfoOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'student' | 'measurement', id: number, subId?: number } | null>(null);
    const [isReferencesOpen, setIsReferencesOpen] = useState(false);

    // Persistence
    useEffect(() => {
        localStorage.setItem('students', JSON.stringify(students));
    }, [students]);

    // Helpers
    const getStudent = (id: number | null) => students.find(s => s.id === id);

    // Actions
    const handleAddStudent = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const dob = formData.get('dob') as string;
        const gender = formData.get('gender') as 'male' | 'female';
        
        const age = calculateAge(dob);
        if (age < 13 || age > 18) {
            alert("Bu uygulama sadece 13-18 yaş arası içindir.");
            return;
        }

        const newStudent: Student = {
            id: Date.now(),
            name,
            dob,
            gender,
            measurements: []
        };
        setStudents(prev => [...prev, newStudent]);
        setCurrentView('list');
    };

    const handleDelete = () => {
        if (!deleteConfirm) return;
        if (deleteConfirm.type === 'student') {
            setStudents(prev => prev.filter(s => s.id !== deleteConfirm.id));
            if (selectedStudentId === deleteConfirm.id) {
                setSelectedStudentId(null);
                setCurrentView('list');
            }
        } else if (deleteConfirm.type === 'measurement') {
            setStudents(prev => prev.map(s => {
                if (s.id === deleteConfirm.id) {
                    return { ...s, measurements: s.measurements.filter((_, idx) => idx !== deleteConfirm.subId) };
                }
                return s;
            }));
        }
        setDeleteConfirm(null);
    };

    const handleMeasurementSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const student = getStudent(selectedStudentId);
        if (!student) return;

        const formData = new FormData(e.currentTarget);
        const date = formData.get('date') as string;
        const height = parseFloat(formData.get('height') as string);
        const weight = parseFloat(formData.get('weight') as string);
        const waist = parseFloat(formData.get('waist') as string);
        const triceps = parseFloat(formData.get('triceps') as string);
        const armCirc = parseFloat(formData.get('armCirc') as string);

        // Calculations
        const heightM = height / 100;
        const bmi = weight / (heightM * heightM);
        const whtr = waist / height;
        const tricepsCM = triceps / 10;
        const pi = 3.1416;
        const armFatArea = (armCirc * tricepsCM / 2) - (pi * (tricepsCM * tricepsCM) / 4);
        const constant = student.gender === 'male' ? 10 : 6.5;
        const innerTerm = armCirc - (pi * tricepsCM);
        const armMuscleArea = ((innerTerm * innerTerm) / (4 * pi)) - constant;

        const age = calculateAge(student.dob);
        const gData = PHY_DATA[student.gender];

        // Percentiles
        const bmiPerc = analyzePercentile(bmi, getSafeData(age, gData.bmi).values, P_KEYS_WHO);
        const wPerc = analyzePercentile(weight, getSafeData(age, gData.weight).values, P_KEYS_WEIGHT);
        const hPerc = analyzePercentile(height, getSafeData(age, gData.height).values, P_KEYS_WHO);
        const triPerc = analyzePercentile(triceps, getSafeData(age, gData.triceps).values, P_KEYS_NCHS);
        const armPerc = analyzePercentile(armCirc, getSafeData(age, gData.armCirc).values, P_KEYS_NCHS);
        const fatPerc = analyzePercentile(armFatArea, getSafeData(age, gData.fatArea).values, P_KEYS_NCHS);
        const musPerc = analyzePercentile(armMuscleArea, getSafeData(age, gData.muscleArea).values, P_KEYS_NCHS);

        // Nutrition
        const nutrition = calculateNutritionNeeds(student.gender, age, weight, heightM, bmiPerc.status);
        const micro = getNutritionData(student.gender, age);

        const newMeasurement: Measurement = {
            date,
            height,
            weight,
            bmi,
            measurements: { waist, tricepsMM: triceps, armCirc },
            calculatedStats: { whtr, armFatArea, armMuscleArea }
        };

        const updatedStudent = {
            ...student,
            measurements: [...student.measurements, newMeasurement]
        };

        setStudents(prev => prev.map(s => s.id === student.id ? updatedStudent : s));
        
        // Prepare Result View Data
        const avgWeight = getSafeData(age, gData.weight).values[2]; // 50th percentile
        const avgBMI = getSafeData(age, gData.bmi).values[3]; // 50th percentile (index 3 in WHO array)

        setLastResult({
            student: updatedStudent,
            measurement: newMeasurement,
            nutrition,
            micro,
            percentiles: {
                bmi: bmiPerc,
                weight: wPerc,
                height: hPerc,
                triceps: triPerc,
                arm: armPerc,
                fat: fatPerc,
                muscle: musPerc
            },
            age,
            avgComparison: { w: avgWeight, bmi: avgBMI }
        });

        setCurrentView('result');
    };

    // --- Views ---

    const renderHeader = () => (
        <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-indigo-100 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('list')}>
                        <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200 text-white transform -rotate-3">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h1 className="font-bold text-2xl text-indigo-900 tracking-tight">Fit Genç</h1>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setIsPercentileInfoOpen(true)} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition border border-indigo-100">
                            <ChartPie size={16} /> Persentil Nedir?
                        </button>
                        <button onClick={() => setIsGuideOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition border border-slate-200">
                            <BookOpen size={16} /> <span className="hidden sm:inline">Rehber</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );

    const renderStudentList = () => (
        <div className="animate-[fadeEnter_0.3s_ease-out]">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Profiller</h2>
                    <p className="text-slate-500 mt-1">Gelişim ve performans takibi</p>
                </div>
                <button onClick={() => setCurrentView('add-student')} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-indigo-200 font-bold flex items-center gap-2 hover:bg-indigo-700 transition transform active:scale-95">
                    <UserPlus size={20} /> Yeni Profil
                </button>
            </div>

            {students.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-indigo-100 text-center">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                        <Users size={32} className="text-indigo-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700">Listeniz Boş</h3>
                    <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">Henüz kimseyi eklemediniz. "Yeni Profil" butonuna basarak başlayın.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {students.map(student => {
                        const age = calculateAge(student.dob).toFixed(1);
                        const lastM = student.measurements.length > 0 ? student.measurements[student.measurements.length - 1] : null;
                        
                        return (
                            <div key={student.id} className="bg-white p-5 rounded-3xl shadow-sm border border-indigo-50 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${student.gender === 'male' ? 'text-indigo-500 bg-indigo-50' : 'text-pink-500 bg-pink-50'}`}>
                                            {student.gender === 'male' ? <i className="fa-solid fa-mars"></i> : <i className="fa-solid fa-venus"></i>}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">{student.name}</h3>
                                            <p className="text-xs text-slate-500 font-bold">{age} Yaş</p>
                                        </div>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ type: 'student', id: student.id }); }} className="w-8 h-8 rounded-full text-slate-300 hover:bg-red-50 hover:text-red-500 transition flex items-center justify-center">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="mb-4">
                                    <p className="text-xs text-slate-400 font-medium">
                                        {lastM ? `Son: ${new Date(lastM.date).toLocaleDateString('tr-TR')} (${lastM.weight} kg)` : 'Henüz ölçüm yok'}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => { setSelectedStudentId(student.id); setCurrentView('measure'); }} className="py-2 bg-indigo-600 text-white rounded-lg font-bold text-xs hover:bg-indigo-700 shadow-md shadow-indigo-200 transition">Analiz Yap</button>
                                    <button onClick={() => { setSelectedStudentId(student.id); setCurrentView('history'); }} className="py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-xs hover:bg-slate-200 transition">Grafik & Geçmiş</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="mt-6 p-4 rounded-lg bg-yellow-50 border border-yellow-100 text-sm text-yellow-800">
                <strong>Önemli:</strong> Bu uygulama yalnızca genel bilgilendirme amaçlıdır ve tıbbi teşhis ya da tedavi yerine geçmez. Eğer mevcut bir sağlık sorunu, kronik bir durum veya endişe verici belirtiler varsa lütfen önce bir sağlık profesyoneline (doktor veya ilgili uzman) başvurun. Uygulamadaki bulgular doktorunuzla paylaşılacak bir rehber niteliğindedir; kişiye özel değerlendirme için doktorunuza danışmayı ihmal etmeyin.
            </div>
        </div>
    );

    const renderAddStudent = () => (
        <div className="max-w-xl mx-auto animate-[fadeEnter_0.3s_ease-out]">
            <button onClick={() => setCurrentView('list')} className="mb-6 text-slate-500 font-bold text-sm flex items-center gap-2 hover:text-indigo-600 transition">
                <ArrowLeft size={16} /> Geri Dön
            </button>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-indigo-50">
                <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                    <h2 className="text-2xl font-bold relative z-10">Yeni Profil Oluştur</h2>
                    <p className="text-indigo-100 text-sm mt-1 relative z-10">Takip etmek istediğiniz kişinin bilgilerini girin.</p>
                </div>
                <form onSubmit={handleAddStudent} className="p-8 space-y-6">
                    <div>
                        <label className="label-text block text-xs font-bold text-slate-600 uppercase mb-2">Ad Soyad</label>
                        <input type="text" name="name" required className="input-modern w-full p-3 bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none transition font-semibold text-slate-700" placeholder="Ad Soyad Giriniz" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label-text block text-xs font-bold text-slate-600 uppercase mb-2">Doğum Tarihi</label>
                            <input type="date" name="dob" required className="input-modern w-full p-3 bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none transition font-semibold text-slate-700" />
                        </div>
                        <div>
                            <label className="label-text block text-xs font-bold text-slate-600 uppercase mb-2">Cinsiyet</label>
                            <select name="gender" className="input-modern w-full p-3 bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none transition font-semibold text-slate-700">
                                <option value="female">Kız</option>
                                <option value="male">Erkek</option>
                            </select>
                        </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
                        <Lock size={16} className="text-blue-500 mt-1" />
                        <p className="text-xs text-blue-800 font-medium">Bu profil sadece bu tarayıcıda saklanacaktır.</p>
                    </div>
                    <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">Profili Kaydet</button>
                </form>
            </div>
        </div>
    );

    const renderMeasure = () => {
        const student = getStudent(selectedStudentId);
        if (!student) return null;
        const age = calculateAge(student.dob).toFixed(1);

        return (
            <div className="animate-[fadeEnter_0.3s_ease-out]">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => setCurrentView('list')} className="text-slate-500 font-bold text-sm flex items-center gap-2 hover:text-indigo-600 transition">
                        <ArrowLeft size={16} /> İptal
                    </button>
                    <div className="text-right">
                        <h3 className="font-bold text-xl text-slate-800">{student.name}</h3>
                        <p className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg inline-block mt-1 border border-indigo-100">{age} Yaş</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-indigo-50 p-8">
                        <form onSubmit={handleMeasurementSubmit} className="space-y-6">
                            <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="hidden" />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Boy (cm)</label>
                                    <input type="number" step="0.1" name="height" placeholder="160" required className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-semibold" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Kilo (kg)</label>
                                    <input type="number" step="0.1" name="weight" placeholder="50" required className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-semibold" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Bel Çevresi (cm)</label>
                                <input type="number" step="0.1" name="waist" placeholder="70" required className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-semibold" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Triseps (mm)</label>
                                    <input type="number" step="0.1" name="triceps" placeholder="12.0" required className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-semibold" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Kol Çevresi (cm)</label>
                                    <input type="number" step="0.1" name="armCirc" placeholder="25.0" required className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-semibold" />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition cursor-pointer transform active:scale-95 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
                                Analizi Başlat <ChevronRight size={20} />
                            </button>
                        </form>
                    </div>
                    <div className="hidden lg:block space-y-4">
                        <div className="bg-indigo-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
                            <h3 className="font-bold text-lg mb-2 text-indigo-200">Gizlilik Garantisi</h3>
                            <p className="text-sm opacity-80 leading-relaxed">Verileriniz sadece bu cihazda saklanır. Sunucuya gönderilmez.</p>
                        </div>
                        <div className="bg-white border-2 border-indigo-100 rounded-3xl p-6 text-indigo-800 shadow-sm cursor-pointer hover:border-indigo-300 transition group" onClick={() => setIsGuideOpen(true)}>
                            <h3 className="font-bold text-lg mb-2 group-hover:text-indigo-600 flex items-center gap-2"><Ruler size={18} /> Nasıl Ölçülür?</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">Doğru sonuçlar için ölçüm tekniklerini buradan öğrenin.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderResults = () => {
        if (!lastResult) return null;
        const { student, measurement, nutrition, percentiles, avgComparison, micro } = lastResult;
        const weightWarning = computeWeightChangeWarning(student.measurements || []);
        
        // WHtR sınıflandırması: < 0.4: Dikkat, 0.4-0.5: Uygun, 0.5-0.6: Eylem düşün, > 0.6: Eyleme Geç
        const whtr = measurement.calculatedStats!.whtr;
        let whtrStatus: PercentileResult['status'];
        let whtrText: string;
        
        if (whtr < 0.4) {
            whtrStatus = 'warning';
            whtrText = 'Dikkat';
        } else if (whtr >= 0.4 && whtr < 0.5) {
            whtrStatus = 'ideal';
            whtrText = 'Uygun';
        } else if (whtr >= 0.5 && whtr <= 0.6) {
            whtrStatus = 'warning';
            whtrText = 'Eylem düşün';
        } else {
            whtrStatus = 'critical';
            whtrText = 'Eyleme Geç';
        }
        
        const whtrBadge = { text: whtrText, status: whtrStatus, percentileValue: 0 };

        const comparisonData = [
            { name: 'Kilo (kg)', Student: measurement.weight, Average: avgComparison.w },
            { name: 'BKİ', Student: measurement.bmi, Average: avgComparison.bmi },
        ];

        return (
            <div className="animate-[fadeEnter_0.3s_ease-out] pb-20">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <button onClick={() => setCurrentView('history')} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm flex items-center gap-2">
                        <ArrowLeft size={16} /> Geçmiş Analizlere Dön
                    </button>
                    <div className="text-center md:text-right">
                        <h2 className="text-2xl font-bold text-slate-800">{student.name}</h2>
                        <span className="text-sm font-medium text-indigo-500">{new Date(measurement.date).toLocaleDateString('tr-TR')}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {(weightWarning.isDailyUnsafe || weightWarning.isWeeklyUnsafe || weightWarning.isMonthlyUnsafe) && (
                        <div className="lg:col-span-4">
                            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-800">
                                <div className="flex items-start gap-3">
                                    <Info size={18} className="text-red-500" />
                                    <div>
                                        <div className="font-bold">Uyarı: Hızlı Kilo Kaybı</div>
                                        <div className="text-sm mt-1">{weightWarning.message || 'Ölçümler hızlı kilo kaybı gösteriyor. Lütfen sağlık uzmanına danışın.'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <Card title="Beden Kitle İndeksi" value={measurement.bmi.toFixed(1)} badge={percentiles.bmi} icon={<Activity size={20} />} />
                    <Card title="Vücut Ağırlığı" value={`${measurement.weight} kg`} badge={percentiles.weight} icon={<Scale size={20} />} />
                    <Card title="Bel / Boy Oranı" value={measurement.calculatedStats!.whtr.toFixed(2)} badge={whtrBadge} icon={<Ruler size={20} />} />
                    <Card title="Yaş Analizi" value={`${lastResult.age.toFixed(1)}`} badge={{ text: 'Referans Tablo', status: 'ideal', percentileValue: 0 }} icon={<Dna size={20} />} />
                </div>

                <div className="bg-white rounded-3xl shadow-lg border border-indigo-50 p-6 mb-8 h-96">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-4">
                        <Activity className="text-indigo-500" size={20} /> Fiziksel Gelişim Grafiği
                    </h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={comparisonData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="Student" name="Sizin Değeriniz" fill="#6366f1" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="Average" name="Yaş Ortalaması (50p)" fill="#e2e8f0" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    <p className="text-center text-xs text-slate-400 italic mt-2">* Mavi: Öğrenci, Gri: Yaş Ortalaması</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2 bg-white rounded-3xl shadow-lg border border-indigo-50 overflow-hidden">
                        <div className="p-6 bg-indigo-50/50 border-b border-indigo-50">
                            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><Ruler className="text-indigo-500" size={20} /> Detaylı Vücut Analizi</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-400 uppercase bg-white border-b border-slate-100">
                                    <tr><th className="px-6 py-4">Ölçüm</th><th className="px-6 py-4">Değer</th><th className="px-6 py-4">Persentil (Sıralama)</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {[
                                        { l: 'Boy Uzunluğu', v: `${measurement.height} cm`, p: percentiles.height },
                                        { l: 'Triseps Deri', v: `${measurement.measurements.tricepsMM} mm`, p: percentiles.triceps },
                                        { l: 'Kol Çevresi', v: `${measurement.measurements.armCirc} cm`, p: percentiles.arm },
                                        { l: 'Kol Yağ Alanı', v: `${measurement.calculatedStats!.armFatArea.toFixed(1)} cm²`, p: percentiles.fat },
                                        { l: 'Kol Kas Alanı', v: `${measurement.calculatedStats!.armMuscleArea.toFixed(1)} cm²`, p: percentiles.muscle },
                                    ].map((row, idx) => (
                                        <tr key={idx}>
                                            <td className="px-6 py-4 font-medium text-slate-700">{row.l}</td>
                                            <td className="px-6 py-4 text-slate-500 font-mono">{row.v}</td>
                                            <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(row.p.status)}`}>{row.p.text}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-3xl shadow-2xl p-6 text-white flex flex-col h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl"></div>
                        <h3 className="font-bold text-lg mb-4 relative z-10 flex items-center gap-2"><Leaf size={18} className="text-green-400" /> Beslenme Raporu</h3>
                        
                        <div className="space-y-4 overflow-y-auto pr-2 relative z-10 custom-scrollbar h-[500px]">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
                                <h4 className="text-xs font-bold text-orange-300 uppercase mb-3">Enerji & Makro Besinler</h4>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div><p className="text-[10px] text-slate-400">Günlük Enerji</p><p className="text-xl font-bold text-orange-400 mt-1">{nutrition.energy.toFixed(0)} kcal</p></div>
                                    <div><p className="text-[10px] text-slate-400">Protein</p><p className="text-xl font-bold text-orange-400 mt-1">{nutrition.protein.toFixed(1)} g</p></div>
                                    <div><p className="text-[10px] text-slate-400">Karbonhidrat</p><p className="text-xl font-bold text-orange-400 mt-1">{nutrition.carb.toFixed(1)} g</p></div>
                                    <div><p className="text-[10px] text-slate-400">Yağ</p><p className="text-xl font-bold text-orange-400 mt-1">{nutrition.fat.toFixed(1)} g</p></div>
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
                                <h4 className="text-xs font-bold text-cyan-300 uppercase mb-3">Sıvı & Lif</h4>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div><p className="text-[10px] text-slate-400">Su (L)</p><p className="text-xl font-bold text-cyan-400 mt-1">{nutrition.water.toFixed(1)} L</p></div>
                                    <div><p className="text-[10px] text-slate-400">Lif (g)</p><p className="text-xl font-bold text-emerald-400 mt-1">{nutrition.fiber.toFixed(1)} g</p></div>
                                </div>
                            </div>
                            {micro && (
                                <>
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
                                        <h4 className="text-xs font-bold text-yellow-300 uppercase mb-2">Vitaminler</h4>
                                        <div className="text-xs space-y-1">
                                            {micro.vitamins
                                                .filter(v => v.n !== 'Vitamin B1 (Tiamin)' && v.n !== 'Niasin (B3)')
                                                .map((v, i) => (
                                                    <div key={i} className="flex justify-between border-b border-white/5 pb-1 last:border-0">
                                                        <span className="text-slate-300">{v.n}</span>
                                                        <span className="font-mono text-yellow-100">{v.v}</span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
                                        <h4 className="text-xs font-bold text-indigo-300 uppercase mb-2">Mineraller</h4>
                                        <div className="text-xs space-y-1">
                                            {micro.minerals.map((v, i) => <div key={i} className="flex justify-between border-b border-white/5 pb-1 last:border-0"><span className="text-slate-300">{v.n}</span><span className="font-mono text-indigo-100">{v.v}</span></div>)}
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                         <p className="text-xs font-bold text-slate-400 uppercase mb-2">Önemli Kaynaklar</p>
                                         <div className="space-y-2">
                                             {Object.entries(FOOD_SOURCES)
                                                 .filter(([k]) => k !== 'Vitamin B1 (Tiamin)' && k !== 'Niasin (B3)')
                                                 .map(([k, v]) => (
                                                     <p key={k} className="text-xs text-slate-300"><strong className="text-white">{k}:</strong> {v}</p>
                                                 ))}
                                         </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handleViewMeasurementDetails = (measurement: Measurement) => {
        const student = getStudent(selectedStudentId);
        if (!student) return;

        const age = calculateAge(student.dob);
        const gData = PHY_DATA[student.gender];
        const heightM = measurement.height / 100;

        // Percentiles
        const bmiPerc = analyzePercentile(measurement.bmi, getSafeData(age, gData.bmi).values, P_KEYS_WHO);
        const wPerc = analyzePercentile(measurement.weight, getSafeData(age, gData.weight).values, P_KEYS_WEIGHT);
        const hPerc = analyzePercentile(measurement.height, getSafeData(age, gData.height).values, P_KEYS_WHO);
        const triPerc = analyzePercentile(measurement.measurements.tricepsMM, getSafeData(age, gData.triceps).values, P_KEYS_NCHS);
        const armPerc = analyzePercentile(measurement.measurements.armCirc, getSafeData(age, gData.armCirc).values, P_KEYS_NCHS);
        const fatPerc = analyzePercentile(measurement.calculatedStats!.armFatArea, getSafeData(age, gData.fatArea).values, P_KEYS_NCHS);
        const musPerc = analyzePercentile(measurement.calculatedStats!.armMuscleArea, getSafeData(age, gData.muscleArea).values, P_KEYS_NCHS);

        // Nutrition
        const nutrition = calculateNutritionNeeds(student.gender, age, measurement.weight, heightM, bmiPerc.status);
        const micro = getNutritionData(student.gender, age);

        // Average comparison
        const avgWeight = getSafeData(age, gData.weight).values[2]; // 50th percentile
        const avgBMI = getSafeData(age, gData.bmi).values[3]; // 50th percentile

        setLastResult({
            student,
            measurement,
            nutrition,
            micro,
            percentiles: {
                bmi: bmiPerc,
                weight: wPerc,
                height: hPerc,
                triceps: triPerc,
                arm: armPerc,
                fat: fatPerc,
                muscle: musPerc
            },
            age,
            avgComparison: { w: avgWeight, bmi: avgBMI }
        });

        setCurrentView('result');
    };

    const renderHistory = () => {
        const student = getStudent(selectedStudentId);
        if (!student) return null;

        const weightWarning = computeWeightChangeWarning(student.measurements || []);

        const data = [...student.measurements].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(m => ({
            date: new Date(m.date).toLocaleDateString('tr-TR'),
            weight: m.weight,
            bmi: parseFloat(m.bmi.toFixed(1))
        }));

        return (
            <div className="max-w-5xl mx-auto animate-[fadeEnter_0.3s_ease-out]">
                <button onClick={() => setCurrentView('list')} className="mb-6 text-slate-500 font-bold text-sm flex items-center gap-2 hover:text-indigo-600 transition">
                    <ArrowLeft size={16} /> Listeye Dön
                </button>
                <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-indigo-50">
                    <h2 className="text-2xl font-bold text-slate-800">{student.name} - Geçmiş</h2>
                    <button onClick={() => setDeleteConfirm({ type: 'student', id: student.id })} className="text-red-500 hover:text-white hover:bg-red-500 transition font-bold text-sm bg-red-50 px-4 py-2 rounded-xl flex items-center gap-2">
                        <Trash2 size={16} /> Profili Sil
                    </button>
                </div>

                {(weightWarning.isDailyUnsafe || weightWarning.isWeeklyUnsafe || weightWarning.isMonthlyUnsafe) && (
                    <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-100 text-red-800">
                        <div className="flex items-start gap-3">
                            <Info size={18} className="text-red-500" />
                            <div>
                                <div className="font-bold">Uyarı</div>
                                <div className="text-sm mt-1">Haftada 1 kilo, ayda 4 kilodan fazla verirsen bu sağlığın için sakıncalı bir durum olabilir.</div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-indigo-50 h-72">
                        <h3 className="font-bold text-indigo-900 mb-4 text-sm uppercase flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600"><Scale size={16} /></span> Kilo Değişimi
                        </h3>
                        <ResponsiveContainer width="100%" height="80%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" tick={{fontSize: 10}} />
                                <YAxis domain={['auto', 'auto']} />
                                <Tooltip />
                                <Line type="monotone" dataKey="weight" stroke="#6366f1" strokeWidth={3} dot={{r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff'}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-indigo-50 h-72">
                        <h3 className="font-bold text-indigo-900 mb-4 text-sm uppercase flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600"><Activity size={16} /></span> BKİ Değişimi
                        </h3>
                        <ResponsiveContainer width="100%" height="80%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" tick={{fontSize: 10}} />
                                <YAxis domain={['auto', 'auto']} />
                                <Tooltip />
                                <Line type="monotone" dataKey="bmi" stroke="#0ea5e9" strokeWidth={3} dot={{r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff'}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-indigo-50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4">Tarih</th>
                                    <th className="px-6 py-4">Boy</th>
                                    <th className="px-6 py-4">Kilo</th>
                                    <th className="px-6 py-4">BKİ</th>
                                    <th className="px-6 py-4">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[...student.measurements].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((m, idx) => {
                                    const measurementIndex = student.measurements.findIndex(meas => meas.date === m.date && meas.weight === m.weight);
                                    return (
                                        <tr 
                                            key={idx} 
                                            onClick={() => handleViewMeasurementDetails(m)}
                                            className="cursor-pointer hover:bg-indigo-50/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">{new Date(m.date).toLocaleDateString('tr-TR')}</td>
                                            <td className="px-6 py-4">{m.height} cm</td>
                                            <td className="px-6 py-4 font-bold text-slate-700">{m.weight} kg</td>
                                            <td className="px-6 py-4"><span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-xs font-bold">{m.bmi.toFixed(1)}</span></td>
                                            <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                <button onClick={() => setDeleteConfirm({type: 'measurement', id: student.id, subId: measurementIndex})} className="text-red-400 hover:text-red-600 transition">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-600 bg-slate-50 pb-8">
            {renderHeader()}
            <main className="flex-grow p-4 md:p-8 max-w-6xl mx-auto w-full">
                {currentView === 'list' && renderStudentList()}
                {currentView === 'add-student' && renderAddStudent()}
                {currentView === 'measure' && renderMeasure()}
                {currentView === 'result' && renderResults()}
                {currentView === 'history' && renderHistory()}
            </main>

            {/* Modals */}
            <Modal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} title="Ölçüm Rehberi">
                <div className="space-y-4">
                    {[
                        { title: 'Boy Uzunluğu', desc: 'Ayakkabısız, ayaklar bitişik, baş dik ve omuzlar duvara temas edecek şekilde.', color: 'indigo' },
                        { title: 'Vücut Ağırlığı', desc: 'Hafif kıyafetlerle, ayakkabısız ve aç karna (mümkünse sabah).', color: 'pink' },
                        { title: 'Bel Çevresi', desc: 'En alt kaburga kemiği ile kalça kemiği arasındaki orta noktadan.', color: 'orange' },
                        { title: 'Triseps Deri', desc: 'Kol serbestken, üst kolun arka orta noktasından kumpas ile.', color: 'blue' },
                        { title: 'Kol Çevresi', desc: 'Kol bükülü değilken, omuz ile dirsek arasındaki orta noktadan.', color: 'purple' },
                    ].map((item, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className={`w-10 h-10 rounded-xl bg-${item.color}-100 text-${item.color}-600 flex items-center justify-center shrink-0 font-bold`}>{i+1}</div>
                            <div><h3 className="font-bold text-slate-800">{item.title}</h3><p className="text-sm text-slate-600 mt-1">{item.desc}</p></div>
                        </div>
                    ))}
                </div>
            </Modal>

            <Modal isOpen={isPercentileInfoOpen} onClose={() => setIsPercentileInfoOpen(false)} title="Persentil Nedir?">
                 <p className="text-slate-600 leading-relaxed mb-4">
                    <strong>Persentil (Yüzdelik Dilim)</strong>, çocuğunuzun büyüme değerlerinin (boy, kilo vb.) aynı yaş ve cinsiyetteki diğer çocuklara göre nerede olduğunu gösterir.
                </p>
                <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                        <span className="w-3 h-3 rounded-full bg-red-500 shrink-0"></span>
                        <div><h4 className="font-bold text-red-800 text-sm">Riskli Alan</h4><p className="text-xs text-red-600">Ortalamanın çok altında veya üstünde.</p></div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                        <span className="w-3 h-3 rounded-full bg-orange-500 shrink-0"></span>
                        <div><h4 className="font-bold text-orange-800 text-sm">Dikkat Alanı</h4><p className="text-xs text-orange-600">Sınıra yakın değerler.</p></div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
                        <div><h4 className="font-bold text-emerald-800 text-sm">İdeal Alan</h4><p className="text-xs text-emerald-600">Toplum ortalamasıyla uyumlu.</p></div>
                    </div>
                </div>
            </Modal>

            {/* Confirm Delete Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}></div>
                    <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative z-10 text-center animate-[fadeEnter_0.2s_ease-out]">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 text-2xl mx-auto"><Trash2 /></div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Emin misiniz?</h3>
                        <p className="text-slate-500 text-sm mb-6">Bu işlem geri alınamaz.</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="py-3 px-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200">Vazgeç</button>
                            <button onClick={handleDelete} className="py-3 px-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 shadow-lg shadow-red-200">Sil</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer with References */}
            <footer className="mt-auto border-t border-slate-200 bg-white/50 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-4 md:px-8 py-4">
                    <button
                        onClick={() => setIsReferencesOpen(!isReferencesOpen)}
                        className="w-full flex items-center justify-between text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors py-2"
                    >
                        <span className="flex items-center gap-2">
                            <BookOpen size={16} />
                            Kaynakça
                        </span>
                        <ChevronDown 
                            size={18} 
                            className={`transition-transform duration-200 ${isReferencesOpen ? 'rotate-180' : ''}`}
                        />
                    </button>
                    {isReferencesOpen && (
                        <div className="mt-4 pt-4 border-t border-slate-200 max-h-96 overflow-y-auto">
                            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                                <p>• Ashwell, M., & Hsieh, S. D. (2005). Six reasons why the waist-to-height ratio is a rapid and effective global indicator for health risks of obesity and how its use could simplify the international public health message on obesity. <em>International journal of food sciences and nutrition</em>, 56(5), 303-307.</p>
                                <p>• Aykut, M. (2011). Community Nutrition. In O. G. Yusuf Öztürk (Ed.), <em>Public Health Information</em> (pp. 1357–1361). Kayseri.</p>
                                <p>• Başoğlu, S., Karaağaoğlu, N., Erbaş, N., & Ünlü, A. (1995). Enteral-parenteral beslenme. <em>Türkiye Diyetisyenler Derneği Yayın</em>, (8).</p>
                                <p>• Beaglehole, R., Epping-Jordan, J., Patel, V., Chopra, M., Ebrahim, S., Kidd, M., & Haines, A. (2008). Improving the prevention and management of chronic disease in low-income and middle-income countries: a priority for primary health care. <em>The Lancet</em>, 372(9642), 940-949.</p>
                                <p>• Belachew, T., Hadley, C., Lindstrom, D., Gebremariam, A., Lachat, C., & Kolsteren, P. (2011). Food insecurity, school absenteeism and educational attainment of adolescents in Jimma Zone Southwest Ethiopia: a longitudinal study. <em>Nutrition journal</em>, 10(1), 29.</p>
                                <p>• Biddle, S. J., Ciaccioni, S., Thomas, G., & Vergeer, I. (2019). Physical activity and mental health in children and adolescents: An updated review of reviews and an analysis of causality. <em>Psychology of sport and exercise</em>, 42, 146-155.</p>
                                <p>• Büyükgebiz, B. (2013). Nutrition in adolescents age group. <em>Turkey Clinical J Pediatr Sci</em>, 9(2), 37-47.</p>
                                <p>• Dubois, L., Bédard, B., Goulet, D., Prud'homme, D., Tremblay, R. E., & Boivin, M. (2022). Eating behaviors, dietary patterns and weight status in emerging adulthood and longitudinal associations with eating behaviors in early childhood. <em>International Journal of Behavioral Nutrition and Physical Activity</em>, 19(1), 139.</p>
                                <p>• Gibson, R. S. (2005). <em>Principles of nutritional assessment</em>. Oxford university press.</p>
                                <p>• Gniewosz, G., & Gniewosz, B. (2020). Psychological adjustment during multiple transitions between childhood and adolescence. <em>The Journal of Early Adolescence</em>, 40(4), 566-598.</p>
                                <p>• Gottfried, R. J., Gerring, J. P., Machell, K., Yenokyan, G., & Riddle, M. A. (2013). The iron status of children and youth in a community mental health clinic is lower than that of a national sample. <em>Journal of child and adolescent psychopharmacology</em>, 23(2), 91-100.</p>
                                <p>• <a href="https://hsgm.saglik.gov.tr/tr/web-uygulamalarimiz/357.html" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">https://hsgm.saglik.gov.tr/tr/web-uygulamalarimiz/357.html</a></p>
                                <p>• <a href="https://www.ohsu.edu/sites/default/files/2021-06/Weight%20Management%20Evidence%20Summary_FINAL_5.21.21b.pdf" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">https://www.ohsu.edu/sites/default/files/2021-06/Weight%20Management%20Evidence%20Summary_FINAL_5.21.21b.pdf</a></p>
                                <p>• Loh, V. H., Veitch, J., Salmon, J., Cerin, E., Thornton, L., Mavoa, S., ... & Timperio, A. (2019). Built environment and physical activity among adolescents: the moderating effects of neighborhood safety and social support. <em>International journal of behavioral nutrition and physical activity</em>, 16(1), 132.</p>
                                <p>• Li, M., & Ren, Y. (2024). Relationship among physical exercise, social support and sense of coherence in rural left-behind children. <em>Journal of Psychiatric Research</em>, 169, 1-6.</p>
                                <p>• Patrick, K., Norman, G. J., Calfas, K. J., Sallis, J. F., Zabinski, M. F., Rupp, J., & Cella, J. (2004). Diet, physical activity, and sedentary behaviors as risk factors for overweight in adolescence. <em>Archives of pediatrics & adolescent medicine</em>, 158(4), 385-390.</p>
                                <p>• Popkin, B. M., Corvalan, C., & Grummer-Strawn, L. M. (2020). Dynamics of the double burden of malnutrition and the changing nutrition reality. <em>The Lancet</em>, 395(10217), 65-74.</p>
                                <p>• Salman, H., Irlayici, F. İ., & Akçam, M. The Effect of the COVID-19 Pandemic on Childhood Obesity. <em>Journal of Pediatric Gastroenterology and Nutrition</em>, 10-1097.</p>
                                <p>• Sarria, A., Moreno, L. A., Garcí‐LIop, L. A., Fleta, J., Morellon, M. P., & Bueno, M. (2001). Body mass index, triceps skinfold and waist circumference in screening for adiposity in male children and adolescents. <em>Acta paediatrica</em>, 90(4), 387-392.</p>
                                <p>• Sun, S. S., Chumlea, W. C., Heymsfield, S. B., Lukaski, H. C., Schoeller, D., Friedl, K., ... & Hubbard, V. S. (2003). Development of bioelectrical impedance analysis prediction equations for body composition with the use of a multicomponent model for use in epidemiologic surveys. <em>The American journal of clinical nutrition</em>, 77(2), 331-340.</p>
                                <p>• Viana, R. S., De Araújo-Moura, K., & De Moraes, A. C. F. (2025). Worldwide prevalence of the double burden of malnutrition in children and adolescents at the individual level: systematic review and meta-regression. <em>Jornal de Pediatria</em>.</p>
                                <p>• WHO Multicentre Growth Reference Study Group. (2007). <em>WHO Child Growth Standards: Head circumference-for-age, arm circumference-for-age, triceps skinfold-for-age and subscapular skinfold-for-age: Methods and development</em>. Geneva: World Health Organization.</p>
                                <p>• WHO Multicentre Growth Reference Study Group. <em>WHO Child Growth Standards: Length/height-for-age, weight-for-age, weight-for-length, weight-for-height and body mass index-for-age: Methods and development</em>. World Health Organization, Geneva, 2006.</p>
                                <p>• World Health Organization. (n.d.). Adolescent health — Overview. Retrieved November 12, 2025, from <a href="https://www.who.int/maternal_child_adolescent/adolescence/en/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">https://www.who.int/maternal_child_adolescent/adolescence/en/</a></p>
                                <p>• World Obesity. Global atlas on childhood obesity. Accessed May 10, 2024. <a href="https://www.worldobesity.org/membersarea/global-atlas-on-childhood-obesity" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">https://www.worldobesity.org/membersarea/global-atlas-on-childhood-obesity</a> 2024</p>
                            </div>
                        </div>
                    )}
                </div>
            </footer>
        </div>
    );
}