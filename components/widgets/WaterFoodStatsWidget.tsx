import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface WaterFoodStatsWidgetProps {
    averages: {
        water: number;
        food: number;
    };
}

export function WaterFoodStatsWidget({ averages }: WaterFoodStatsWidgetProps) {
  const renderStatRow = (label: string, avg: number) => (
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
        text={`${avg.toFixed(1)} avg`}
        style={{
          fontSize: 16,
          color: '#555555',
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
      <TextWidget
         text="7-Day Avg"
         style={{
            fontSize: 14,
            color: '#888888',
            marginBottom: 8,
            fontWeight: 'bold'
         }}
      />
      {renderStatRow('Water', averages.water)}
      {renderStatRow('Food', averages.food)}
    </FlexWidget>
  );
}
