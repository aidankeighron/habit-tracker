import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface WaterFoodHomeWidgetProps {
  habits: {
    water: number;
    food: number;
  };
  goals: {
    water: number;
    food: number;
  };
}

export function WaterFoodHomeWidget({ habits, goals }: WaterFoodHomeWidgetProps) {
  const getProgressColor = (current: number, goal: number) => {
    return current >= goal ? '#4CAF50' : '#FFC107';
  };

  const renderHabitRow = (label: string, current: number, goal: number) => (
    <FlexWidget
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        width: 'match_parent',
      }}
    >
      <TextWidget
        text={label}
        style={{ fontSize: 16, color: '#333333', fontWeight: 'bold' }}
      />
      <TextWidget
        text={`${current}/${goal}`}
        style={{
          fontSize: 16,
          color: getProgressColor(current, goal),
          fontWeight: 'bold',
        }}
      />
    </FlexWidget>
  );

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {renderHabitRow('Water', habits.water, goals.water)}
      {renderHabitRow('Food', habits.food, goals.food)}
    </FlexWidget>
  );
}
