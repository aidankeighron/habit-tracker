import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { WaterFoodHomeWidget } from './components/widgets/WaterFoodHomeWidget';
import { WaterFoodStatsWidget } from './components/widgets/WaterFoodStatsWidget';

const widgetTaskHandler = async (props: WidgetTaskHandlerProps) => {
  // Note: Standard background update logic would go here if we were pulling from AsyncStorage
  // For now, these default returns prevent crashes if the system tries to update them without app data.

  switch (props.widgetInfo?.widgetName) {
    case 'HomeWaterFoodLarge':
      return <WaterFoodHomeWidget habits={{water: 0, food: 0}} goals={{water: 0, food: 0}} />;
    case 'StatsWaterFoodLarge':
      return <WaterFoodStatsWidget averages={{water: 0, food: 0}} />;
    default:
      return null;
  }
};

export async function widgetTaskHandlerWrapper(props: WidgetTaskHandlerProps) {
    return widgetTaskHandler(props);
}
