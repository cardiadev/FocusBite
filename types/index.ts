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
};

// ============================================================================
// Theme Types (re-exported for convenience)
// ============================================================================

export type { ColorScheme, ThemeColors } from '@/constants/Colors';

// ============================================================================
// Goal Types
// ============================================================================

export type GoalType = 'nutrition' | 'exercise' | 'weight' | 'habits';
export type GoalStatus = 'active' | 'completed' | 'paused' | 'archived';
export type GoalFrequency = 'daily' | 'weekly' | 'monthly' | 'once';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  type: GoalType;
  status: GoalStatus;
  frequency: GoalFrequency;
  
  // Target and progress
  targetValue: number;
  currentValue: number;
  unit: string; // 'calories', 'minutes', 'kg', 'workouts', etc.
  
  // Dates
  startDate: string; // ISO date string
  targetDate?: string; // ISO date string (optional for ongoing goals)
  lastUpdated?: string; // ISO date string
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  
  // Optional settings
  reminderEnabled?: boolean;
  reminderTime?: string; // HH:MM format
  color?: string; // Custom color for the goal
  icon?: string; // Icon name for the goal
}

/**
 * Example Goal:
 * {
 *   id: 'goal_123',
 *   title: 'Stay under 2000 calories daily',
 *   description: 'Maintain calorie deficit for weight loss',
 *   type: 'nutrition',
 *   status: 'active',
 *   frequency: 'daily',
 *   targetValue: 2000,
 *   currentValue: 1850,
 *   unit: 'calories',
 *   startDate: '2025-01-20T00:00:00.000Z',
 *   targetDate: '2025-03-20T00:00:00.000Z',
 *   createdAt: '2025-01-20T10:30:00.000Z',
 *   updatedAt: '2025-01-21T08:15:00.000Z',
 *   reminderEnabled: true,
 *   reminderTime: '08:00',
 *   color: '#9785EB'
 * }
 */

// ============================================================================
// Nutrition Types
// ============================================================================

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface NutritionLog {
  id: string;
  userId?: string;
  goalId?: string; // Link to related goal
  date: string; // ISO date string
  time: string; // HH:MM format
  mealType: MealType;
  
  // Food details
  foodName: string;
  servingSize?: string;
  servings?: number;
  
  // Macros
  calories: number;
  protein: number;      // grams
  carbs: number;        // grams
  fats: number;         // grams
  fiber?: number;       // grams
  sugar?: number;       // grams
  
  // Optional
  notes?: string;
  photoUri?: string;    // Photo of the meal
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

/**
 * Example NutritionLog:
 * {
 *   id: 'log_456',
 *   goalId: 'goal_123',
 *   date: '2025-01-21',
 *   time: '12:30',
 *   mealType: 'lunch',
 *   foodName: 'Grilled Chicken Salad',
 *   servingSize: '1 bowl',
 *   servings: 1,
 *   calories: 450,
 *   protein: 35,
 *   carbs: 25,
 *   fats: 20,
 *   fiber: 8,
 *   notes: 'Light dressing',
 *   createdAt: '2025-01-21T12:35:00.000Z',
 *   updatedAt: '2025-01-21T12:35:00.000Z'
 * }
 */

export interface NutritionGoals {
  dailyCalories: number;
  protein: number;
  carbs: number;
  fats: number;
}

// ============================================================================
// Exercise Types
// ============================================================================

export type ExerciseType = 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other';
export type IntensityLevel = 'low' | 'moderate' | 'high' | 'extreme';

export interface ExerciseLog {
  id: string;
  userId?: string;
  goalId?: string; // Link to related goal
  date: string; // ISO date string
  time: string; // HH:MM format
  
  // Exercise details
  exerciseType: ExerciseType;
  name: string;
  duration: number;     // minutes
  intensity?: IntensityLevel;
  
  // Metrics
  caloriesBurned?: number;
  distance?: number;    // km or miles
  sets?: number;        // for strength training
  reps?: number;        // for strength training
  weight?: number;      // kg or lbs (for strength training)
  heartRateAvg?: number; // bpm
  heartRateMax?: number; // bpm
  
  // Optional
  notes?: string;
  location?: string;    // gym, home, park, etc.
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

/**
 * Example ExerciseLog:
 * {
 *   id: 'log_789',
 *   goalId: 'goal_124',
 *   date: '2025-01-21',
 *   time: '06:00',
 *   exerciseType: 'cardio',
 *   name: 'Morning Run',
 *   duration: 30,
 *   intensity: 'moderate',
 *   caloriesBurned: 320,
 *   distance: 5.2,
 *   heartRateAvg: 145,
 *   heartRateMax: 165,
 *   notes: 'Felt great today!',
 *   location: 'park',
 *   createdAt: '2025-01-21T06:35:00.000Z',
 *   updatedAt: '2025-01-21T06:35:00.000Z'
 * }
 */

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

// ============================================================================
// Form Types
// ============================================================================

export interface FormField {
  value: string | number;
  error?: string;
  touched: boolean;
}

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message: string;
}

export interface FormErrors {
  [key: string]: string;
}

// ============================================================================
// Storage/Service Types
// ============================================================================

export interface StorageKeys {
  GOALS: '@focusbite:goals';
  NUTRITION_LOGS: '@focusbite:nutrition_logs';
  EXERCISE_LOGS: '@focusbite:exercise_logs';
  USER_PROFILE: '@focusbite:user_profile';
  MEAL_PREP_PLANS: '@focusbite:meal_prep_plans';
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================================================
// Filter and Query Types
// ============================================================================

export interface DateRange {
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
}

export interface GoalFilters {
  type?: GoalType;
  status?: GoalStatus;
  dateRange?: DateRange;
}

export interface ActivityFilters {
  goalId?: string;
  dateRange?: DateRange;
  type?: 'nutrition' | 'exercise';
}
