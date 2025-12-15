import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { DailyHabitData, HabitContextType, HabitHistory, HabitSettings, HabitType } from '../types';

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const KEYS = {
  WATER: 'water_history',
  FOOD: 'food_history',
  WORKOUT: 'workout_history',
  SETTINGS: 'habit_settings',
};

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<{
    water: HabitHistory;
    food: HabitHistory;
    workout: HabitHistory;
  }>({
    water: {},
    food: {},
    workout: {},
  });

  const [settings, setSettings] = useState<HabitSettings>({
    totals: { water: 8, food: 3, workout: 30 },
  });

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [water, food, workout, storedSettings] = await Promise.all([
        AsyncStorage.getItem(KEYS.WATER),
        AsyncStorage.getItem(KEYS.FOOD),
        AsyncStorage.getItem(KEYS.WORKOUT),
        AsyncStorage.getItem(KEYS.SETTINGS),
      ]);

      setHistory({
        water: water ? JSON.parse(water) : {},
        food: food ? JSON.parse(food) : {},
        workout: workout ? JSON.parse(workout) : {},
      });

      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (e) {
      console.error('Failed to load habit data', e);
    }
  };

  const updateHabit = async (type: HabitType, value: number) => {
    const today = getTodayDate();
    const newHistory = { ...history };
    // Current value for today
    const currentVal = newHistory[type][today] || 0;
    // New value (accumulator or replacement? Requirement says "buttons increase/decrease", workout "replaces/adds"?
    // User said: "plus and minus buttons should increase and decrease". "workout... counter should display 0... when button pressed display whatever number is in text input" -> workout is set, others are increment.
    
    // Wait, the UI logic should handle increment/decrement. The context should probably just take the absolute value or delta. 
    // The prompt says "updated whenever the counter changes". The interface allows setting value. 
    // I will expose a method to SET the value for a date. The UI components will calculate the new value.
    
    // But wait, "updateHabit" in my interface signature was (type, value). I should clarify if value is delta or absolute.
    // The workout section: "when button is pressed it should display whatever number is in the number text input". This implies SET.
    // Water/Food: "increase and decrease". This implies INCREMENT.
    // I will make `updateHabit` take the NEW TOTAL VALUE for today to be safe and simple.
    
    newHistory[type] = { ...newHistory[type], [today]: value };
    setHistory(newHistory);
    
    let key = KEYS.WATER;
    if (type === 'food') key = KEYS.FOOD;
    if (type === 'workout') key = KEYS.WORKOUT;
    
    await AsyncStorage.setItem(key, JSON.stringify(newHistory[type]));
  };

  const editHistory = async (type: HabitType, date: string, value: number) => {
    const newHistory = { ...history };
    newHistory[type] = { ...newHistory[type], [date]: value };
    setHistory(newHistory);
    
    let key = KEYS.WATER;
    if (type === 'food') key = KEYS.FOOD;
    if (type === 'workout') key = KEYS.WORKOUT;
    
    await AsyncStorage.setItem(key, JSON.stringify(newHistory[type]));
  };

  const updateTotal = async (type: HabitType, total: number) => {
    const newSettings = { ...settings };
    newSettings.totals[type] = total;
    setSettings(newSettings);
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(newSettings));
  };

  const today = getTodayDate();
  const habits: DailyHabitData = {
    water: history.water[today] || 0,
    food: history.food[today] || 0,
    workout: history.workout[today] || 0,
  };

  return (
    <HabitContext.Provider value={{ habits, history, settings, updateHabit, updateTotal, editHistory }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
