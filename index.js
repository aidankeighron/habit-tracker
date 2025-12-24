import 'expo-router/entry';
import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetTaskHandlerWrapper } from './widget-task-handler';

// Register the widget task handler
registerWidgetTaskHandler(widgetTaskHandlerWrapper);
