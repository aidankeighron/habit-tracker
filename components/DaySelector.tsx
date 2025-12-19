import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DaySelectorProps {
  selectedDays: number[];
  onToggleDay: (day: number) => void;
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const DaySelector: React.FC<DaySelectorProps> = ({ selectedDays, onToggleDay }) => {
  return (
    <View style={styles.container}>
      {DAYS.map((dayLabel, index) => {
        const isSelected = selectedDays.includes(index);
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayButton,
              isSelected && styles.dayButtonSelected,
            ]}
            onPress={() => onToggleDay(index)}
          >
            <Text
              style={[
                styles.dayText,
                isSelected && styles.dayTextSelected,
              ]}
            >
              {dayLabel}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.pastel.global.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayButtonSelected: {
    backgroundColor: Colors.pastel.global.accent,
    borderColor: Colors.pastel.global.accent,
  },
  dayText: {
    color: Colors.pastel.global.text,
    fontWeight: '600',
    fontSize: 16,
  },
  dayTextSelected: {
    color: '#FFF',
  },
});
