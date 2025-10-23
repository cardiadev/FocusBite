/**
 * Meal Prep Screen
 * 
 * Displays meal prep plans, shopping lists,
 * and prep schedule for the week.
 */

import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { usePrepTasks, useRecipeIdeas, useShoppingItems } from '@/hooks/useMealPrepPlanning';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Helper function to get current week dates
const getCurrentWeekDates = () => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const dates = [];
  
  // Get dates for the entire week starting from Sunday
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - currentDay + i);
    dates.push(date);
  }
  
  return dates;
};

// Helper function to format week date range
const getWeekDateRange = () => {
  const dates = getCurrentWeekDates();
  const startDate = dates[0];
  const endDate = dates[6];
  
  const startMonth = MONTH_NAMES[startDate.getMonth()];
  const endMonth = MONTH_NAMES[endDate.getMonth()];
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  const year = endDate.getFullYear();
  
  // If same month, show: "Jan 20 - 26, 2025"
  // If different months, show: "Jan 28 - Feb 3, 2025"
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}, ${year}`;
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  }
};

export default function MealPrepScreen() {
  const { colors, isDark } = useTheme();
  
  // Hooks for data management
  const { tasks, toggleTaskCompletion, createTask, deleteTask, completedCount, totalCount } = usePrepTasks();
  const { items, toggleItemChecked, createItem, deleteItem, clearCheckedItems, uncheckedCount } = useShoppingItems();
  const { recipes, toggleFavorite, createRecipe, deleteRecipe } = useRecipeIdeas();
  
  // Modal states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showShoppingModal, setShowShoppingModal] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  
  // Selected day state
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(today.getDay()); // Default to today
  const weekDates = getCurrentWeekDates();
  
  // Animation refs for modals
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  
  const backdropOpacity2 = useRef(new Animated.Value(0)).current;
  const slideAnim2 = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  
  const backdropOpacity3 = useRef(new Animated.Value(0)).current;
  const slideAnim3 = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  
  // Helper function to get tasks for a specific day
  const getTasksForDay = (dayIndex: number) => {
    // Filter tasks by day - in a real app, tasks would have a dayOfWeek property
    // For now, we'll simulate this by assigning tasks to days based on their index
    return tasks.filter((task, index) => {
      // Simulate day assignment - distribute tasks across the week
      const taskDay = index % 7;
      return taskDay === dayIndex;
    });
  };
  
  // Helper function to get tasks count per day
  const getTasksCountForDay = (dayIndex: number) => {
    return getTasksForDay(dayIndex).length;
  };
  
  // Get tasks for selected day
  const selectedDayTasks = getTasksForDay(selectedDay);
  
  // Form states
  const [taskTitle, setTaskTitle] = useState('');
  const [taskServings, setTaskServings] = useState('4');
  const [taskPrepTime, setTaskPrepTime] = useState('30');
  
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeServings, setRecipeServings] = useState('4');
  const [recipePrepTime, setRecipePrepTime] = useState('30');
  
  // Handlers for prep tasks
  // Modal animation effects
  useEffect(() => {
    if (showTaskModal) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 25,
          mass: 1,
          stiffness: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showTaskModal]);
  
  useEffect(() => {
    if (showShoppingModal) {
      Animated.parallel([
        Animated.timing(backdropOpacity2, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim2, {
          toValue: 0,
          damping: 25,
          mass: 1,
          stiffness: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showShoppingModal]);
  
  useEffect(() => {
    if (showRecipeModal) {
      Animated.parallel([
        Animated.timing(backdropOpacity3, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim3, {
          toValue: 0,
          damping: 25,
          mass: 1,
          stiffness: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showRecipeModal]);
  
  // Modal close handlers with animation
  const handleCloseTaskModal = () => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowTaskModal(false);
    });
  };
  
  const handleCloseShoppingModal = () => {
    Animated.parallel([
      Animated.timing(backdropOpacity2, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim2, {
        toValue: Dimensions.get('window').height,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowShoppingModal(false);
    });
  };
  
  const handleCloseRecipeModal = () => {
    Animated.parallel([
      Animated.timing(backdropOpacity3, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim3, {
        toValue: Dimensions.get('window').height,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowRecipeModal(false);
    });
  };
  
  const handleAddTask = async () => {
    if (!taskTitle.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }
    
    await createTask({
      title: taskTitle,
      servings: parseInt(taskServings) || 4,
      prepTime: parseInt(taskPrepTime) || 30,
      isCompleted: false,
    });
    
    setTaskTitle('');
    setTaskServings('4');
    setTaskPrepTime('30');
    handleCloseTaskModal();
  };
  
  const handleDeleteTask = (id: string, title: string) => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTask(id) },
      ]
    );
  };
  
  // Handlers for shopping list
  const handleAddItem = async () => {
    if (!itemName.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }
    
    await createItem({
      name: itemName,
      quantity: itemQuantity,
      isChecked: false,
    });
    
    setItemName('');
    setItemQuantity('');
    handleCloseShoppingModal();
  };
  
  const handleClearChecked = () => {
    Alert.alert(
      'Clear Checked Items',
      'Remove all checked items from the list?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearCheckedItems },
      ]
    );
  };
  
  // Handlers for recipes
  const handleAddRecipe = async () => {
    if (!recipeTitle.trim()) {
      Alert.alert('Error', 'Please enter a recipe title');
      return;
    }
    
    await createRecipe({
      title: recipeTitle,
      servings: parseInt(recipeServings) || 4,
      prepTime: parseInt(recipePrepTime) || 30,
      isFavorite: false,
    });
    
    setRecipeTitle('');
    setRecipeServings('4');
    setRecipePrepTime('30');
    handleCloseRecipeModal();
  };
  
  const handleDeleteRecipe = (id: string, title: string) => {
    Alert.alert(
      'Delete Recipe',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteRecipe(id) },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Plan Summary */}
        <View style={[styles.planCard, { backgroundColor: colors.primary }]}>
          <View style={styles.planHeader}>
            <View style={styles.planHeaderContent}>
              <Ionicons name="calendar" size={24} color="#FFFFFF" style={styles.planIcon} />
              <View>
                <Text style={[styles.planTitle, { color: '#FFFFFF' }]}>
                  Weekly Meal Plan
                </Text>
                <Text style={[styles.planSubtitle, { color: 'rgba(255, 255, 255, 0.9)' }]}>
                  {getWeekDateRange()}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.planStats}>
            <PlanStat
              icon="restaurant"
              value={totalCount.toString()}
              label="Prep Tasks"
              textColor="#FFFFFF"
              secondaryTextColor="rgba(255, 255, 255, 0.85)"
              iconColor="#FFFFFF"
            />
            <View style={[styles.statDivider, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]} />
            <PlanStat
              icon="checkmark-circle"
              value={completedCount.toString()}
              label="Completed"
              textColor="#FFFFFF"
              secondaryTextColor="rgba(255, 255, 255, 0.85)"
              iconColor="#FFFFFF"
            />
            <View style={[styles.statDivider, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]} />
            <PlanStat
              icon="cart"
              value={uncheckedCount.toString()}
              label="To Buy"
              textColor="#FFFFFF"
              secondaryTextColor="rgba(255, 255, 255, 0.85)"
              iconColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Weekly Calendar */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              This Week
            </Text>
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowTaskModal(true)}
            >
              <Ionicons name="add" size={20} color={colors.textOnPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.calendar}>
              {weekDates.map((date, index) => {
                const isToday = date.toDateString() === today.toDateString();
                const isSelected = index === selectedDay;
                return (
                  <TouchableOpacity key={index} onPress={() => setSelectedDay(index)}>
                    <DayCard
                      day={DAY_NAMES[date.getDay()]}
                      date={date.getDate()}
                      isToday={isToday}
                      isSelected={isSelected}
                      mealsCount={getTasksCountForDay(index)}
                      backgroundColor={isSelected ? colors.primary : colors.surfaceVariant}
                      textColor={isSelected ? "#FFFFFF" : colors.text}
                      secondaryTextColor={isSelected ? "#FFFFFF" : colors.textSecondary}
                      activeColor={colors.primary}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Today's Meal Prep */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {DAYS[selectedDay]}&apos;s Prep Tasks
            </Text>
          </View>
          
          {selectedDayTasks.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No prep tasks for {DAYS[selectedDay]}. Tap + to add one!
            </Text>
          ) : (
            selectedDayTasks.map((task) => (
              <PrepTask
                key={task.id}
                title={task.title}
                servings={task.servings}
                prepTime={task.prepTime}
                isCompleted={task.isCompleted}
                backgroundColor={colors.surfaceVariant}
                textColor={colors.text}
                secondaryTextColor={colors.textSecondary}
                completedColor={colors.success}
                onToggle={() => toggleTaskCompletion(task.id)}
                onDelete={() => handleDeleteTask(task.id, task.title)}
              />
            ))
          )}
        </View>

        {/* Shopping List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Shopping List
            </Text>
            <TouchableOpacity onPress={() => setShowShoppingModal(true)}>
              <Ionicons name="add" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.shoppingCard, { backgroundColor: colors.surfaceVariant }]}>
            <View style={styles.shoppingHeader}>
              <Text style={[styles.shoppingTitle, { color: colors.text }]}>
                {uncheckedCount} items remaining
              </Text>
              {items.some(i => i.isChecked) && (
                <TouchableOpacity onPress={handleClearChecked}>
                  <Text style={[styles.clearText, { color: colors.error }]}>
                    Clear checked
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            
            {items.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Shopping list is empty. Tap + to add items!
              </Text>
            ) : (
              <View style={styles.itemsList}>
                {items.slice(0, 5).map((item) => (
                  <ShoppingItem
                    key={item.id}
                    name={item.name}
                    quantity={item.quantity}
                    isChecked={item.isChecked}
                    textColor={colors.text}
                    secondaryTextColor={colors.textSecondary}
                    checkedColor={colors.success}
                    onToggle={() => toggleItemChecked(item.id)}
                    onDelete={() => deleteItem(item.id)}
                  />
                ))}
              </View>
            )}
            
            {items.length > 5 && (
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={[styles.viewAllText, { color: colors.primary }]}>
                  View all {items.length} items
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Recipe Suggestions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recipe Ideas
            </Text>
            <TouchableOpacity onPress={() => setShowRecipeModal(true)}>
              <Ionicons name="add" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {recipes.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No recipes yet. Tap + to add one!
            </Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  title={recipe.title}
                  prepTime={recipe.prepTime}
                  servings={recipe.servings}
                  isFavorite={recipe.isFavorite}
                  backgroundColor={colors.surfaceVariant}
                  textColor={colors.text}
                  secondaryTextColor={colors.textSecondary}
                  favoriteColor={colors.error}
                  onToggleFavorite={() => toggleFavorite(recipe.id)}
                  onDelete={() => handleDeleteRecipe(recipe.id, recipe.title)}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>
      
      {/* Add Prep Task Modal */}
      <Modal
        visible={showTaskModal}
        animationType="none"
        transparent={true}
        onRequestClose={() => setShowTaskModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <Animated.View 
            style={[
              styles.modalOverlay,
              { opacity: backdropOpacity }
            ]}
          >
            <TouchableOpacity 
              style={styles.backdropTouchable}
              activeOpacity={1}
              onPress={handleCloseTaskModal}
            />
            <Animated.View
              style={[
                styles.modalAnimatedContainer,
                { transform: [{ translateY: slideAnim }] }
              ]}
            >
              <ScrollView 
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.modalScrollContent}
                bounces={false}
                showsVerticalScrollIndicator={false}
              >
                <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Add Prep Task</Text>
                
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceVariant, color: colors.text }]}
                  placeholder="Task name (e.g., Grilled Chicken)"
                  placeholderTextColor={colors.textSecondary}
                  value={taskTitle}
                  onChangeText={setTaskTitle}
                />
                
                <View style={styles.row}>
                  <View style={styles.halfInput}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Servings</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.surfaceVariant, color: colors.text }]}
                      placeholder="4"
                      placeholderTextColor={colors.textSecondary}
                      value={taskServings}
                      onChangeText={setTaskServings}
                      keyboardType="number-pad"
                    />
                  </View>
                  
                  <View style={styles.halfInput}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Prep Time (min)</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.surfaceVariant, color: colors.text }]}
                      placeholder="30"
                      placeholderTextColor={colors.textSecondary}
                      value={taskPrepTime}
                      onChangeText={setTaskPrepTime}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.surfaceVariant }]}
                    onPress={handleCloseTaskModal}
                  >
                    <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.primary }]}
                    onPress={handleAddTask}
                  >
                    <Text style={[styles.modalButtonText, { color: colors.textOnPrimary }]}>Add Task</Text>
                  </TouchableOpacity>
                </View>
                </View>
              </ScrollView>
            </Animated.View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
      
      {/* Add Shopping Item Modal */}
      <Modal
        visible={showShoppingModal}
        animationType="none"
        transparent={true}
        onRequestClose={() => setShowShoppingModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <Animated.View 
            style={[
              styles.modalOverlay,
              { opacity: backdropOpacity2 }
            ]}
          >
            <TouchableOpacity 
              style={styles.backdropTouchable}
              activeOpacity={1}
              onPress={handleCloseShoppingModal}
            />
            <Animated.View
              style={[
                styles.modalAnimatedContainer,
                { transform: [{ translateY: slideAnim2 }] }
              ]}
            >
              <ScrollView 
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.modalScrollContent}
                bounces={false}
                showsVerticalScrollIndicator={false}
              >
                <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Add Shopping Item</Text>
                
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceVariant, color: colors.text }]}
                  placeholder="Item name (e.g., Chicken breast)"
                  placeholderTextColor={colors.textSecondary}
                  value={itemName}
                  onChangeText={setItemName}
                />
                
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceVariant, color: colors.text }]}
                  placeholder="Quantity (e.g., 2 lbs)"
                  placeholderTextColor={colors.textSecondary}
                  value={itemQuantity}
                  onChangeText={setItemQuantity}
                />
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.surfaceVariant }]}
                    onPress={handleCloseShoppingModal}
                  >
                    <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.primary }]}
                    onPress={handleAddItem}
                  >
                    <Text style={[styles.modalButtonText, { color: colors.textOnPrimary }]}>Add Item</Text>
                  </TouchableOpacity>
                </View>
                </View>
              </ScrollView>
            </Animated.View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
      
      {/* Add Recipe Modal */}
      <Modal
        visible={showRecipeModal}
        animationType="none"
        transparent={true}
        onRequestClose={() => setShowRecipeModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <Animated.View 
            style={[
              styles.modalOverlay,
              { opacity: backdropOpacity3 }
            ]}
          >
            <TouchableOpacity 
              style={styles.backdropTouchable}
              activeOpacity={1}
              onPress={handleCloseRecipeModal}
            />
            <Animated.View
              style={[
                styles.modalAnimatedContainer,
                { transform: [{ translateY: slideAnim3 }] }
              ]}
            >
              <ScrollView 
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.modalScrollContent}
                bounces={false}
                showsVerticalScrollIndicator={false}
              >
                <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Add Recipe Idea</Text>
                
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceVariant, color: colors.text }]}
                  placeholder="Recipe name (e.g., Mediterranean Bowl)"
                  placeholderTextColor={colors.textSecondary}
                  value={recipeTitle}
                  onChangeText={setRecipeTitle}
                />
                
                <View style={styles.row}>
                  <View style={styles.halfInput}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Servings</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.surfaceVariant, color: colors.text }]}
                      placeholder="4"
                      placeholderTextColor={colors.textSecondary}
                      value={recipeServings}
                      onChangeText={setRecipeServings}
                      keyboardType="number-pad"
                    />
                  </View>
                  
                  <View style={styles.halfInput}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Prep Time (min)</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.surfaceVariant, color: colors.text }]}
                      placeholder="30"
                      placeholderTextColor={colors.textSecondary}
                      value={recipePrepTime}
                      onChangeText={setRecipePrepTime}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.surfaceVariant }]}
                    onPress={handleCloseRecipeModal}
                  >
                    <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.primary }]}
                    onPress={handleAddRecipe}
                  >
                    <Text style={[styles.modalButtonText, { color: colors.textOnPrimary }]}>Add Recipe</Text>
                  </TouchableOpacity>
                </View>
                </View>
              </ScrollView>
            </Animated.View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// Components
interface PlanStatProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  textColor: string;
  secondaryTextColor: string;
  iconColor: string;
}

function PlanStat({ icon, value, label, textColor, secondaryTextColor, iconColor }: PlanStatProps) {
  return (
    <View style={styles.statItem}>
      <Ionicons name={icon} size={20} color={iconColor} />
      <Text style={[styles.statValue, { color: textColor }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: secondaryTextColor }]}>{label}</Text>
    </View>
  );
}

interface DayCardProps {
  day: string;
  date: number;
  isToday: boolean;
  isSelected: boolean;
  mealsCount: number;
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
  activeColor: string;
}

function DayCard({ day, date, isToday, isSelected, mealsCount, backgroundColor, textColor, secondaryTextColor, activeColor }: DayCardProps) {
  return (
    <View
      style={[
        styles.dayCard,
        { backgroundColor },
        isToday && !isSelected && { borderColor: activeColor, borderWidth: 2 },
      ]}
    >
      <Text style={[styles.dayName, { color: isSelected ? textColor : (isToday ? activeColor : secondaryTextColor), fontWeight: isSelected ? 'bold' : '600' }]}>
        {day}
      </Text>
      <Text style={[styles.dayDate, { color: textColor }]}>{date}</Text>
      <Text style={[styles.mealCount, { color: secondaryTextColor }]}>
        {mealsCount} {mealsCount === 1 ? 'task' : 'tasks'}
      </Text>
    </View>
  );
}

interface PrepTaskProps {
  title: string;
  servings: number;
  prepTime: number;
  isCompleted: boolean;
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
  completedColor: string;
  onToggle: () => void;
  onDelete: () => void;
}

function PrepTask({ title, servings, prepTime, isCompleted, backgroundColor, textColor, secondaryTextColor, completedColor, onToggle, onDelete }: PrepTaskProps) {
  return (
    <View style={[styles.taskCard, { backgroundColor }]}>
      <TouchableOpacity onPress={onToggle}>
        <Ionicons
          name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={isCompleted ? completedColor : secondaryTextColor}
        />
      </TouchableOpacity>
      <View style={styles.taskInfo}>
        <Text
          style={[
            styles.taskTitle,
            { color: textColor },
            isCompleted && { textDecorationLine: 'line-through', color: secondaryTextColor },
          ]}
        >
          {title}
        </Text>
        <Text style={[styles.taskDetails, { color: secondaryTextColor }]}>
          {servings} servings • {prepTime} min
        </Text>
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={20} color={secondaryTextColor} />
      </TouchableOpacity>
    </View>
  );
}

interface ShoppingItemProps {
  name: string;
  quantity: string;
  isChecked: boolean;
  textColor: string;
  secondaryTextColor: string;
  checkedColor: string;
  onToggle: () => void;
  onDelete: () => void;
}

function ShoppingItem({ name, quantity, isChecked, textColor, secondaryTextColor, checkedColor, onToggle, onDelete }: ShoppingItemProps) {
  return (
    <View style={styles.shoppingItem}>
      <TouchableOpacity onPress={onToggle}>
        <Ionicons
          name={isChecked ? 'checkmark-circle' : 'ellipse-outline'}
          size={20}
          color={isChecked ? checkedColor : secondaryTextColor}
        />
      </TouchableOpacity>
      <Text
        style={[
          styles.itemName,
          { color: textColor },
          isChecked && { textDecorationLine: 'line-through', color: secondaryTextColor },
        ]}
      >
        {name}
      </Text>
      <Text style={[styles.itemQuantity, { color: secondaryTextColor }]}>
        {quantity}
      </Text>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Ionicons name="close-circle-outline" size={18} color={secondaryTextColor} />
      </TouchableOpacity>
    </View>
  );
}

interface RecipeCardProps {
  title: string;
  prepTime: number;
  servings: number;
  isFavorite: boolean;
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
  favoriteColor: string;
  onToggleFavorite: () => void;
  onDelete: () => void;
}

function RecipeCard({ title, prepTime, servings, isFavorite, backgroundColor, textColor, secondaryTextColor, favoriteColor, onToggleFavorite, onDelete }: RecipeCardProps) {
  return (
    <View style={[styles.recipeCard, { backgroundColor }]}>
      <View style={styles.recipePlaceholder}>
        <Ionicons name="image-outline" size={40} color={secondaryTextColor} />
      </View>
      <View style={styles.recipeHeader}>
        <Text style={[styles.recipeTitle, { color: textColor }]}>{title}</Text>
        <TouchableOpacity onPress={onToggleFavorite}>
          <Ionicons 
            name={isFavorite ? 'heart' : 'heart-outline'} 
            size={20} 
            color={isFavorite ? favoriteColor : secondaryTextColor} 
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.recipeDetails, { color: secondaryTextColor }]}>
        {prepTime} min • {servings} servings
      </Text>
      <TouchableOpacity onPress={onDelete} style={styles.recipeDeleteButton}>
        <Ionicons name="trash-outline" size={16} color={secondaryTextColor} />
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.screenPadding,
    paddingBottom: Spacing.xl,
  },
  planCard: {
    padding: Spacing.xl,
    borderRadius: Spacing.borderRadius.xl,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  planHeader: {
    marginBottom: Spacing.xl,
  },
  planHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planIcon: {
    marginRight: Spacing.md,
  },
  planTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
  },
  planSubtitle: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.sm,
    marginTop: 4,
    fontWeight: '500',
  },
  planStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    marginHorizontal: Spacing.xs,
  },
  statValue: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
  },
  statLabel: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },
  seeAll: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: Spacing.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendar: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dayCard: {
    width: 80,
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dayName: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  dayDate: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
  },
  mealCount: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    marginBottom: Spacing.sm,
  },
  taskInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  taskTitle: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: 2,
  },
  taskDetails: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.sm,
  },
  shoppingCard: {
    padding: Spacing.lg,
    borderRadius: Spacing.borderRadius.md,
  },
  shoppingTitle: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  itemsList: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  shoppingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  itemName: {
    fontFamily: Typography.fontFamily.regular,
    flex: 1,
    fontSize: Typography.fontSize.base,
  },
  itemQuantity: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.sm,
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  viewAllText: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  recipeCard: {
    width: 160,
    marginRight: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.md,
  },
  recipePlaceholder: {
    height: 120,
    borderRadius: Spacing.borderRadius.sm,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  recipeTitle: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  recipeDetails: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
  },
  // New styles
  emptyText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    paddingVertical: Spacing.lg,
    fontStyle: 'italic',
  },
  shoppingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  clearText: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    flex: 1,
  },
  recipeDeleteButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    padding: Spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: Spacing.borderRadius.full,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalAnimatedContainer: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  modalKeyboardView: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
    borderTopLeftRadius: Spacing.borderRadius.lg,
    borderTopRightRadius: Spacing.borderRadius.lg,
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl + 20 : Spacing.xl,
  },
  modalTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  input: {
    fontFamily: Typography.fontFamily.regular,
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  label: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  modalButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
  },
  modalButtonText: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
});
