export type Gender = 'male' | 'female';

export interface MeasurementRaw {
  waist: number;
  tricepsMM: number;
  armCirc: number;
}

export interface Measurement {
  date: string;
  weight: number;
  height: number;
  bmi: number;
  measurements: MeasurementRaw;
  // Computed values stored for history or re-calc
  calculatedStats?: {
      whtr: number;
      armFatArea: number;
      armMuscleArea: number;
  }
}

export interface Student {
  id: number;
  name: string;
  dob: string;
  gender: Gender;
  measurements: Measurement[];
}

export interface PercentileResult {
  text: string;
  status: 'critical' | 'warning' | 'ideal' | 'unknown';
  percentileValue: number;
}

export interface NutritionNeeds {
  energy: number;
  carb: number;
  fat: number;
  protein: number;
  water: number;
  fiber: number;
}

export interface NutrientItem {
  n: string; // Name
  v: string; // Value with unit
}

export interface NutritionDataGroup {
  vitamins: NutrientItem[];
  minerals: NutrientItem[];
}

export type ViewState = 'list' | 'add-student' | 'measure' | 'result' | 'history';