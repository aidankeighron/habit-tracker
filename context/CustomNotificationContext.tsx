// import notifee, { AndroidImportance, EventType, TriggerType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import React, { createContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { getLocalYYYYMMDD } from '../utils/dateUtils';

// Helper to convert HSL to Hex
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export interface CustomNotification {
  id: string;
  title: string;
  time: string; // ISO string for the time
  startDates: string; // ISO string (new Date().toISOString()) representing when this was created/started
  days: number[]; // 0-6, Sunday is 0. Used when repeatType is 'week'
  colorHue: number; // 0-360
  
  repeatType: 'week' | 'iteration';
  repeatFrequencyWeeks?: number; // Used if repeatType === 'week', default 1
  iterationFrequencyDays?: number; // Used if repeatType === 'iteration', default 2
}

interface CustomNotificationContextType {
  notifications: CustomNotification[];
  addNotification: (n: Omit<CustomNotification, 'id'>) => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  resetCustomNotifications: () => Promise<void>;
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
    // Create the custom channel group and channel
    // if (Platform.OS === 'android') {
    //   (async () => {
    //     await notifee.createChannelGroup({
    //       id: 'customGroup',
    //       name: 'Scheduled Habits',
    //     });
    //     await notifee.createChannel({
    //       id: 'customScheduled',
    //       name: 'Scheduled Habits',
    //       importance: AndroidImportance.HIGH,
    //       groupId: 'customGroup',
    //     });
    //   })()
    // }
    
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
    
    // Foreground listener for actions
    // const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
    //   if (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'completed') {
    //     if (detail.notification?.id) {
    //       notifee.cancelNotification(detail.notification.id);
    //     }
    //   }
    // });

    return () => {
      subscription.remove();
      // unsubscribe();
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
    // const scheduled = await notifee.getTriggerNotificationIds();
    // for (const notificationId of scheduled) {
    //   // We check if the ID starts with our pattern or check data if possible. 
    //   // Notifee getTriggerNotificationIds returns string[]. 
    //   // We used custom-{id}-{YYYYMMDD}. 
    //   if (notificationId.includes(`custom-${id}-`)) {
    //     await notifee.cancelNotification(notificationId);
    //   }
    // }
  };
  
  const resetCustomNotifications = async () => {
    // Clear legacy/expo notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // const scheduled = await notifee.getTriggerNotificationIds();
    // for (const notificationId of scheduled) {
    //   if (notificationId.startsWith('custom-')) {
    //      await notifee.cancelNotification(notificationId);
    //   }
    // }
    // Re-schedule everything from scratch
    await scheduleAllNotifications(notifications);
  };
  
