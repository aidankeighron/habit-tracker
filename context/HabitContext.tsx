import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { DailyHabitData, HabitContextType, HabitHistory, HabitSettings, HabitType } from '../types';

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const KEYS = {
  WATER: 'water_history',
  FOOD: 'food_history',
  WORKOUT: 'workout_history',
  STRETCH: 'stretch_history',
  LAST_UPDATED: 'last_updated',
  SETTINGS: 'habit_settings',
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<{
    water: HabitHistory;
    food: HabitHistory;
    workout: HabitHistory;
    stretch: HabitHistory;
  }>({
    water: {},
    food: {},
    workout: {},
    stretch: {},
  });

  const [lastUpdated, setLastUpdated] = useState<{
    water: string | null;
    food: string | null;
    workout: string | null;
    stretch: string | null;
  }>({
    water: null,
    food: null,
    workout: null,
    stretch: null,
  });

  const [settings, setSettings] = useState<HabitSettings>({
    totals: { water: 8, food: 3, workout: 30, stretch: 2 },
    notifications: { water: 2, food: 4, workout: 16, stretch: 6 }, // Default hours
  });

  const appState = useRef(AppState.currentState);

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadData();
    registerForPushNotificationsAsync();
  }, []);

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
  }

  const loadData = async () => {
    try {
      const [water, food, workout, stretch, storedSettings, storedLastUpdated] = await Promise.all([
        AsyncStorage.getItem(KEYS.WATER),
        AsyncStorage.getItem(KEYS.FOOD),
        AsyncStorage.getItem(KEYS.WORKOUT),
        AsyncStorage.getItem(KEYS.STRETCH),
        AsyncStorage.getItem(KEYS.SETTINGS),
        AsyncStorage.getItem(KEYS.LAST_UPDATED),
      ]);

      setHistory({
        water: water ? JSON.parse(water) : {},
        food: food ? JSON.parse(food) : {},
        workout: workout ? JSON.parse(workout) : {},
        stretch: stretch ? JSON.parse(stretch) : {},
      });

      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
      
      if (storedLastUpdated) {
        setLastUpdated(JSON.parse(storedLastUpdated));
      }
    } catch (e) {
      console.error('Failed to load habit data', e);
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        refreshNotifications();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [lastUpdated, settings]);

  const refreshNotifications = async () => {
    await Promise.all([
      scheduleReminder('water'),
      scheduleReminder('food'),
      scheduleReminder('workout'),
      scheduleReminder('stretch'),
    ]);
  };
  
  const scheduleReminder = async (type: HabitType) => {
    const lastUpdateStr = lastUpdated[type];
    const intervalHours = settings.notifications[type];
    
    if (!lastUpdateStr || !intervalHours) return; // If no data, don't schedule
    
    // We pass current values to the helper logic
    scheduleReminderForType(type, lastUpdateStr, intervalHours);
  };

  const scheduleReminderForType = async (type: HabitType, lastUpdateStr: string, intervalHours: number) => {
      const identifier = `reminder-${type}`;
      await Notifications.cancelScheduledNotificationAsync(identifier);
      
      const lastUpdate = new Date(lastUpdateStr);
      const now = new Date();
      // Calculate trigger date
      const triggerDate = new Date(lastUpdate.getTime() + intervalHours * 60 * 60 * 1000);
      
      let secondsUntil = (triggerDate.getTime() - now.getTime()) / 1000;
      
      if (secondsUntil <= 0) {
        secondsUntil = 1; 
      }
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Habit Reminder",
          body: `It's been a while since you updated your ${type} habit!`,
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: Math.max(1, Math.floor(secondsUntil)) },
        identifier,
      });
  };

  const updateHabit = async (type: HabitType, value: number) => {
    const today = getTodayDate();
    const newHistory = { ...history };
    newHistory[type] = { ...newHistory[type], [today]: value };
    setHistory(newHistory);
    
    // Update Last Updated
    const nowStr = new Date().toISOString();
    const newLastUpdated = { ...lastUpdated, [type]: nowStr };
    setLastUpdated(newLastUpdated);
    
    let key = KEYS.WATER;
    if (type === 'food') key = KEYS.FOOD;
    if (type === 'workout') key = KEYS.WORKOUT;
    if (type === 'stretch') key = KEYS.STRETCH;
    
    await AsyncStorage.setItem(key, JSON.stringify(newHistory[type]));
    await AsyncStorage.setItem(KEYS.LAST_UPDATED, JSON.stringify(newLastUpdated));
    
    scheduleReminderForType(type, nowStr, settings.notifications[type]);
  };

  const editHistory = async (type: HabitType, date: string, value: number) => {
    const newHistory = { ...history };
    newHistory[type] = { ...newHistory[type], [date]: value };
    setHistory(newHistory);
    
    let key = KEYS.WATER;
    if (type === 'food') key = KEYS.FOOD;
    if (type === 'workout') key = KEYS.WORKOUT;
    if (type === 'stretch') key = KEYS.STRETCH;
    
    await AsyncStorage.setItem(key, JSON.stringify(newHistory[type]));
  };

  const updateTotal = async (type: HabitType, total: number) => {
    const newSettings = { ...settings };
    newSettings.totals[type] = total;
    setSettings(newSettings);
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(newSettings));
  };
  
  const updateNotificationInterval = async (type: HabitType, hours: number) => {
    const newSettings = { ...settings };
    newSettings.notifications[type] = hours;
    setSettings(newSettings);
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(newSettings));
    
    // Reschedule immediate
    if (lastUpdated[type]) {
        scheduleReminderForType(type, lastUpdated[type]!, hours);
    }
  };

  const today = getTodayDate();
  const habits: DailyHabitData = {
    water: history.water[today] || 0,
    food: history.food[today] || 0,
    workout: history.workout[today] || 0,
    stretch: history.stretch[today] || 0,
  };

  return (
    <HabitContext.Provider value={{ habits, history, settings, lastUpdated, updateHabit, updateTotal, editHistory, updateNotificationInterval } as any}>
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
