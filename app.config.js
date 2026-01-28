export default {
  expo: {
    name: "Habit Tracker",
    slug: "habit-tracker",
    version: "1.0.25",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#F7F3EE"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      package: "com.anonymous.habittracker",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#F7F3EE"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    notification: {
      icon: "./assets/images/notification-icon.png",
      color: "#9C27B0"
    },
    plugins: [
      "expo-router",
      "./plugins/withAndroidCustomNotificationIcon"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "1775dfe2-c17b-43f2-a2a1-f6100dd3116c"
      },
      // Expose environment variables to the app
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    }
  }
};
