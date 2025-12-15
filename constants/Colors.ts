const accentPurple = '#9C27B0';
const bgPurple = '#F3E5F5';
const textPurple = '#4A148C';

export const Colors = {
  light: {
    text: textPurple,
    background: bgPurple,
    tint: textPurple, // Dark purple for active tint
    tabIconDefault: '#CE93D8', // Lighter purple for inactive
    tabIconSelected: textPurple,
    tabBarBackground: '#E1BEE7', // Light purple background
  },
  dark: {
    text: '#E1BEE7',
    background: '#2e003e',
    tint: '#E040FB',
    tabIconDefault: '#ccc',
    tabIconSelected: '#E040FB',
    tabBarBackground: '#120021',
  },
  pastel: {
    global: {
      background: bgPurple,
      text: textPurple,
      accent: accentPurple,
      inputBackground: '#E1BEE7', 
    },
    water: {
      light: '#E3F2FD', 
      dark: '#0D47A1',  
      medium: '#2196F3',
      completed: '#42A5F5',
      accent: '#90CAF9',
    },
    food: {
      light: '#E8F5E9',
      dark: '#1B5E20',
      medium: '#4CAF50',
      accent: '#A5D6A7', 
    },
    workout: {
      light: '#E0E0E0', 
      dark: '#212121', 
      medium: '#9E9E9E',
      inputBg: '#F5F5F5', // Making input slightly lighter than bg for contrast
      accent: '#BDBDBD',
    },
  }
};
