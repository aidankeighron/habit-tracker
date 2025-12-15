export type HabitType = 'water' | 'food' | 'workout';

export interface DailyHabitData {
  water: number;
  food: number;
  workout: number;
}

export interface HabitHistory {
  [date: string]: number; // date is YYYY-MM-DD
}

export interface HabitSettings {
  totals: {
    water: number;
    food: number;
    workout: number;
  };
}

export interface HabitContextType {
  habits: DailyHabitData;
  history: {
    water: HabitHistory;
    food: HabitHistory;
    workout: HabitHistory;
  };
  settings: HabitSettings;
  updateHabit: (type: HabitType, value: number) => void;
  updateTotal: (type: HabitType, total: number) => void;
  editHistory: (type: HabitType, date: string, value: number) => void;
}
