import notifee, { EventType } from '@notifee/react-native';
import 'expo-router/entry';

notifee.registerForegroundService((notification) => {
  return new Promise(() => {
    // Long running task...
  });
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  // Check if the user pressed the "completed" action
  if (type === EventType.ACTION_PRESS && pressAction.id === 'completed') {
    // Remove the notification
    await notifee.cancelNotification(notification.id);
  }
});
