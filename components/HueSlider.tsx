import React, { useRef } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

interface HueSliderProps {
  hue: number;
  onHueChange: (hue: number) => void;
  height?: number;
}

export const HueSlider: React.FC<HueSliderProps> = ({ hue, onHueChange, height = 40 }) => {
  const widthRef = useRef(0);

  const handleTouch = (x: number) => {
    if (widthRef.current <= 0) return;
    const boundedX = Math.max(0, Math.min(x, widthRef.current));
    const newHue = Math.floor((boundedX / widthRef.current) * 360);
    onHueChange(newHue);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => handleTouch(evt.nativeEvent.locationX),
      onPanResponderMove: (evt) => handleTouch(evt.nativeEvent.locationX),
    })
  ).current;

  return (
    <View
      style={[styles.container, { height }]}
      onLayout={(e) => (widthRef.current = e.nativeEvent.layout.width)}
      {...panResponder.panHandlers}
    >
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <LinearGradient id="rainbow" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="red" />
            <Stop offset="0.17" stopColor="yellow" />
            <Stop offset="0.33" stopColor="lime" />
            <Stop offset="0.5" stopColor="cyan" />
            <Stop offset="0.67" stopColor="blue" />
            <Stop offset="0.83" stopColor="magenta" />
            <Stop offset="1" stopColor="red" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#rainbow)" rx={8} />
      </Svg>
      {/* Slider Knob */}
      <View
        pointerEvents="none"
        style={[
          styles.knob,
          {
            backgroundColor: `hsl(${hue}, 100%, 50%)`,
            left: `${(hue / 360) * 100}%`,
            marginLeft: -10, // Center knob
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 8,
    overflow: 'visible', // allow knob to bleed slightly if needed, though centered is better
    marginVertical: 10,
  },
  knob: {
    position: 'absolute',
    top: -5,
    bottom: -5,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
});