  const scheduleAllNotifications = async (currentNotifications: CustomNotification[]) => {
    // 1. Clean up "orphaned" notifications (in case deletion failed previously or something desynced)
    // We can iterate all scheduled, check if their customNotificationId exists in current list.
    // const scheduled = await notifee.getTriggerNotificationIds();
    // const currentIds = new Set(currentNotifications.map(n => n.id));
    
    // for (const notificationId of scheduled) {
    //     // notificationId format: custom-{n.id}-{date}
    //     if (notificationId.startsWith('custom-')) {
    //         const parts = notificationId.split('-');
    //         // custom, id, date... might be complex if id has dashes. 
    //         // Our ID generator in addNotification: Date.now().toString(36) + random
    //         // No dashes in that ID usually? Date.now is alphanumeric.
    //         // Let's assume ID is safe or we can use regex.
    //         // Actually simpler: we can check if the ID matches any valid pattern from current list.
            
    //         const isValid = currentNotifications.some(n => notificationId.includes(`custom-${n.id}-`));
    //         if (!isValid) {
    //             await notifee.cancelNotification(notificationId);
    //         }
    //     }
    // }
    
    // 2. Schedule for the next 30 days
    // We use a deterministic identifier: custom-{id}-{YYYYMMDD}
    // Expo allows replacing existing notification with same identifier, so we can just fire away.
    
    const today = new Date();
    // Reset today to midnight for date calculations
    const todayMidnight = new Date(today);
    todayMidnight.setHours(0, 0, 0, 0);
    
    for (const n of currentNotifications) {
      const notifTime = new Date(n.time);
      const hour = notifTime.getHours();
      const minute = notifTime.getMinutes();
      
      // Default start date to now if missing (migration)
      const startDate = n.startDates ? new Date(n.startDates) : new Date();
      const startMidnight = new Date(startDate);
      startMidnight.setHours(0, 0, 0, 0);
      
      // Normalize defaults
      const rType = n.repeatType || 'week';
      const freqWeeks = n.repeatFrequencyWeeks || 1;
      const iterDays = n.iterationFrequencyDays || 2;
      
      for (let i = 0; i < 30; i++) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + i);
        const targetMidnight = new Date(targetDate);
        targetMidnight.setHours(0, 0, 0, 0);
        
        // If target date is in the past (e.g. earlier today), skip
        // We'll set the specific notification time on targetDate to check
        const targetDateTime = new Date(targetDate);
        targetDateTime.setHours(hour, minute, 0, 0);
        
        if (targetDateTime.getTime() < Date.now()) {
          continue;
        }
        
        let shouldSchedule = false;
        
        if (rType === 'iteration') {
          // Iteration logic: (target - start) % frequency == 0
          const diffTime = targetMidnight.getTime() - startMidnight.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          // If diffDays is negative (target before start), shouldn't happen with correct startDate logic but good to check
          if (diffDays >= 0 && diffDays % iterDays === 0) {
            shouldSchedule = true;
          }
          
        } else {
          // Week logic
          // Check if day of week matches
          if (n.days.includes(targetDate.getDay())) {
            // Check week frequency
            // Calculate weeks since start
            // We need to align 'weeks' correctly.
            // Simple approach: diff in days from start / 7.
            // But we actually want "calendar weeks" usually? 
            // Requirement: "Next iteration should always happen and then it will start skipping weeks."
            // Implies: If this week is active, next week (if freq=2) is skipped.
            // Let's use difference in full weeks from start date Sunday-based or just pure 7-day chunks.
            // User said: "next iteration should always happen" - likely means from creation.
            
            // Let's rely on Sunday as start of week for simplicity or just align with startDate's week.
            // Let's align with startDate.
            // Calculate week index relative to start date.
            
            // Get 'Monday' (or Sunday) of the start date week.
            const getWeekStart = (d: Date) => {
              const day = d.getDay(); // 0 is Sunday
              const diff = d.getDate() - day; // adjust when day is sunday
              return new Date(d.setDate(diff)); // Sunday start
            };
            
            // Note: This modifies 'd' in place with setDate if not careful? 
            // No, new Date(d) copies first.
            // Actually setDate returns timestamp.
            
            // Safer:
            const startOfWeek_StartDate = new Date(startMidnight);
            startOfWeek_StartDate.setDate(startMidnight.getDate() - startMidnight.getDay());
            startOfWeek_StartDate.setHours(0,0,0,0);
            
            const startOfWeek_TargetDate = new Date(targetMidnight);
            startOfWeek_TargetDate.setDate(targetMidnight.getDate() - targetMidnight.getDay());
            startOfWeek_TargetDate.setHours(0,0,0,0);
            
            const diffTime = startOfWeek_TargetDate.getTime() - startOfWeek_StartDate.getTime();
            const diffWeeks = Math.round(diffTime / (1000 * 60 * 60 * 24 * 7));
            
            if (diffWeeks >= 0 && diffWeeks % freqWeeks === 0) {
              shouldSchedule = true;
            }
          }
        }
        
        if (shouldSchedule) {
          const identifier = `custom-${n.id}-${getLocalYYYYMMDD(targetDate)}`;
          
          // const isAlreadyScheduled = scheduled.includes(identifier);
          
          // if (!isAlreadyScheduled) {
            //  await notifee.createTriggerNotification(
            //   {
            //     id: identifier,
            //     title: n.title,
            //     android: {
            //       channelId: 'customScheduled',
            //       smallIcon: 'custom_notification_icon',
            //       color: hslToHex(n.colorHue, 100, 50),
            //       groupId: 'scheduled_habits_group',
            //       actions: [
            //         {
            //           title: 'Completed',
            //           pressAction: { id: 'completed' },
            //         },
            //       ],
            //     },
            //     data: { customNotificationId: n.id },
            //   },
            //   {
            //     type: TriggerType.TIMESTAMP,
            //     timestamp: targetDateTime.getTime(),
            //   }
            // );
          // }
        }
      }
    }

  };
  
  return (
    <CustomNotificationContext.Provider value={{ notifications, addNotification, removeNotification, resetCustomNotifications }}>
    {children}
    </CustomNotificationContext.Provider>
  );
};


