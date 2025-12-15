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
      labels = dates.map((date, index) => {
         if (range === '14days' && index % 2 !== 0) return '';
         const d = new Date(date);
         return `${d.getMonth() + 1}/${d.getDate()}`;
      });
    } else {
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
      <View style={[styles.chartContainer, { backgroundColor: colorTheme.light }]}>
        <Text style={[styles.chartTitle, { color: colorTheme.dark }]}>{title}</Text>
        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: colorTheme.light,
            backgroundGradientFrom: colorTheme.light,
            backgroundGradientTo: colorTheme.light,
            decimalPlaces: 1,
            color: (opacity = 1) => colorTheme.dark,
            labelColor: (opacity = 1) => colorTheme.dark,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: colorTheme.dark // Changed from light to dark for visibility
            }
          }}
          bezier
          style={styles.chart}
        />
        <Text style={[styles.unitLabel, { color: colorTheme.dark }]}>{unit}</Text>
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
           <FontAwesome name={showDropdown ? "chevron-up" : "chevron-down"} size={16} color={Colors.pastel.global.text} />
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
                <Text style={styles.dropdownItemText}>{r.label}</Text>
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
    backgroundColor: Colors.pastel.global.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    zIndex: 2,
    backgroundColor: Colors.pastel.global.background, // Non-white background
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.pastel.global.text,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.pastel.global.text,
    padding: 10,
    borderRadius: 8,
    gap: 10,
    backgroundColor: Colors.pastel.global.inputBackground,
  },
  dropdownText: {
    fontSize: 14,
    color: Colors.pastel.global.text,
  },
  dropdownList: {
    position: 'absolute',
    top: 70,
    right: 20,
    backgroundColor: Colors.pastel.global.inputBackground,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#2e003e',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    padding: 5,
    zIndex: 10,
    width: 150,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  dropdownItemText: {
    color: Colors.pastel.global.text,
  },
  scrollContent: {
    paddingBottom: 20,
    zIndex: 1,
    paddingHorizontal: 10, // Added padding to avoid charts touching edges
  },
  chartContainer: {
    marginBottom: 30,
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 16, // Added styling to container
    // backgroundColor set in renderChart dynamically
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
    alignSelf: 'flex-end',
    marginRight: 20,
  },
});
