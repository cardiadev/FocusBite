# Development Guide - FocusBite

## Iteration 1 Summary

This document outlines the initial project setup and core architecture implemented in Iteration 1.

## What's Been Built

### ✅ Core Architecture
- **TypeScript Configuration**: Strict mode enabled with path aliases (`@/*`)
- **Theme System**: Complete light/dark mode support with OS-level detection
- **Navigation**: Tab-based navigation using Expo Router
- **Design System**: Colors, Typography, and Spacing constants
- **Type Safety**: Comprehensive TypeScript definitions for all features

### ✅ Screens Implemented
1. **Home Screen** (`app/(tabs)/index.tsx`)
   - Welcome section with personalized greeting
   - Quick stats cards (calories, workouts)
   - Today's goals with progress bars
   - Quick action buttons
   - Theme toggle for testing

2. **Nutrition Screen** (`app/(tabs)/nutrition.tsx`)
   - Daily calorie summary
   - Macronutrient tracking (protein, carbs, fats)
   - Meal sections (breakfast, lunch, dinner, snacks)
   - Water intake tracker

3. **Exercise Screen** (`app/(tabs)/exercise.tsx`)
   - Weekly summary stats
   - Today's activity tracker
   - Recent workouts list
   - Quick start workout buttons

4. **Meal Prep Screen** (`app/(tabs)/meal-prep.tsx`)
   - Weekly meal plan overview
   - Calendar view for the week
   - Prep task checklist
   - Shopping list with items
   - Recipe suggestions

5. **Profile Screen** (`app/(tabs)/profile.tsx`)
   - User profile header
   - Statistics overview
   - Theme toggle setting
   - Notification preferences
   - App settings menu
   - About section

### ✅ Infrastructure
- **Theme Context** (`context/ThemeContext.tsx`): Global theme state management
- **Custom Hooks** (`hooks/useTheme.ts`): Easy theme access throughout app
- **Utility Functions**: Formatters and validation helpers
- **Type Definitions**: Complete type safety for all features

## Design System

### Colors
```typescript
Primary: #B39DDB (Light Purple)
Primary Dark: #9575CD
Primary Light: #D1C4E9
Text (Light): #424242
Text (Dark): #E0E0E0
```

### Typography Scale
- h1: 36px / bold
- h2: 30px / bold
- h3: 24px / semibold
- h4: 20px / semibold
- body: 16px / regular
- bodySmall: 14px / regular
- caption: 12px / regular

### Spacing (8px grid)
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 40px
- 3xl: 48px
- 4xl: 64px

## How to Use the Theme System

```typescript
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { colors, isDark, toggleTheme } = useTheme();
  
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Hello</Text>
      <Button onPress={toggleTheme}>Toggle Theme</Button>
    </View>
  );
}
```

## Adding New Screens

1. Create file in `app/(tabs)/` directory
2. Export default component
3. Add screen to `app/(tabs)/_layout.tsx`
4. Use theme system for styling
5. Follow existing component patterns

## Adding New Types

Add types to `types/index.ts`:
```typescript
export interface MyNewType {
  id: string;
  name: string;
  // ...
}
```

## Code Style Guidelines

1. **Components**: Use functional components with hooks
2. **Naming**: PascalCase for components, camelCase for functions/variables
3. **Imports**: Group by external, internal, types
4. **Comments**: Add JSDoc comments for complex logic
5. **Types**: Always define proper TypeScript types
6. **Styling**: Use StyleSheet.create for performance

## Testing the Setup

Run these commands to verify everything works:

