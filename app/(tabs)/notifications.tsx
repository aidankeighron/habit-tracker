import { DaySelector } from '@/components/DaySelector';
import { HueSlider } from '@/components/HueSlider';
import { NotificationCard } from '@/components/NotificationCard';
import { Colors } from '@/constants/Colors';
import { useCustomNotifications } from '@/context/CustomNotificationContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
  const { notifications, addNotification, removeNotification } = useCustomNotifications();
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [time, setTime] = useState(() => {
    const d = new Date();
    d.setHours(8, 0, 0, 0);
    return d;
  });
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [hue, setHue] = useState(0); // Red default
  
  // Picker visibility for Android
  const [showPicker, setShowPicker] = useState(false);

  const resetForm = () => {
    setTitle('');
    const d = new Date();
    d.setHours(8, 0, 0, 0);
    setTime(d);
    setSelectedDays([]);
    setHue(0);
  };

  const handleCreate = () => {
    addNotification({
        title,
        time: time.toISOString(),
        days: selectedDays,
        colorHue: hue,
    });
    setIsModalVisible(false);
    resetForm();
  };
  
  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
        setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
        setSelectedDays([...selectedDays, day]);
    }
  };

  const onTimeChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setTime(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
            <FontAwesome name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {notifications.length === 0 ? (
            <Text style={styles.emptyText}>No custom notifications set.</Text>
        ) : (
            notifications.map(n => (
                <NotificationCard key={n.id} notification={n} onDelete={removeNotification} />
            ))
        )}
      </ScrollView>

      {/* Creation Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>New Notification</Text>
                
                <Text style={styles.label}>Title</Text>
                <TextInput 
                    style={styles.input} 
                    value={title} 
                    onChangeText={setTitle}
                    placeholder="Reminder Title" 
                    placeholderTextColor="#999"
                />

                <Text style={styles.label}>Time</Text>
                {Platform.OS === 'android' && (
                    <TouchableOpacity style={styles.timeButton} onPress={() => setShowPicker(true)}>
                        <Text style={styles.timeButtonText}>
                            {time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                        </Text>
                    </TouchableOpacity>
                )}
                {/* On iOS, show directly. On Android, show if showPicker is true */}
                {(Platform.OS === 'ios' || showPicker) && (
                    <DateTimePicker
                        value={time}
                        mode="time"
                        display="default"
                        onChange={onTimeChange}
                        style={{ marginBottom: 15 }}
                    />
                )}

                <Text style={styles.label}>Repeat Days</Text>
                <DaySelector selectedDays={selectedDays} onToggleDay={toggleDay} />

                <Text style={styles.label}>Color</Text>
                <HueSlider hue={hue} onHueChange={setHue} />
                <View style={{ height: 20, backgroundColor: `hsl(${hue}, 100%, 50%)`, borderRadius: 4, marginTop: 5, marginBottom: 15 }}></View>

                <View style={styles.modalButtons}>
                    <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setIsModalVisible(false)}>
                        <Text style={styles.modalButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleCreate}>
                        <Text style={styles.modalButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pastel.global.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.pastel.global.text,
  },
  addButton: {
    backgroundColor: Colors.pastel.global.accent,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.pastel.global.text,
    opacity: 0.5,
    marginTop: 50,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.pastel.global.text, 
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.pastel.global.text,
  },
  input: {
    backgroundColor: Colors.pastel.global.inputBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: Colors.pastel.global.text,
  },
  timeButton: {
    backgroundColor: Colors.pastel.global.inputBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 16,
    color: Colors.pastel.global.text,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#DDD',
  },
  saveButton: {
    backgroundColor: Colors.pastel.global.accent,
  },
  modalButtonText: {
    fontWeight: 'bold',
    color: '#333', // Default for cancel
  },
});
