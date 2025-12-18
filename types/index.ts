export type HabitType = 'water' | 'food' | 'workout' | 'stretch' | 'racing';

export interface DailyHabitData {
  water: number;
  food: number;
  workout: number;
  stretch: number;
  racing: number;
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
    racing: number;
  };
  notifications: {
    water: number;
    food: number;
    workout: number;
    stretch: number;
    racing: number;
  };
  rolloverHour: number;
}

export interface HabitContextType {
  habits: DailyHabitData;
  history: {
    water: HabitHistory;
    food: HabitHistory;
    workout: HabitHistory;
    stretch: HabitHistory;
    racing: HabitHistory;
  };
  settings: HabitSettings;
  lastUpdated: {
    water: string | null;
    food: string | null;
    workout: string | null;
    stretch: string | null;
    racing: string | null;
  };
  today: string;
  updateHabit: (type: HabitType, value: number) => void;
  updateTotal: (type: HabitType, total: number) => void;
  updateHabitTotals: (totals: HabitSettings['totals']) => void;
  updateNotificationInterval: (type: HabitType, hours: number) => void;
  updateNotificationIntervals: (intervals: HabitSettings['notifications']) => void;
  editHistory: (type: HabitType, date: string, value: number) => void;
  updateDailyHistory: (date: string, values: DailyHabitData) => void;
  updateRolloverHour: (hour: number) => void;
}
