# FocusBite - Quick Start Guide

## Get Running in 3 Steps

### 1. Start the App
```bash
npm start
```
Then press:
- `i` for iOS Simulator
- `a` for Android Emulator
- Scan QR code for Expo Go on your phone

### 2. Navigate the App
- **Home**: Overview dashboard with goals and quick actions
- **Nutrition**: Track meals and macros
- **Exercise**: Log workouts and view activity
- **Meal Prep**: Plan meals and shopping
- **Profile**: Settings and preferences

### 3. Test Theme Toggle
- Go to **Home** screen → scroll down → tap "Toggle Dark/Light Mode"
- Or go to **Profile** screen → tap Dark Mode switch

## Current Features
✅ **Working**:
- Navigation between all screens
- Theme switching (light/dark mode)
- UI displays mock data
- Responsive design

❌ **Not Yet Implemented**:
- Data persistence (all data is mock/demo)
- Adding/editing items
- Charts and graphs
- User authentication

## Common Commands

```bash
# Development
npm start              # Start Expo dev server
npm run ios           # Run on iOS
npm run android       # Run on Android
npm run web           # Run in browser

# Quality Checks
npx tsc --noEmit      # Check TypeScript
npm run lint          # Run linter

# Troubleshooting
rm -rf node_modules   # Remove dependencies
npm install           # Reinstall
npx expo start -c     # Clear cache and start
```

## File You'll Edit Most

- **Screens**: `app/(tabs)/*.tsx`
- **Colors**: `constants/Colors.ts`
- **Types**: `types/index.ts`
- **Theme**: `context/ThemeContext.tsx`

## Using the Theme

```typescript
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { colors, isDark } = useTheme();
  
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>
        Current theme: {isDark ? 'Dark' : 'Light'}
      </Text>
    </View>
  );
}
```

## Project Structure at a Glance

```
app/(tabs)/          → All main screens
constants/           → Colors, spacing, typography
context/             → Theme provider
hooks/               → useTheme hook
types/               → TypeScript definitions
utils/               → Helper functions
```

## Next Steps (Iteration 2)

1. Add data persistence (AsyncStorage)
2. Create forms for adding goals/meals/workouts
3. Implement CRUD operations
4. Add charts for data visualization

## Need Help?

- Check `README.md` for full documentation
- See `DEVELOPMENT.md` for architecture details
- Review `ITERATION_1_COMPLETE.md` for what's been built

## Pro Tips

1. **Hot Reload**: Save any file to see changes instantly
2. **Shake Device**: Opens dev menu on physical device
3. **Cmd+D** (iOS) or **Cmd+M** (Android): Dev menu in simulator
4. **Theme Testing**: Toggle between light/dark to see all UI states
5. **Type Safety**: Let TypeScript guide you - follow the red squiggles!

---

Happy coding! 🚀
