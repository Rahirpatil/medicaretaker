# MediCaretaker - Medicine Reminder App

A React Native (Expo) frontend application for managing medicine reminders with support for Patient, Caretaker, and Admin roles.

## Features

### User Roles
- **Patient**: Manages medicines, sets alarms, tracks intake
- **Caretaker**: Views patient history and medicine status
- **Admin**: Full system access to view all medicines, alarms, and history
- **Multi-role support**: Users can have multiple roles

### Key Features
- **Login System**: Email and password authentication with role-based navigation
- **Patient Dashboard**: Quick access to all patient features
- **Medicine List**: Add, edit, and delete medicines
- **Alarms**: Set medicine reminders with time and repeat days (local notifications)
- **Checklist**: Weekly medicine tracking with checkboxes
- **History**: View medicine intake history with timestamps
- **Senior-Friendly UI**: Large fonts, high contrast, big buttons

## Tech Stack

- React Native (Expo)
- React Navigation
- expo-notifications
- React Context (State Management)
- AsyncStorage (Local Data Persistence)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your preferred platform:
- Android: `npm run android` or press `a` in the terminal
- Web: `npm run web` or press `w` in the terminal
- iOS: `npm run ios` or press `i` in the terminal (Mac only)

## Demo Credentials

For testing purposes, use these demo accounts:

- **Patient**: 
  - Email: `patient@test.com`
  - Password: `123456`

- **Caretaker**: 
  - Email: `caretaker@test.com`
  - Password: `123456`

- **Both Roles**: 
  - Email: `both@test.com`
  - Password: `123456`

- **Admin**: 
  - Email: `admin@test.com`
  - Password: `123456`

## Project Structure

```
MediCaretaker/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── Header.js
│   │   └── Input.js
│   ├── context/          # State management
│   │   ├── AuthContext.js
│   │   └── AppContext.js
│   ├── navigation/       # Navigation setup
│   │   └── AppNavigator.js
│   ├── screens/          # App screens
│   │   ├── LoginScreen.js
│   │   ├── PatientDashboard.js
│   │   ├── CaretakerDashboard.js
│   │   ├── AdminDashboard.js
│   │   ├── MedicineListScreen.js
│   │   ├── ChecklistScreen.js
│   │   ├── AlarmsScreen.js
│   │   └── HistoryScreen.js
│   └── utils/            # Utility functions
│       └── notifications.js
├── App.js                # Main app entry point
├── app.json              # Expo configuration
├── package.json          # Dependencies
└── README.md
```

## Features Details

### Login Screen
- Email and password authentication
- Role-based redirection after login
- Demo credentials display

### Patient Dashboard
- Navigation cards for all features
- 3-dot menu for quick navigation
- Welcome message with user email

### Medicine List
- Add new medicines with name, dosage, and instructions
- Edit existing medicines
- Delete medicines
- Empty state when no medicines added

### Alarms
- Set medicine alarms with time picker
- Select repeat days (Sunday through Saturday)
- Local notifications (patient device only)
- Connect to medicine list

### Checklist
- Weekly medicine tracking
- Date navigation
- Checkbox interface for each medicine
- Weekly summary with progress bar

### History
- View medicine intake history by date
- See taken/missed status
- Timestamps for each entry
- Statistics (taken, missed, total)
- All history view

### Caretaker Dashboard
- View patient history
- Medicine status tracking
- Date-based history navigation

### Admin Dashboard
- System-wide overview with statistics
- Access to all medicines, alarms, and history
- Quick navigation to all features
- System statistics display

## UI Design Principles

- **Senior-Friendly**: Large fonts (18-24px), high contrast colors, big touch targets (min 44x44px)
- **Clean & Simple**: Minimal design, clear hierarchy, intuitive navigation
- **Reusable Components**: Consistent button, card, and input components
- **Accessibility**: High contrast, readable fonts, clear labels

## Navigation

- **Back Button**: Available on all screens (except dashboards)
- **3-Dot Menu**: Overflow menu on all screens for quick navigation
- **Stack Navigation**: Smooth transitions between screens

## Notifications

- Local notifications using expo-notifications
- Scheduled based on alarm time and repeat days
- Only active on patient device
- Android and iOS support

## Data Persistence

- Uses AsyncStorage for local data persistence
- Medicines, alarms, checklist, and history are saved locally
- Data persists across app restarts

## Platform Support

- ✅ Android
- ✅ Web
- ✅ iOS (Mac required for development)

## Future Enhancements (Placeholder)

- Firebase integration for sync (placeholder in code)
- Cloud backup
- Multiple patients for caretakers
- Medicine inventory tracking
- Prescription management

## Development Notes

- This is a **frontend-only** application
- No backend API integration
- All data stored locally using AsyncStorage
- Mock authentication for demo purposes
- Notifications work on physical devices (not in Expo Go web)

## License

This project is created for demonstration purposes.


