import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface HomeWidgetProps {
  habits: {
    water: number;
    food: number;
    workout: number;
    stretch: number;
    racing: number;
  };
  goals: {
    water: number;
    food: number;
    workout: number;
    stretch: number;
    racing: number;
  };
}

export function HomeWidget({ habits, goals }: HomeWidgetProps) {
  const getProgressColor = (current: number, goal: number) => {
    return current >= goal ? '#4CAF50' : '#FFC107'; // Green if met, Amber if not
  };

  const renderHabitRow = (label: string, current: number, goal: number) => (
    <FlexWidget
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
        width: 'match_parent',
      }}
    >
      <TextWidget
        text={label}
        style={{ fontSize: 14, color: '#333333', fontWeight: 'bold' }}
      />
      <TextWidget
        text={`${current}/${goal}`}
        style={{
          fontSize: 14,
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
        padding: 12,
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}
    >
      <TextWidget
        text="Daily Habits"
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: '#000000',
          marginBottom: 8,
          textAlign: 'center',
        }}
      />
      
      {renderHabitRow('Water', habits.water, goals.water)}
      {renderHabitRow('Food', habits.food, goals.food)}
      {renderHabitRow('Workout', habits.workout, goals.workout)}
      {renderHabitRow('Stretch', habits.stretch, goals.stretch)}
      {renderHabitRow('Racing', habits.racing, goals.racing)}
    </FlexWidget>
  );
}
