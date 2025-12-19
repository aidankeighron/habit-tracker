import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { getLocalYYYYMMDD } from '../utils/dateUtils';

export interface CustomNotification {
  id: string;
  title: string;
  time: string; // ISO string for the time
  days: number[]; // 0-6, Sunday is 0
  colorHue: number; // 0-360
}

interface CustomNotificationContextType {
  notifications: CustomNotification[];
  addNotification: (n: Omit<CustomNotification, 'id'>) => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
}

const CustomNotificationContext = createContext<CustomNotificationContextType | undefined>(undefined);

const STORAGE_KEY = 'custom_notifications';

export const CustomNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<CustomNotification[]>([]);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App came to foreground, refresh schedule
        scheduleAllNotifications(notifications);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [notifications]);

  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotifications(parsed);
        // We also want to ensure scheduling is up to date when we load up
        scheduleAllNotifications(parsed);
      }
    } catch (e) {
      console.error('Failed to load custom notifications', e);
    }
  };

  const addNotification = async (n: Omit<CustomNotification, 'id'>) => {
    // Simple random ID generator (timestamp + random string)
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const newNotification = { ...n, id };
    const updated = [...notifications, newNotification];
    setNotifications(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    scheduleAllNotifications(updated);
  };

  const removeNotification = async (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    // Clean up schedules for this ID
    await cancelNotificationsForId(id);
    // allow scheduling to fill in gaps if removing one somehow affects others (unlikely, but good practice to sync)
    // Actually, simply removing the specific ones is enough.
  };

  const cancelNotificationsForId = async (id: string) => {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of scheduled) {
        if (notification.content.data?.customNotificationId === id) {
            await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
    }
  };

  const scheduleAllNotifications = async (currentNotifications: CustomNotification[]) => {
    // 1. Clean up "orphaned" notifications (in case deletion failed previously or something desynced)
    // We can iterate all scheduled, check if their customNotificationId exists in current list.
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const currentIds = new Set(currentNotifications.map(n => n.id));
    
    for (const notification of scheduled) {
        const nid = notification.content.data?.customNotificationId;
        // Only touch our custom ones
        if (nid && !currentIds.has(nid)) {
             await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
    }

    // 2. Schedule for the next 30 days
    // We use a deterministic identifier: custom-{id}-{YYYYMMDD}
    // Expo allows replacing existing notification with same identifier, so we can just fire away.
    
    const today = new Date();
    
    for (const n of currentNotifications) {
        const notifTime = new Date(n.time);
        const hour = notifTime.getHours();
        const minute = notifTime.getMinutes();

        for (let i = 0; i < 30; i++) {
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + i);
            targetDate.setHours(hour, minute, 0, 0);

            // If target date is in the past (e.g. earlier today), skip
            if (targetDate.getTime() < Date.now()) {
                continue;
            }

            if (n.days.includes(targetDate.getDay())) {
                const identifier = `custom-${n.id}-${getLocalYYYYMMDD(targetDate)}`;
                
                // Check if already scheduled? Not strictly necessary if "replace" works, but safer to check to avoid churn
                 // Optimized: Just schedule it. `scheduleNotificationAsync` with identifier updates it.
                 // Wait, blindly calling `scheduleNotificationAsync` 30 times * N notifications on every app open might be heavy?
                 // Let's filter: check if `identifier` is in `scheduled` list identifiers.
                 const isAlreadyScheduled = scheduled.some(s => s.identifier === identifier);
                 
                 if (!isAlreadyScheduled) {
                     await Notifications.scheduleNotificationAsync({
                         content: {
                             title: n.title,
                             body: "It's time!",
                             data: { customNotificationId: n.id },
                             color: `hsl(${n.colorHue}, 100%, 50%)`, // Attempt to set color, though android support varies
                         },
                         trigger: {
                            type: Notifications.SchedulableTriggerInputTypes.DATE,
                            date: targetDate, 
                         },
                         identifier,
                     });
                 }
            }
        }
    }
  };

  return (
    <CustomNotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </CustomNotificationContext.Provider>
  );
};

export const useCustomNotifications = () => {
  const context = useContext(CustomNotificationContext);
  if (!context) {
    throw new Error('useCustomNotifications must be used within a CustomNotificationProvider');
  }
  return context;
};
