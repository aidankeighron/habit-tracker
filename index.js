import notifee, { EventType } from '@notifee/react-native';
import 'expo-router/entry';
import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetTaskHandlerWrapper } from './widget-task-handler';

// Register the widget task handler
registerWidgetTaskHandler(widgetTaskHandlerWrapper);

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  // Check if the user pressed the "completed" action
  if (type === EventType.ACTION_PRESS && pressAction.id === 'completed') {
    // Remove the notification
    await notifee.cancelNotification(notification.id);
  }
});
