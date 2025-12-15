import { Colors } from '@/constants/Colors';
import { useHabits } from '@/context/HabitContext';
import { getPastDaysCoordinates, getPastWeeksCoordinates } from '@/utils/dateUtils';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

type TimeRange = '7days' | '14days' | '7weeksAVG' | '7weeksTOT';

export default function StatsScreen() {
  const { history } = useHabits();
  const [range, setRange] = useState<TimeRange>('7days');
  const [showDropdown, setShowDropdown] = useState(false);

  const ranges: { label: string, value: TimeRange }[] = [
    { label: 'Last 7 Days', value: '7days' },
    { label: 'Last 14 Days', value: '14days' },
    { label: 'Last 7 Weeks (Avg)', value: '7weeksAVG' },
    { label: 'Last 7 Weeks (Tot)', value: '7weeksTOT' },
  ];

  const getData = (type: 'water' | 'food' | 'workout') => {
    const habitHistory = history[type];
    let labels: string[] = [];
    let data: number[] = [];

    if (range === '7days' || range === '14days') {
      const days = range === '7days' ? 7 : 14;
      const dates = getPastDaysCoordinates(days);
      
      data = dates.map(date => habitHistory[date] || 0);
      // Simplify labels to just Day/Month or Day
      labels = dates.map((date, index) => {
         // Show label for every other day to avoid crowding if 14 days
         if (range === '14days' && index % 2 !== 0) return '';
         const d = new Date(date);
         return `${d.getMonth() + 1}/${d.getDate()}`;
      });
    } else {
        // Weekly
        const weeks = getPastWeeksCoordinates(7);
        data = weeks.map(weekDates => {
            const sum = weekDates.reduce((acc, date) => acc + (habitHistory[date] || 0), 0);
            return range === '7weeksAVG' ? sum / 7 : sum;
        });
        labels = weeks.map((_, index) => `W${index + 1}`);
    }

    return {
      labels,
      datasets: [{ data }]
    };
  };

  const renderChart = (title: string, type: 'water' | 'food' | 'workout', unit: string, colorTheme: any) => {
    const chartData = getData(type);
    
    return (
      <View style={styles.chartContainer}>
        <Text style={[styles.chartTitle, { color: colorTheme.dark }]}>{title}</Text>
        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 1,
            color: (opacity = 1) => colorTheme.dark, // Using the dark shade for the line
            labelColor: (opacity = 1) => '#666',
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: colorTheme.light
            }
          }}
          bezier
          style={styles.chart}
        />
        <Text style={styles.unitLabel}>{unit}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Statistics</Text>
        <TouchableOpacity style={styles.dropdownBtn} onPress={() => setShowDropdown(!showDropdown)}>
           <Text style={styles.dropdownText}>
             {ranges.find(r => r.value === range)?.label}
           </Text>
           <FontAwesome name={showDropdown ? "chevron-up" : "chevron-down"} size={16} color="#333" />
        </TouchableOpacity>
      </View>
      
      {showDropdown && (
        <View style={styles.dropdownList}>
          {ranges.map(r => (
            <TouchableOpacity 
                key={r.value} 
                style={styles.dropdownItem}
                onPress={() => {
                    setRange(r.value);
                    setShowDropdown(false);
                }}
            >
                <Text>{r.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderChart('Water', 'water', 'Cups', Colors.pastel.water)}
        {renderChart('Food', 'food', 'Meals', Colors.pastel.food)}
        {renderChart('Workout', 'workout', 'Minutes', Colors.pastel.workout)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    zIndex: 2,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    gap: 10,
  },
  dropdownText: {
    fontSize: 14,
  },
  dropdownList: {
    position: 'absolute',
    top: 70,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    padding: 5,
    zIndex: 10,
    width: 150,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  scrollContent: {
    paddingBottom: 20,
    zIndex: 1,
  },
  chartContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  unitLabel: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
    marginRight: 20,
  },
});
