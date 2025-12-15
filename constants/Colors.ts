const accentPurple = '#9C27B0';
const bgPurple = '#F3E5F5';
const textPurple = '#4A148C';

export const Colors = {
  light: {
    text: textPurple,
    background: bgPurple,
    tint: accentPurple,
    tabIconDefault: '#BDBDBD',
    tabIconSelected: accentPurple,
  },
  dark: {
    text: '#E1BEE7',
    background: '#2e003e',
    tint: '#E040FB',
    tabIconDefault: '#ccc',
    tabIconSelected: '#E040FB',
  },
  pastel: {
    global: {
      background: bgPurple,
      text: textPurple,
      accent: accentPurple,
      inputBackground: '#E1BEE7', // Darker lavender for inputs
    },
    water: {
      light: '#E3F2FD', // Very light blue
      dark: '#0D47A1',  // Very dark blue
      accent: '#BBDEFB',
      medium: '#2196F3',
    },
    food: {
      light: '#E8F5E9', // Very light green
      dark: '#1B5E20',  // Very dark green
      accent: '#C8E6C9',
      medium: '#4CAF50',
    },
    workout: {
      light: '#FAFAFA', // Very light grey (almost white but warm) -> Let's go slightly darker grey to distinguish from white
      dark: '#212121',  // Very dark grey
      accent: '#F5F5F5',
      medium: '#9E9E9E',
      inputBg: '#EEEEEE',
    },
  }
};
