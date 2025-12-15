import { Colors } from '@/constants/Colors';
import { useHabits } from '@/context/HabitContext';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const { settings, updateTotal, history, editHistory, updateHabit } = useHabits();
  
  // Local state for totals forms to avoid constant context updates on every keystroke
  const [waterTotal, setWaterTotal] = useState(settings.totals.water.toString());
  const [foodTotal, setFoodTotal] = useState(settings.totals.food.toString());
  const [workoutTotal, setWorkoutTotal] = useState(settings.totals.workout.toString());

  // Data editing state
  const [editDate, setEditDate] = useState(new Date().toISOString().split('T')[0]);
  const [editWater, setEditWater] = useState('');
  const [editFood, setEditFood] = useState('');
  const [editWorkout, setEditWorkout] = useState('');

  const saveTotals = () => {
    updateTotal('water', parseFloat(waterTotal) || 0);
    updateTotal('food', parseFloat(foodTotal) || 0);
    updateTotal('workout', parseFloat(workoutTotal) || 0);
    Alert.alert('Success', 'Goals updated successfully.');
  };

  const loadDataForDate = () => {
    // Check if valid date YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(editDate)) {
        Alert.alert('Invalid Date', 'Please use YYYY-MM-DD format.');
        return;
    }
    
    setEditWater((history.water[editDate] || 0).toString());
    setEditFood((history.food[editDate] || 0).toString());
    setEditWorkout((history.workout[editDate] || 0).toString());
  };

  const saveHistoryData = () => {
    editHistory('water', editDate, parseFloat(editWater) || 0);
    editHistory('food', editDate, parseFloat(editFood) || 0);
    editHistory('workout', editDate, parseFloat(editWorkout) || 0);
    Alert.alert('Success', `Data for ${editDate} updated.`);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Goals</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Water Goal (Cups)</Text>
            <TextInput 
              style={styles.input} 
              value={waterTotal} 
              onChangeText={setWaterTotal} 
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Food Goal (Meals)</Text>
            <TextInput 
              style={styles.input} 
              value={foodTotal} 
              onChangeText={setFoodTotal} 
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Workout Goal (Mins)</Text>
            <TextInput 
              style={styles.input} 
              value={workoutTotal} 
              onChangeText={setWorkoutTotal} 
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={saveTotals}>
            <Text style={styles.buttonText}>Save Goals</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Edit History</Text>
          <Text style={styles.subtitle}>Enter date (YYYY-MM-DD) to load and edit data.</Text>

          <View style={styles.row}>
            <TextInput 
                style={[styles.input, styles.dateInput]} 
                value={editDate} 
                onChangeText={setEditDate}
                placeholder="YYYY-MM-DD"
            />
            <TouchableOpacity style={styles.smallButton} onPress={loadDataForDate}>
                <Text style={styles.smallButtonText}>Load</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Water</Text>
            <TextInput 
              style={styles.input} 
              value={editWater} 
              onChangeText={setEditWater} 
              keyboardType="numeric"
              placeholder="Load date first"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Food</Text>
            <TextInput 
              style={styles.input} 
              value={editFood} 
              onChangeText={setEditFood} 
              keyboardType="numeric"
              placeholder="Load date first"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Workout</Text>
            <TextInput 
              style={styles.input} 
              value={editWorkout} 
              onChangeText={setEditWorkout} 
              keyboardType="numeric"
              placeholder="Load date first"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={saveHistoryData}>
            <Text style={styles.buttonText}>Save History</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 50,
  },
  section: {
    marginBottom: 40,
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  dateInput: {
    flex: 1,
  },
  button: {
    backgroundColor:  Colors.pastel.water.dark,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  smallButton: {
    backgroundColor: '#666',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  smallButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
