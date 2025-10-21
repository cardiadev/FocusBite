/**
 * Meal Prep Screen
 * 
 * Displays meal prep plans, shopping lists,
 * and prep schedule for the week.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MealPrepScreen() {
  const { colors } = useTheme();

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
              value="12"
              label="Meals Planned"
              textColor={colors.text}
              secondaryTextColor={colors.textSecondary}
              iconColor={colors.primary}
            />
            <PlanStat
              icon="checkmark-circle"
              value="5"
              label="Completed"
              textColor={colors.text}
              secondaryTextColor={colors.textSecondary}
              iconColor={colors.success}
            />
            <PlanStat
              icon="time"
              value="3.5h"
              label="Prep Time"
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
            <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
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
          
          <PrepTask
            title="Grilled Chicken Breast"
            servings={4}
            prepTime={30}
            isCompleted={true}
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            secondaryTextColor={colors.textSecondary}
            completedColor={colors.success}
          />
          <PrepTask
            title="Quinoa & Vegetable Bowl"
            servings={5}
            prepTime={25}
            isCompleted={true}
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            secondaryTextColor={colors.textSecondary}
            completedColor={colors.success}
          />
          <PrepTask
            title="Overnight Oats"
            servings={3}
            prepTime={10}
            isCompleted={false}
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            secondaryTextColor={colors.textSecondary}
            completedColor={colors.success}
          />
        </View>

        {/* Shopping List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Shopping List
            </Text>
            <TouchableOpacity>
              <Ionicons name="cart" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.shoppingCard, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={[styles.shoppingTitle, { color: colors.text }]}>
              12 items remaining
            </Text>
            <View style={styles.itemsList}>
              <ShoppingItem
                name="Chicken breast"
                quantity="2 lbs"
                isChecked={false}
                textColor={colors.text}
                secondaryTextColor={colors.textSecondary}
                checkedColor={colors.success}
              />
              <ShoppingItem
                name="Quinoa"
                quantity="1 cup"
                isChecked={false}
                textColor={colors.text}
                secondaryTextColor={colors.textSecondary}
                checkedColor={colors.success}
              />
              <ShoppingItem
                name="Mixed vegetables"
                quantity="3 cups"
                isChecked={true}
                textColor={colors.text}
                secondaryTextColor={colors.textSecondary}
                checkedColor={colors.success}
              />
            </View>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>
                View all items
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recipe Suggestions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recipe Ideas
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <RecipeCard
              title="Mediterranean Bowl"
              prepTime={35}
              servings={4}
              backgroundColor={colors.surfaceVariant}
              textColor={colors.text}
              secondaryTextColor={colors.textSecondary}
            />
            <RecipeCard
              title="Protein Pancakes"
              prepTime={20}
              servings={2}
              backgroundColor={colors.surfaceVariant}
              textColor={colors.text}
              secondaryTextColor={colors.textSecondary}
            />
          </ScrollView>
        </View>
      </ScrollView>
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
}

function PrepTask({ title, servings, prepTime, isCompleted, backgroundColor, textColor, secondaryTextColor, completedColor }: PrepTaskProps) {
  return (
    <TouchableOpacity style={[styles.taskCard, { backgroundColor }]}>
      <Ionicons
        name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
        size={24}
        color={isCompleted ? completedColor : secondaryTextColor}
      />
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
    </TouchableOpacity>
  );
}

interface ShoppingItemProps {
  name: string;
  quantity: string;
  isChecked: boolean;
  textColor: string;
  secondaryTextColor: string;
  checkedColor: string;
}

function ShoppingItem({ name, quantity, isChecked, textColor, secondaryTextColor, checkedColor }: ShoppingItemProps) {
  return (
    <View style={styles.shoppingItem}>
      <Ionicons
        name={isChecked ? 'checkmark-circle' : 'ellipse-outline'}
        size={20}
        color={isChecked ? checkedColor : secondaryTextColor}
      />
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
    </View>
  );
}

interface RecipeCardProps {
  title: string;
  prepTime: number;
  servings: number;
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
}

function RecipeCard({ title, prepTime, servings, backgroundColor, textColor, secondaryTextColor }: RecipeCardProps) {
  return (
    <TouchableOpacity style={[styles.recipeCard, { backgroundColor }]}>
      <View style={styles.recipePlaceholder}>
        <Ionicons name="image-outline" size={40} color={secondaryTextColor} />
      </View>
      <Text style={[styles.recipeTitle, { color: textColor }]}>{title}</Text>
      <Text style={[styles.recipeDetails, { color: secondaryTextColor }]}>
        {prepTime} min • {servings} servings
      </Text>
    </TouchableOpacity>
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
});
