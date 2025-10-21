/**
 * Meal Prep Screen
 * 
 * Displays meal prep plans, shopping lists,
 * and prep schedule for the week.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { usePrepTasks, useShoppingItems, useRecipeIdeas } from '@/hooks/useMealPrepPlanning';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MealPrepScreen() {
  const { colors } = useTheme();
  
  // Hooks for data management
  const { tasks, toggleTaskCompletion, createTask, deleteTask, completedCount, totalCount } = usePrepTasks();
  const { items, toggleItemChecked, createItem, deleteItem, clearCheckedItems, uncheckedCount } = useShoppingItems();
  const { recipes, toggleFavorite, createRecipe, deleteRecipe } = useRecipeIdeas();
  
  // Modal states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showShoppingModal, setShowShoppingModal] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  
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
    setShowTaskModal(false);
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
    setShowShoppingModal(false);
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
    setShowRecipeModal(false);
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Plan Summary */}
        <View style={[styles.planCard, { backgroundColor: colors.surfaceVariant }]}>
          <View style={styles.planHeader}>
            <View>
              <Text style={[styles.planTitle, { color: colors.text }]}>
                Weekly Meal Plan
              </Text>
              <Text style={[styles.planSubtitle, { color: colors.textSecondary }]}>
                Jan 20 - Jan 26, 2025
              </Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="create-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.planStats}>
            <PlanStat
              icon="restaurant"
              value={totalCount.toString()}
              label="Prep Tasks"
              textColor={colors.text}
              secondaryTextColor={colors.textSecondary}
              iconColor={colors.primary}
            />
            <PlanStat
              icon="checkmark-circle"
              value={completedCount.toString()}
              label="Completed"
              textColor={colors.text}
              secondaryTextColor={colors.textSecondary}
              iconColor={colors.success}
            />
            <PlanStat
              icon="cart"
              value={uncheckedCount.toString()}
              label="To Buy"
              textColor={colors.text}
              secondaryTextColor={colors.textSecondary}
              iconColor={colors.info}
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
              {DAYS.map((day, index) => (
                <DayCard
                  key={day}
                  day={day}
                  date={20 + index}
                  isToday={index === 1}
                  mealsCount={index % 2 === 0 ? 3 : 2}
                  backgroundColor={colors.surfaceVariant}
                  textColor={colors.text}
                  secondaryTextColor={colors.textSecondary}
                  activeColor={colors.primary}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Today's Meal Prep */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Today's Prep Tasks
          </Text>
          
          {tasks.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No prep tasks yet. Tap + to add one!
            </Text>
          ) : (
            tasks.map((task) => (
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
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTaskModal(false)}
      >
        <View style={styles.modalOverlay}>
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
                onPress={() => setShowTaskModal(false)}
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
        </View>
      </Modal>
      
      {/* Add Shopping Item Modal */}
      <Modal
        visible={showShoppingModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowShoppingModal(false)}
      >
        <View style={styles.modalOverlay}>
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
                onPress={() => setShowShoppingModal(false)}
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
        </View>
      </Modal>
      
      {/* Add Recipe Modal */}
      <Modal
        visible={showRecipeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRecipeModal(false)}
      >
        <View style={styles.modalOverlay}>
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
                onPress={() => setShowRecipeModal(false)}
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
        </View>
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
  mealsCount: number;
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
  activeColor: string;
}

function DayCard({ day, date, isToday, mealsCount, backgroundColor, textColor, secondaryTextColor, activeColor }: DayCardProps) {
  return (
    <View
      style={[
        styles.dayCard,
        { backgroundColor },
        isToday && { borderColor: activeColor, borderWidth: 2 },
      ]}
    >
      <Text style={[styles.dayName, { color: isToday ? activeColor : secondaryTextColor }]}>
        {day}
      </Text>
      <Text style={[styles.dayDate, { color: textColor }]}>{date}</Text>
      <Text style={[styles.mealCount, { color: secondaryTextColor }]}>
        {mealsCount} meals
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
    padding: Spacing.lg,
    borderRadius: Spacing.borderRadius.lg,
    marginBottom: Spacing.lg,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  planTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },
  planSubtitle: {
    fontSize: Typography.fontSize.sm,
    marginTop: Spacing.xs,
  },
  planStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
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
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },
  seeAll: {
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
  },
  dayName: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  dayDate: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
  },
  mealCount: {
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
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: 2,
  },
  taskDetails: {
    fontSize: Typography.fontSize.sm,
  },
  shoppingCard: {
    padding: Spacing.lg,
    borderRadius: Spacing.borderRadius.md,
  },
  shoppingTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.md,
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
    flex: 1,
    fontSize: Typography.fontSize.base,
  },
  itemQuantity: {
    fontSize: Typography.fontSize.sm,
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  viewAllText: {
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  recipeTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  recipeDetails: {
    fontSize: Typography.fontSize.sm,
  },
  // New styles
  emptyText: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    paddingVertical: Spacing.lg,
    fontStyle: 'italic',
  },
  shoppingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  clearText: {
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.xl,
  },
  modalTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  input: {
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
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
});
