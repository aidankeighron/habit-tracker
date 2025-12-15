import FoodSection from '@/components/FoodSection';
import WaterSection from '@/components/WaterSection';
import WorkoutSection from '@/components/WorkoutSection';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={[styles.container, { paddingTop: 10 }]} edges={['top']}>
      <WaterSection />
      <FoodSection />
      <WorkoutSection />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pastel.global.background,
  },
});
