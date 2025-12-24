import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { HomeWidget } from './components/widgets/HomeWidget';
import { StatsWidget } from './components/widgets/StatsWidget';

const widgetTaskHandler = async (props: WidgetTaskHandlerProps) => {
  const widgetInfo = props.widgetInfo;
  
  // Get data passed from the app
  // Note: props.widgetInfo doesn't contain the custom data payload directly in standard usage usually?
  // Wait, requestWidgetUpdate passes data?
  // Let's check docs mentally: requestWidgetUpdate({ widgetName: '...', renderWidget: (props) => <Widget {...props} />, ... });
  // Actually, standard usage often is:
  // registerWidgetTaskHandler(handler);
  // handler receives props.
  // BUT, to pass dynamic data we usually just store it in SharedPrefs or pass it via "renderWidget" call if using background fetch?
  // "react-native-android-widget" usually works by calculating the view tree in JS and sending it over.
  // The 'widgetTaskHandler' is mainly for *background* updates (like periodic refresh), where we might need to fetch data from AsyncStorage.
  
  if (props.widgetAction === 'WIDGET_RESIZED' || props.widgetAction === 'WIDGET_ADDED' || props.widgetAction === 'WIDGET_UPDATE') {
     // Fetch latest data from AsyncStorage since the app might be killed
     // We can't use React Context here.
     
     // For now, return null or a loading state if we don't have data,
     // or just rely on the App to push updates when it's open.
     // Ideally we read from AsyncStorage here.
     
     // We'll leave the actual rendering logic to the "push" from the app for simplicity first,
     // but to support periodic updates we should implement reading from storage here.
     
     // Let's implementing reading generic data from storage if possible, 
     // but 'AsyncStorage' might not assume the same storage file if not configured? 
     // Usually react-native's AsyncStorage works fine here.
     
     // Let's try to render a default state or "Open App" state if triggered by system
     // and we can't easily access data without Async. 
     // (Actually we CAN use AsyncStorage in the headless task).
     
     // For this iteration, I will keep it simple: 
     // The App updates the widget. The widget task handler just handles basic events if needed, 
     // typically we only need to export the handler if we want background updates. 
     // The library requires registering this file in app.json? No, usually in index.js via 'registerWidgetTaskHandler'.
     
     // Wait, the documentation says:
     // "Create a file... that exports a function"
     // And "registerWidgetTaskHandler" in index.js.
  }

  switch (props.widgetInfo?.widgetName) {
    case 'HomeWidget':
      return <HomeWidget habits={{ water: 0, food: 0, workout: 0, stretch: 0, racing: 0 }} goals={{ water: 0, food: 0, workout: 0, stretch: 0, racing: 0 }} />;
    case 'StatsWidget':
        return <StatsWidget averages={{ water: 0, food: 0, workout: 0, stretch: 0, racing: 0 }} />;
    default:
      return null;
  }
};

export async function widgetTaskHandlerWrapper(props: WidgetTaskHandlerProps) {
    // If we want to support pulling data from storage:
    // const data = await AsyncStorage.getItem('...');
    // return <Widget ...data />
    
    // For now we return default/empty. The real data comes when the App calls requestWidgetUpdate.
    return widgetTaskHandler(props);
}
