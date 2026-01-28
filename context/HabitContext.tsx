// import notifee, { AndroidImportance, TriggerType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { DailyHabitData, HabitContextType, HabitHistory, HabitSettings, HabitType } from '../types';
import { getLocalYYYYMMDD } from '../utils/dateUtils';
import { supabase } from '../utils/supabase';


const HabitContext = createContext<HabitContextType | undefined>(undefined);

const getEffectiveDate = (rolloverHour: number = 0) => {
  const now = new Date();
  if (now.getHours() < rolloverHour) {
    now.setDate(now.getDate() - 1);
  }
  return getLocalYYYYMMDD(now);
};

const KEYS = {
  WATER: 'water_history',
  FOOD: 'food_history',
  WORKOUT: 'workout_history',
  STRETCH: 'stretch_history',
  RACING: 'racing_history',
  LAST_UPDATED: 'last_updated',
  SETTINGS: 'habit_settings',
};


export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<{
    water: HabitHistory;
    food: HabitHistory;
    workout: HabitHistory;
    stretch: HabitHistory;
    racing: HabitHistory;
  }>({
    water: {},
    food: {},
    workout: {},
    stretch: {},
    racing: {},
  });
  
  const [lastUpdated, setLastUpdated] = useState<{
    water: string | null;
    food: string | null;
    workout: string | null;
    stretch: string | null;
    racing: string | null;
  }>({
    water: null,
    food: null,
    workout: null,
    stretch: null,
    racing: null,
  });
  
  const [settings, setSettings] = useState<HabitSettings>({
    totals: { water: 8, food: 3, workout: 30, stretch: 2, racing: 1 },
    notifications: { water: 2, food: 4, workout: 16, stretch: 6, racing: -1 }, // Default hours
    rolloverHour: 0,
  });
  
  const [today, setToday] = useState(getEffectiveDate(0));
  
  const appState = useRef(AppState.currentState);
  
  // const getTodayDate = () => new Date().toISOString().split('T')[0]; // Removed in favor of today state
  
  useEffect(() => {
    loadData();
    registerForPushNotificationsAsync();
  }, []);
  
  async function registerForPushNotificationsAsync() {
    // if (Platform.OS === 'android') {
    //   await notifee.createChannelGroup({
    //     id: 'habitGroup',
    //     name: 'Habit Reminders',
    //   });
    //   await notifee.createChannel({
    //     id: 'habitReminders',
    //     name: 'Habit Reminders',
    //     importance: AndroidImportance.HIGH,
    //     groupId: 'habitGroup',
    //   });
    // }
    
    // await notifee.requestPermission();
  }
  
    const ensureAuthenticated = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) return session.user.id;
      
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        console.error('Supabase Auth Error:', error.message);
        return null; // Return null if auth fails (e.g. Anon disabled)
      }
      return data.user?.id;
    };

  const syncToPostgres = async (allHistory: { [key: string]: HabitHistory }) => {
    try {
      const userId = await ensureAuthenticated();
      
      if (!userId) {
        console.error('Cannot sync: User not authenticated. Enable Anonymous Sign-ins in Supabase or log in.');
        return;
      }

      const upsertData: any[] = [];
      const types = ['water', 'food', 'workout', 'stretch', 'racing'];
      
      types.forEach(type => {
        const historyData = allHistory[type];
        if (historyData) {
            Object.entries(historyData).forEach(([date, value]) => {
                upsertData.push({
                    user_id: userId,
                    date: date,
                    habit_type: type,
                    value: Number(value),
                    updated_at: new Date().toISOString()
                });
            });
        }
      });

      if (upsertData.length > 0) {
          const { error } = await supabase.from('habits').upsert(upsertData, { onConflict: 'user_id,date,habit_type' });
          if (error) console.error('Supabase Sync Error:', error.message);
          else console.log('Synced', upsertData.length, 'rows to Supabase');
      }
    } catch (err) {
        console.error('Sync failed', err);
    }
  };

  const loadData = async () => {
    try {
      const [water, food, workout, stretch, racing, storedSettings, storedLastUpdated] = await Promise.all([
        AsyncStorage.getItem(KEYS.WATER),
        AsyncStorage.getItem(KEYS.FOOD),
        AsyncStorage.getItem(KEYS.WORKOUT),
        AsyncStorage.getItem(KEYS.STRETCH),
        AsyncStorage.getItem(KEYS.RACING),
        AsyncStorage.getItem(KEYS.SETTINGS),
        AsyncStorage.getItem(KEYS.LAST_UPDATED),
      ]);
      
      const parsedWater = water ? JSON.parse(water) : {};
      const parsedFood = food ? JSON.parse(food) : {};
      const parsedWorkout = workout ? JSON.parse(workout) : {};
      const parsedStretch = stretch ? JSON.parse(stretch) : {};
      const parsedRacing = racing ? JSON.parse(racing) : {};

      const fullHistory = {
        water: parsedWater,
        food: parsedFood,
        workout: parsedWorkout,
        stretch: parsedStretch,
        racing: parsedRacing,
      };

      setHistory(fullHistory);

      // Trigger sync
      syncToPostgres(fullHistory);
      
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        
        // Ensure defaults for new fields exist for existing users
        if (parsedSettings.rolloverHour === undefined) {
          parsedSettings.rolloverHour = 0;
        }
        
        if (parsedSettings.totals.racing === undefined) {
          parsedSettings.totals.racing = 1;
        }
        
        if (parsedSettings.notifications.racing === undefined) {
          parsedSettings.notifications.racing = -1;
        }
        
        setSettings(parsedSettings);
        setToday(getEffectiveDate(parsedSettings.rolloverHour));
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
        // Check if date changed
        const currentEffectiveDate = getEffectiveDate(settings.rolloverHour);
        if (currentEffectiveDate !== today) {
          setToday(currentEffectiveDate);
        }
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
      scheduleReminder('racing'),
    ]);
    

  };
  
  const scheduleReminder = async (type: HabitType) => {
    const lastUpdateStr = lastUpdated[type];
    const intervalHours = settings.notifications[type];
    
    if (!lastUpdateStr || !intervalHours || intervalHours <= 0) return; // If no data or disabled (<= 0), don't schedule
    
    // We pass current values to the helper logic
    scheduleReminderForType(type, lastUpdateStr, intervalHours);
  };
  
  const scheduleReminderForType = async (type: HabitType, lastUpdateStr: string, intervalHours: number) => {
    const identifier = `reminder-${type}`;
    // await notifee.cancelNotification(identifier);
    
    const lastUpdate = new Date(lastUpdateStr);
    const now = new Date();
    // Calculate trigger date
    const triggerDate = new Date(lastUpdate.getTime() + intervalHours * 60 * 60 * 1000);
    
    if (triggerDate.getTime() <= now.getTime()) {
      // If it's already past due, maybe schedule for immediate or +1 min?
      // Or just let it trigger now?
      // The old logic: secondsUntil = 1.
      triggerDate.setTime(now.getTime() + 1000);
    }

    let title: string = type;
    if (type == "food") {
      title = "Eat Food"
    }
    else if (type == "water") {
      title = "Drink Water"
    }

    // await notifee.createTriggerNotification(
    //   {
    //     id: identifier,
    //     title,
    //     body: `Do your habit!`,
    //     android: {
    //         channelId: 'habitReminders',
    //         groupId: 'habit_reminders_group',
    //         smallIcon: 'notification_icon',
    //     }
    //   },
    //   {
    //     type: TriggerType.TIMESTAMP,
    //     timestamp: triggerDate.getTime(),
    //   }
    // );
  };
  
  const updateHabit = async (type: HabitType, value: number) => {
    // Use the reactive 'today' state
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
    if (type === 'racing') key = KEYS.RACING;
    
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
    if (type === 'racing') key = KEYS.RACING;
    
    await AsyncStorage.setItem(key, JSON.stringify(newHistory[type]));
  };
  
  const updateDailyHistory = async (date: string, values: DailyHabitData) => {
    const newHistory = { ...history };
    
    // Update state for all keys first
    newHistory.water = { ...newHistory.water, [date]: values.water };
    newHistory.food = { ...newHistory.food, [date]: values.food };
    newHistory.workout = { ...newHistory.workout, [date]: values.workout };
    newHistory.stretch = { ...newHistory.stretch, [date]: values.stretch };
    newHistory.racing = { ...newHistory.racing, [date]: values.racing };
    
    setHistory(newHistory);
    
    // Save all to async storage in parallel, keys are distinct so no race condition actually
    await Promise.all([
      AsyncStorage.setItem(KEYS.WATER, JSON.stringify(newHistory.water)),
      AsyncStorage.setItem(KEYS.FOOD, JSON.stringify(newHistory.food)),
      AsyncStorage.setItem(KEYS.WORKOUT, JSON.stringify(newHistory.workout)),
      AsyncStorage.setItem(KEYS.STRETCH, JSON.stringify(newHistory.stretch)),
      AsyncStorage.setItem(KEYS.RACING, JSON.stringify(newHistory.racing)),
    ]);
  };
  
  const updateTotal = async (type: HabitType, total: number) => {
    const newSettings = { ...settings };
    newSettings.totals[type] = total;
    setSettings(newSettings);
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(newSettings));
  };
  
  const updateHabitTotals = async (totals: HabitSettings['totals']) => {
    const newSettings = { ...settings, totals: { ...settings.totals, ...totals } };
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
  
  // Assuming there's an interface definition for HabitContextType somewhere above this,
  // we're adding resetHabitNotifications to it.
  // For example, if the interface looked like this:
  // interface HabitContextType {
  //   habits: DailyHabitData;
  //   history: HabitHistory;
  //   settings: HabitSettings;
  //   lastUpdated: LastUpdated;
  //   today: string;
  //   updateHabit: (type: HabitType, value: number) => Promise<void>;
  //   updateTotal: (type: HabitType, total: number) => Promise<void>;
  //   updateHabitTotals: (totals: HabitSettings['totals']) => Promise<void>;
  //   editHistory: (type: HabitType, date: string, value: number) => Promise<void>;
  //   updateDailyHistory: (date: string, values: DailyHabitData) => Promise<void>;
  //   updateNotificationInterval: (type: HabitType, hours: number) => Promise<void>;
  //   updateNotificationIntervals: (intervals: HabitSettings['notifications']) => Promise<void>;
  //   updateRolloverHour: (hour: number) => Promise<void>;
  //   resetHabitNotifications: () => Promise<void>; // This line would be added
  // }
  
  const updateNotificationIntervals = async (intervals: HabitSettings['notifications']) => {
    const newSettings = { ...settings, notifications: { ...settings.notifications, ...intervals } };
    setSettings(newSettings);
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(newSettings));
    
    // Reschedule all
    for (const type of Object.keys(intervals) as HabitType[]) {
      if (lastUpdated[type]) {
        scheduleReminderForType(type, lastUpdated[type]!, intervals[type]);
      }
    }
  };
  
  const updateRolloverHour = async (hour: number) => {
    const newSettings = { ...settings };
    newSettings.rolloverHour = hour;
    setSettings(newSettings);
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(newSettings));
    
    // Recalculate today immediately
    const newToday = getEffectiveDate(hour);
    if (newToday !== today) {
      setToday(newToday);
    }
  };
  
  const resetHabitNotifications = async () => {
    // Cancel all habit reminders
    // await Promise.all([
    //   notifee.cancelNotification('reminder-water'),
    //   notifee.cancelNotification('reminder-food'),
    //   notifee.cancelNotification('reminder-workout'),
    //   notifee.cancelNotification('reminder-stretch'),
    //   notifee.cancelNotification('reminder-racing'),
    // ]);
    // Re-schedule
    await refreshNotifications();
  };
  
  const habits: DailyHabitData = {
    water: history.water[today] || 0,
    food: history.food[today] || 0,
    workout: history.workout[today] || 0,
    stretch: history.stretch[today] || 0,
    racing: history.racing[today] || 0,
  };
  
  const syncHabits = async () => {
    await syncToPostgres(history);
  };

  return (
    <HabitContext.Provider value={{ habits, history, settings, lastUpdated, today, updateHabit, updateTotal, updateHabitTotals, editHistory, updateDailyHistory, updateNotificationInterval, updateNotificationIntervals, updateRolloverHour, resetHabitNotifications, syncHabits } as any}>
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
