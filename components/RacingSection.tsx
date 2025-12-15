import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { useHabits } from '../context/HabitContext';

export default function RacingSection() {
  const { habits, updateHabit, settings } = useHabits();
  const current = habits.racing;
  const total = settings.totals.racing;
  const isGoalReached = current >= total;
  const theme = Colors.pastel.racing;

  const handleIncrement = () => {
    updateHabit('racing', current + 1);
  };

  const handleDecrement = () => {
    if (current > 0) {
      updateHabit('racing', current - 1);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isGoalReached ? theme.accent : theme.light }]}>
      <Text style={[styles.label, isGoalReached && { color: theme.dark }]}>Racing</Text>
      <View style={styles.controls}>
        <TouchableOpacity onPress={handleDecrement} style={styles.button}>
          <FontAwesome name="minus" size={24} color={theme.dark} />
        </TouchableOpacity>
        
        <Text style={[styles.counter, isGoalReached && { color: theme.dark }]}>{current} / {total}</Text>
        
        <TouchableOpacity onPress={handleIncrement} style={styles.button}>
          <FontAwesome name="plus" size={24} color={theme.dark} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.pastel.racing.dark,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  counter: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.pastel.racing.dark,
  },
  button: {
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 50,
  },
});
