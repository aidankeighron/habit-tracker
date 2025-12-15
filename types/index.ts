export type HabitType = 'water' | 'food' | 'workout' | 'stretch';

export interface DailyHabitData {
  water: number;
  food: number;
  workout: number;
  stretch: number;
}

export interface HabitHistory {
  [date: string]: number; // date is YYYY-MM-DD
}

export interface HabitSettings {
  totals: {
    water: number;
    food: number;
    workout: number;
    stretch: number;
  };
  notifications: {
    water: number;
    food: number;
    workout: number;
    stretch: number;
  };
}

export interface HabitContextType {
  habits: DailyHabitData;
  history: {
    water: HabitHistory;
    food: HabitHistory;
    workout: HabitHistory;
    stretch: HabitHistory;
  };
  settings: HabitSettings;
  lastUpdated: {
    water: string | null;
    food: string | null;
    workout: string | null;
    stretch: string | null;
  };
  updateHabit: (type: HabitType, value: number) => void;
  updateTotal: (type: HabitType, total: number) => void;
  updateNotificationInterval: (type: HabitType, hours: number) => void;
  editHistory: (type: HabitType, date: string, value: number) => void;
}
