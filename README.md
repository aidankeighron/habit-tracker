# Habit Tracker

A cross-platform mobile application built with **React Native** and **Expo** to help you track specific daily habits and maintain a healthy lifestyle. This app allows users to monitor their water intake, food consumption, and workout activity with a clean, simplistic, and colorful UI.

## Features

### 📅 Daily Habit Tracking
Track three core habits every day. Values reset daily but history is saved.
*   **Water**: Track cups of water with simple increment/decrement controls. (Blue theme)
*   **Food**: Track number of meals. (Green theme)
*   **Workout**: Log workout minutes. (Grey theme)

### 📊 Stats & Analytics
Visualize your progress over time.
*   **Line Charts**: View your activity for the last 7 days.
*   **Historical Data**: Data is persisted locally and synced to the cloud.

### ☁️ Cloud Sync & Data Persistence
*   **Local Storage**: Works offline using device storage.
*   **Supabase Integration**: Automatically syncs your history to a secure PostgreSQL database for backup and analysis.
*   **Seamless Syncing**: Background synchronization ensures your data is always up to date.

### ⚙️ Customizable Settings
*   **Goal Setting**: specific daily goals for water, food, and workout durations in the settings tab.
*   **Data Management**: Options to manage your session data.

### 🔔 Notifications
*   Stay on track with local notifications and reminders.

## Tech Stack
*   **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Navigation**: Expo Router (File-based routing)
*   **Backend / Database**: [Supabase](https://supabase.com/) (PostgreSQL)
*   **Charts**: `react-native-chart-kit`
*   **Icons**: `@expo/vector-icons`

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Ensure you have your Supabase credentials (URL and Anon Key) set up in your environment variables or `secrets.json` (gitignored).

3.  **Run the App**:
    ```bash
    npm start
    ```
    Scan the QR code with the Expo Go app on your Android or iOS device.