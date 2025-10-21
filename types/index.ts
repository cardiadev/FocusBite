/**
 * Type Definitions for FocusBite
 * 
 * Central location for all TypeScript types and interfaces used throughout the app.
 * Organized by feature/domain for easy maintenance.
 */

// ============================================================================
// Navigation Types
// ============================================================================

export type RootTabParamList = {
  index: undefined;           // Home screen
  nutrition: undefined;       // Nutrition tracking
  exercise: undefined;        // Exercise tracking
  'meal-prep': undefined;     // Meal prep management
  profile: undefined;         // User profile & settings
};

// ============================================================================
// Theme Types (re-exported for convenience)
// ============================================================================

export type { ColorScheme, ThemeColors } from '@/constants/Colors';

// ============================================================================
// Goal Types
// ============================================================================

export interface Goal {
  id: string;
  title: string;
  description?: string;
  type: GoalType;
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: Date;
  endDate: Date;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type GoalType = 'nutrition' | 'exercise' | 'habit' | 'custom';

export type GoalStatus = 'active' | 'completed' | 'expired' | 'paused';

// ============================================================================
// Nutrition Types
// ============================================================================

export interface NutritionEntry {
  id: string;
  date: Date;
  mealType: MealType;
  foodName: string;
  calories: number;
  protein: number;      // grams
  carbs: number;        // grams
  fats: number;         // grams
  notes?: string;
  createdAt: Date;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface NutritionGoals {
  dailyCalories: number;
  protein: number;
  carbs: number;
  fats: number;
}

// ============================================================================
// Exercise Types
// ============================================================================

export interface ExerciseEntry {
  id: string;
  date: Date;
  exerciseType: ExerciseType;
  name: string;
  duration: number;     // minutes
  caloriesBurned?: number;
  distance?: number;    // km or miles
  notes?: string;
  createdAt: Date;
}

export type ExerciseType = 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other';

// ============================================================================
// Meal Prep Types
// ============================================================================

export interface MealPrepPlan {
  id: string;
  name: string;
  description?: string;
  meals: MealPrepItem[];
  weekStartDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MealPrepItem {
  id: string;
  name: string;
  ingredients: string[];
  prepTime: number;     // minutes
  servings: number;
  mealType: MealType;
  dayOfWeek: DayOfWeek;
  isCompleted: boolean;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// ============================================================================
// User Profile Types
// ============================================================================

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notificationsEnabled: boolean;
  reminderTimes: string[];      // ISO time strings
  measurementUnit: 'metric' | 'imperial';
}

// ============================================================================
// Common/Utility Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface ScreenProps {
  navigation?: any;
  route?: any;
}

export interface CardProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  children?: React.ReactNode;
}
