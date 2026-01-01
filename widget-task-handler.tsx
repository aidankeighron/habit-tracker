import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { WaterFoodHomeWidget } from './components/widgets/WaterFoodHomeWidget';
import { WaterFoodStatsWidget } from './components/widgets/WaterFoodStatsWidget';
import { getLocalYYYYMMDD } from './utils/dateUtils';

const KEYS = {
  WATER: 'water_history',
  FOOD: 'food_history',
  SETTINGS: 'habit_settings',
};

// Helper to get effective date based on rollover hour
const getEffectiveDate = (rolloverHour: number = 0) => {
  const now = new Date();
  if (now.getHours() < rolloverHour) {
    now.setDate(now.getDate() - 1);
  }
  return getLocalYYYYMMDD(now);
};

export const renderWidgetIndependent = async (widgetName: string) => {
  try {
    const [waterStr, foodStr, settingsStr] = await Promise.all([
      AsyncStorage.getItem(KEYS.WATER),
      AsyncStorage.getItem(KEYS.FOOD),
      AsyncStorage.getItem(KEYS.SETTINGS),
    ]);

    const waterHistory = waterStr ? JSON.parse(waterStr) : {};
    const foodHistory = foodStr ? JSON.parse(foodStr) : {};
    const settings = settingsStr ? JSON.parse(settingsStr) : {};
    
    const rolloverHour = settings.rolloverHour || 0;
    const today = getEffectiveDate(rolloverHour);
    
    // Habits for Home Widget
    const waterVal = waterHistory[today] || 0;
    const foodVal = foodHistory[today] || 0;
    
    const totals = settings.totals || { water: 8, food: 3 };
    const goals = { water: totals.water || 8, food: totals.food || 3 };

    if (widgetName === 'HomeWaterFoodLarge') {
       return <WaterFoodHomeWidget habits={{ water: waterVal, food: foodVal }} goals={goals} />;
    }
    
    if (widgetName === 'StatsWaterFoodLarge') {
       // Calculate averages (last 7 days)
       const getAvg = (hist: any) => {
           let sum = 0;
           for(let i=0; i<7; i++) {
               // Calculate date going back from 'today'
               const parts = today.split('-').map(Number);
               const d = new Date(parts[0], parts[1]-1, parts[2]); 
               d.setDate(d.getDate() - i);
               const dateStr = getLocalYYYYMMDD(d);
               sum += hist[dateStr] || 0;
           }
           return sum / 7;
       };
       
       const averages = {
           water: getAvg(waterHistory),
           food: getAvg(foodHistory),
       };
       
       return <WaterFoodStatsWidget averages={averages} />;
    }
  } catch (e) {
    console.error('Widget Data Load Error:', e);
  }
  return null;
}

const widgetTaskHandler = async (props: WidgetTaskHandlerProps) => {
  const name = props.widgetInfo?.widgetName;
  if(name) {
    const widget = await renderWidgetIndependent(name);
    if(widget) return widget;
  }
  return null;
};

export async function widgetTaskHandlerWrapper(props: WidgetTaskHandlerProps) {
    return widgetTaskHandler(props);
}

