import React, { useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { useHabits } from '../context/HabitContext';

export default function WorkoutSection() {
  const { habits, updateHabit, settings } = useHabits();
  const current = habits.workout;
  const total = settings.totals.workout;
  const isGoalReached = current >= total;
  const theme = Colors.pastel.workout;
  const [inputVal, setInputVal] = useState('');

  const handleUpdate = () => {
    const num = parseInt(inputVal);
    if (!isNaN(num) && num >= 0) {
      updateHabit('workout', num);
      setInputVal('');
      Keyboard.dismiss();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isGoalReached ? theme.accent : theme.light }]}>
      <Text style={[styles.label, isGoalReached && { color: theme.dark }]}>Workout</Text>
      <View style={styles.controls}>
        <TextInput 
          style={styles.input}
          placeholder="Min"
          placeholderTextColor={theme.medium}
          keyboardType="number-pad"
          value={inputVal}
          onChangeText={setInputVal}
        />
        
        <TouchableOpacity onPress={handleUpdate} style={styles.button}>
          <Text style={styles.buttonText}>Set</Text>
        </TouchableOpacity>

        <Text style={[styles.counter, isGoalReached && { color: theme.dark }]}>{current} / {total}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.pastel.workout.dark,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  counter: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.pastel.workout.dark,
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 8,
    padding: 10,
    width: 80,
    fontSize: 18,
    backgroundColor: Colors.pastel.workout.inputBg,
    textAlign: 'center',
    color: Colors.pastel.workout.dark,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.pastel.workout.dark,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FAFAFA',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