```bash
# Install dependencies (if not done)
npm install

# Start development server
npm start

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## Current State of Data

⚠️ **Note**: All data is currently **MOCK DATA** displayed in the UI. No actual data persistence is implemented yet.

### What Works
- ✅ UI components render correctly
- ✅ Theme switching works
- ✅ Navigation between tabs works
- ✅ Responsive design adapts to screen size

### What's NOT Implemented Yet
- ❌ Data persistence (AsyncStorage/SQLite)
- ❌ User authentication
- ❌ API integration
- ❌ Form submissions
- ❌ Push notifications
- ❌ Image uploads
- ❌ Data visualization (charts)

## Next Steps (Iteration 2)

### High Priority
1. **Data Layer**
   - Set up AsyncStorage for local data persistence
   - Create data models and storage helpers
   - Implement CRUD operations for goals, meals, workouts

2. **Form Components**
   - Build reusable form components (Input, Select, DatePicker)
   - Add form validation
   - Create modal screens for adding/editing data

3. **State Management**
   - Implement Context for Goals, Nutrition, Exercise data
   - Add loading and error states
   - Create data hooks (useGoals, useNutrition, etc.)

### Medium Priority
4. **Charts & Visualization**
   - Add chart library (react-native-chart-kit or Victory Native)
   - Implement progress charts
   - Add trend analysis

5. **Enhanced Features**
   - Goal creation and editing
   - Meal logging with search
   - Workout templates
   - Weekly/monthly views

### Lower Priority
6. **Polish**
   - Add animations (Reanimated)
   - Improve loading states
   - Add empty states
   - Onboarding flow

## Common Tasks

### Update Color Scheme
Edit `constants/Colors.ts` to change colors globally.

### Add New Icon
```typescript
import { Ionicons } from '@expo/vector-icons';
<Ionicons name="icon-name" size={24} color={colors.primary} />
```

### Create Reusable Component
1. Create file in `components/` directory
2. Export component with proper TypeScript types
3. Use theme system for dynamic styling
4. Document props with JSDoc comments

## Troubleshooting

### Theme Not Working
- Ensure component is inside `<ThemeProvider>`
- Check that you're using `useTheme()` hook correctly

### Navigation Issues
- Verify file structure in `app/(tabs)/` matches route names
- Check `_layout.tsx` configuration

### TypeScript Errors
- Run `npx tsc --noEmit` to see all errors
- Check that all imports have proper types
- Ensure `tsconfig.json` includes all necessary files

## Resources

- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Native Styling](https://reactnative.dev/docs/style)
- [Ionicons Directory](https://ionic.io/ionicons)

## Architecture Diagram

```
┌─────────────────────────────────────┐
│         App Entry Point             │
│         app/_layout.tsx             │
│    (ThemeProvider wraps all)        │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│      Tab Navigation Layout          │
│      app/(tabs)/_layout.tsx         │
│    (Configures bottom tabs)         │
└─────────────┬───────────────────────┘
              │
    ┌─────────┴──────────┬──────────┬─────────┬──────────┐
    ▼                    ▼          ▼         ▼          ▼
┌─────────┐      ┌──────────┐  ┌─────────┐ ┌────────┐ ┌─────────┐
│  Home   │      │Nutrition │  │Exercise │ │  Meal  │ │ Profile │
│ Screen  │      │  Screen  │  │ Screen  │ │  Prep  │ │ Screen  │
└─────────┘      └──────────┘  └─────────┘ └────────┘ └─────────┘
     │                 │             │           │          │
     └─────────────────┴─────────────┴───────────┴──────────┘
                            │
                            ▼
              ┌──────────────────────────┐
              │     Theme System         │
              │  (Colors, Typography,    │
              │   Spacing, Context)      │
              └──────────────────────────┘
```

## File Organization Best Practices

```
✅ DO:
- Keep screens in app/(tabs)/ for tab navigation
- Put reusable components in components/
- Store constants in constants/
- Use types/ for TypeScript definitions
- Put utilities in utils/

❌ DON'T:
- Mix business logic with UI components
- Hardcode colors or spacing values
- Skip TypeScript type definitions
- Create circular dependencies
- Ignore linter warnings
```

## Performance Considerations

1. **Images**: Use `expo-image` for optimized image loading
2. **Lists**: Use `FlatList` for long scrollable lists
3. **Memoization**: Use `useMemo` and `useCallback` for expensive operations
4. **Navigation**: Use lazy loading for heavy screens
5. **Animations**: Use `react-native-reanimated` for 60fps animations

## Deployment Readiness

Current Status: **Development Only**

Before Production:
- [ ] Add error boundary components
- [ ] Implement analytics
- [ ] Add crash reporting (Sentry)
- [ ] Set up CI/CD pipeline
- [ ] Configure app icons and splash screens
- [ ] Test on physical devices
- [ ] Optimize bundle size
- [ ] Add privacy policy and terms
- [ ] Set up app store listings

---

**Last Updated**: Iteration 1 - January 2025
**Next Review**: After Iteration 2 implementation
