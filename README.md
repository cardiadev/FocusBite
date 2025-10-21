# FocusBite - Personal Goal Tracking App

A modern React Native mobile application built with Expo for tracking nutrition, exercise, meal prep, and personal goals. Features a beautiful UI with light/dark mode support and a comprehensive design system.

## Features

- 📊 **Goal Tracking**: Track daily and weekly goals with progress visualization
- 🍎 **Nutrition Tracking**: Log meals, monitor calorie intake, and track macronutrients
- 💪 **Exercise Tracking**: Record workouts, track calories burned, and monitor fitness progress
- 🥗 **Meal Prep Management**: Plan weekly meals, create shopping lists, and manage prep tasks
- 👤 **User Profile**: Customize preferences, manage settings, and view statistics
- 🌓 **Light/Dark Mode**: Automatic theme detection with manual override support
- 🎨 **Modern UI**: Clean interface with light purple (#B39DDB) primary color and consistent design system

## Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript with strict mode
- **Navigation**: Expo Router (file-based routing)
- **UI Components**: Custom components with theme system
- **Icons**: Expo Vector Icons (Ionicons)
- **State Management**: React Context API for theme management

## Project Structure

```
FocusBite/
├── app/                          # Application screens (expo-router)
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── _layout.tsx          # Tab navigation configuration
│   │   ├── index.tsx            # Home screen
│   │   ├── nutrition.tsx        # Nutrition tracking
│   │   ├── exercise.tsx         # Exercise tracking
│   │   ├── meal-prep.tsx        # Meal prep planning
│   │   └── profile.tsx          # User profile & settings
│   └── _layout.tsx              # Root layout with providers
├── constants/                    # Design system constants
│   ├── Colors.ts                # Color palette (light/dark)
│   ├── Typography.ts            # Typography scale
│   ├── Spacing.ts               # Spacing system
│   └── index.ts                 # Exports
├── context/                      # React context providers
│   └── ThemeContext.tsx         # Theme state management
├── hooks/                        # Custom React hooks
│   └── useTheme.ts              # Theme access hook
├── types/                        # TypeScript definitions
│   └── index.ts                 # Type definitions
├── utils/                        # Utility functions
│   ├── formatters.ts            # Data formatting helpers
│   └── validation.ts            # Input validation helpers
└── package.json                 # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- iOS Simulator (macOS) or Android Emulator
- Expo Go app (for physical device testing)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Run on your preferred platform**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

## Design System

### Color Palette

**Primary Color**: Light Purple (#B39DDB)
- Creates a calming, focused atmosphere
- Consistent across light and dark modes

**Text Colors**:
- Light mode: Dark Gray (#424242)
- Dark mode: Light Gray (#E0E0E0)

**Theme Support**:
- Automatic OS-level theme detection
- Manual theme toggle available
- Persistent theme preference

### Typography

Based on an 8-point grid system with predefined text styles:
- Headings: h1 (36px) to h4 (20px)
- Body: bodyLarge (18px), body (16px), bodySmall (14px)
- Special: caption (12px), button (16px), label (14px)

### Spacing

Consistent spacing using 8px base unit:
- xs (4px), sm (8px), md (16px), lg (24px), xl (32px), 2xl-4xl

## Architecture Decisions

### 1. **Expo Router for Navigation**
- File-based routing for intuitive structure
- Type-safe navigation with typed routes
- Better developer experience than traditional navigators

### 2. **Context API for Theme**
- Simple, built-in React solution
- No external dependencies needed
- Sufficient for app-wide theme state

### 3. **Strict TypeScript**
- Catch errors at compile time
- Better IDE support and autocomplete
- Self-documenting code

### 4. **Component Composition**
- Reusable UI components
- Separation of concerns
- Easy to maintain and test

### 5. **Design System First**
- Consistent UI across the app
- Easy to make global design changes
- Scalable for future features

## Future Enhancements (Iteration 2+)

- [ ] Data persistence (AsyncStorage/SQLite)
- [ ] User authentication
- [ ] Push notifications
- [ ] Charts and data visualization
- [ ] Goal creation and editing
- [ ] Food/exercise database integration
- [ ] Photo uploads for meals
- [ ] Social sharing features
- [ ] Export data functionality

## Contributing

This project follows React Native and Expo best practices. When contributing:

1. Follow the existing code structure
2. Use TypeScript with proper types
3. Maintain consistent styling with the design system
4. Add inline comments for complex logic
5. Test on both iOS and Android

## Documentation

- **[Quick Start Guide](docs/QUICK_START.md)** - Get up and running quickly
- **[Development Guide](docs/DEVELOPMENT.md)** - Architecture and development details
- **[Iteration 1 Complete](docs/ITERATION_1_COMPLETE.md)** - What was built in iteration 1

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [TypeScript](https://www.typescriptlang.org/)

## License

Private project for personal use.
