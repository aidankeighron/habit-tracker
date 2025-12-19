import { Colors } from '@/constants/Colors';
import { CustomNotification } from '@/context/CustomNotificationContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NotificationCardProps {
  notification: CustomNotification;
  onDelete: (id: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onDelete }) => {
  const handleDelete = () => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => onDelete(notification.id) }
      ]
    );
  };

  const getDaysString = (days: number[]) => {
    if (days.length === 7) return "Every day";
    if (days.length === 0) return "Never";
    
    // S M T W T F S
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map(d => dayNames[d]).join(', ');
  };

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <View style={[styles.card, { borderLeftColor: `hsl(${notification.colorHue}, 100%, 50%)` }]}>
      <View style={styles.content}>
        <Text style={styles.title}>{notification.title || 'Untitled Check-in'}</Text>
        <Text style={styles.time}>{formatTime(notification.time)}</Text>
        <Text style={styles.days}>{getDaysString(notification.days)}</Text>
      </View>
      <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
        <FontAwesome name="trash" size={20} color={Colors.pastel.global.text} style={{ opacity: 0.5 }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    marginVertical: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderLeftWidth: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.pastel.global.text,
    marginBottom: 4,
  },
  time: {
    fontSize: 24,
    fontWeight: '300',
    color: Colors.pastel.global.text,
    marginBottom: 8,
  },
  days: {
    fontSize: 14,
    color: Colors.pastel.global.text,
    opacity: 0.7,
  },
  deleteButton: {
    padding: 8,
  },
});
