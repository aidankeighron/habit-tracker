# Habit Tracker

This is a mobile application built with React Native and Expo for tracking daily habits. It is designed to help users monitor three specific metrics: water intake, food consumption, and workout duration. The app persists data locally and synchronizes with a Supabase backend for backup and history tracking.

## Features

*   **Water Tracking**: Count cups of water with a simple increment/decrement interface.
*   **Meal Tracking**: Log meals throughout the day.
*   **Workout Tracking**: Record minutes spent exercising.
*   **Statistics**: View a 7-day history of your habits in the Stats tab.
*   **Settings**: Configure daily goals and manage data.
*   **Data Persistence**: Data is saved to local storage and Supabase, resetting daily counts while keeping history.

## Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Database Configuration**:
    This app uses Supabase for data synchronization.
    *   Refer to `SETUP_DATABASE.md` for instructions on creating a Supabase project and the `habits` table.
    *   Create a `.env` file in the root directory (or appropriate configuration as per your setup) with your API keys:
        ```bash
        SUPABASE_URL=YOUR_SUPABASE_URL
        SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
        ```

## How to Run

```bash
npm start
```