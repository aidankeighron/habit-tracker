import FoodSection from '@/components/FoodSection';
import RacingSection from '@/components/RacingSection';
import StretchSection from '@/components/StretchSection';
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
      <StretchSection />
      <WorkoutSection />
      <RacingSection />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pastel.global.background,
  },
});
