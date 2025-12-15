import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { useHabits } from '../context/HabitContext';

export default function FoodSection() {
  const { habits, updateHabit, settings } = useHabits();
  const current = habits.food;
  const total = settings.totals.food;
  const isGoalReached = current >= total;
  const theme = Colors.pastel.food;

  const handleIncrement = () => {
    updateHabit('food', current + 0.5);
  };

  const handleDecrement = () => {
    if (current > 0) {
      updateHabit('food', current - 0.5);
    }
  };

  return (
    <View style={[styles.container, isGoalReached && { backgroundColor: theme.accent }]}>
      <Text style={styles.label}>Food</Text>
      <View style={styles.controls}>
        <TouchableOpacity onPress={handleDecrement} style={styles.button}>
          <FontAwesome name="minus" size={24} color={theme.dark} />
        </TouchableOpacity>
        
        <Text style={styles.counter}>{current} / {total}</Text>
        
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
    borderColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.pastel.food.dark,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  counter: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
});
