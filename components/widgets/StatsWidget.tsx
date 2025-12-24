import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface StatsWidgetProps {
    // We'll just show the last 7 days summary for a primary habit (e.g. Water) or simple numeric stats for now
    // due to complexity of charts. Let's show Today vs Average of last 7 days?
    // Or maybe just the current "streak" information if we had it.
    // Let's go with: Daily Completion Rates for the 5 habits (last 7 days average)
    averages: {
        water: number;
        food: number;
        workout: number;
        stretch: number;
        racing: number;
    };
}

export function StatsWidget({ averages }: StatsWidgetProps) {
  const renderStatRow = (label: string, avg: number) => (
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
        text={`${avg.toFixed(1)} avg`}
        style={{
          fontSize: 14,
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
        padding: 12,
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}
    >
      <TextWidget
        text="7-Day Averages"
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: '#000000',
          marginBottom: 8,
          textAlign: 'center',
        }}
      />
      
      {renderStatRow('Water', averages.water)}
      {renderStatRow('Food', averages.food)}
      {renderStatRow('Workout', averages.workout)}
      {renderStatRow('Stretch', averages.stretch)}
      {renderStatRow('Racing', averages.racing)}
    </FlexWidget>
  );
}
