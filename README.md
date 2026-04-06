# Lambro Trainer V2 - Rubik's Cube Algorithm Trainer
[Lambro Trainer V2](https://andlamb2002.github.io/lambro-trainer-v2)

## Tech Stack
- **Frontend**: React w/ Vite, Tailwind CSS, Zustand
- **Data Pipeline**: Algorithm data generated with Python scripts using PyCuber and Kociemba libraries, stored and imported as JSON.

## Features
- **Integrated Timer**: Spacebar and touch-based timer with millisecond accuracy.
- **Case Selection**: Customizable case selection with toggles for each algorithm set.
- **Session Management**: Save and organize specific algorithm sets into sessions.
- **Performance Tracking**: Records solves and tracks performance over time.
- **Recap Mode**: Iterate through all selected algorithms once each.
- **Mobile Support**: Responsive interface that works on both desktop and mobile.

## V2 Improvements
- **Sessions Replacing Presets**: Sessions store the full context, including case toggles, solves, and recap state.
- **Persistent Recap Progress**: Recap progess survives page reloads and navigation.

## Code Architecture Improvements
- **Custom Hooks**: Encapsulates all major logic for separation of concerns, enhancing code readability and maintainability.
- **Zustand State Management**: Stores session data into global state, which persists to localStorage and reduces prop drilling.
- **LocalStorage Schema**: User data is structured around sessions, allowing for cleaner and more organized localStorage.
