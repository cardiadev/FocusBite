/**
 * Nutrition Screen
 * 
 * Displays nutrition tracking, daily calorie intake,
 * macronutrient breakdown, and meal logging.
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

export default function NutritionScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Summary Card */}
        <View style={[styles.summaryCard, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Today's Nutrition
          </Text>
          
          <View style={styles.calorieRing}>
            <Text style={[styles.calorieValue, { color: colors.text }]}>
              1,850
            </Text>
            <Text style={[styles.calorieLabel, { color: colors.textSecondary }]}>
              / 2,000 kcal
            </Text>
          </View>

          {/* Macronutrients */}
          <View style={styles.macroGrid}>
            <MacroItem
              label="Protein"
              value={85}
              target={120}
              unit="g"
              color={colors.primary}
              textColor={colors.text}
              secondaryTextColor={colors.textSecondary}
            />
            <MacroItem
              label="Carbs"
              value={180}
              target={250}
              unit="g"
              color={colors.info}
              textColor={colors.text}
              secondaryTextColor={colors.textSecondary}
            />
            <MacroItem
              label="Fats"
              value={52}
              target={65}
              unit="g"
              color={colors.warning}
              textColor={colors.text}
              secondaryTextColor={colors.textSecondary}
            />
          </View>
        </View>

        {/* Meal Sections */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Today's Meals
            </Text>
            <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
              <Ionicons name="add" size={20} color={colors.textOnPrimary} />
            </TouchableOpacity>
          </View>

          <MealSection
            icon="sunny"
            title="Breakfast"
            calories={420}
            items={2}
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            secondaryTextColor={colors.textSecondary}
            iconColor={colors.warning}
          />
          <MealSection
            icon="partly-sunny"
            title="Lunch"
            calories={650}
            items={3}
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            secondaryTextColor={colors.textSecondary}
            iconColor={colors.info}
          />
          <MealSection
            icon="moon"
            title="Dinner"
            calories={780}
            items={4}
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            secondaryTextColor={colors.textSecondary}
            iconColor={colors.primary}
          />
          <MealSection
            icon="ice-cream"
            title="Snacks"
            calories={0}
            items={0}
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            secondaryTextColor={colors.textSecondary}
            iconColor={colors.success}
          />
        </View>

        {/* Water Intake */}
        <View style={[styles.waterCard, { backgroundColor: colors.surfaceVariant }]}>
          <View style={styles.waterHeader}>
            <Ionicons name="water" size={24} color={colors.info} />
            <Text style={[styles.waterTitle, { color: colors.text }]}>
              Water Intake
            </Text>
          </View>
          <View style={styles.waterGlasses}>
            {[...Array(8)].map((_, i) => (
              <Ionicons
                key={i}
                name={i < 6 ? 'water' : 'water-outline'}
                size={28}
                color={i < 6 ? colors.info : colors.border}
                style={styles.glassIcon}
              />
            ))}
          </View>
          <Text style={[styles.waterProgress, { color: colors.textSecondary }]}>
            6 / 8 glasses
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// Components
interface MacroItemProps {
  label: string;
  value: number;
  target: number;
  unit: string;
  color: string;
  textColor: string;
  secondaryTextColor: string;
}

function MacroItem({ label, value, target, unit, color, textColor, secondaryTextColor }: MacroItemProps) {
  const percentage = (value / target) * 100;

  return (
    <View style={styles.macroItem}>
      <Text style={[styles.macroLabel, { color: secondaryTextColor }]}>
        {label}
      </Text>
      <View style={[styles.macroBar, { backgroundColor: '#E0E0E0' }]}>
        <View
          style={[
            styles.macroFill,
            { width: `${Math.min(percentage, 100)}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={[styles.macroValue, { color: textColor }]}>
        {value} / {target}{unit}
      </Text>
    </View>
  );
}

interface MealSectionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  calories: number;
  items: number;
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
  iconColor: string;
}

function MealSection({
  icon,
  title,
  calories,
  items,
  backgroundColor,
  textColor,
  secondaryTextColor,
  iconColor,
}: MealSectionProps) {
  return (
    <TouchableOpacity style={[styles.mealCard, { backgroundColor }]}>
      <Ionicons name={icon} size={28} color={iconColor} />
      <View style={styles.mealInfo}>
        <Text style={[styles.mealTitle, { color: textColor }]}>{title}</Text>
        <Text style={[styles.mealDetails, { color: secondaryTextColor }]}>
          {items > 0 ? `${calories} kcal • ${items} items` : 'No items logged'}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={secondaryTextColor} />
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
  summaryCard: {
    padding: Spacing.lg,
    borderRadius: Spacing.borderRadius.lg,
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.md,
  },
  calorieRing: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  calorieValue: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
  },
  calorieLabel: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.base,
    marginTop: Spacing.xs,
  },
  macroGrid: {
    gap: Spacing.md,
  },
  macroItem: {
    gap: Spacing.xs,
  },
  macroLabel: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  macroBar: {
    height: 8,
    borderRadius: Spacing.borderRadius.full,
    overflow: 'hidden',
  },
  macroFill: {
    height: '100%',
  },
  macroValue: {
    fontSize: Typography.fontSize.sm,
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
  addButton: {
    width: 32,
    height: 32,
    borderRadius: Spacing.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    marginBottom: Spacing.sm,
  },
  mealInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  mealTitle: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: 2,
  },
  mealDetails: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.sm,
  },
  waterCard: {
    padding: Spacing.lg,
    borderRadius: Spacing.borderRadius.lg,
  },
  waterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  waterTitle: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginLeft: Spacing.sm,
  },
  waterGlasses: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  glassIcon: {
    marginHorizontal: 2,
  },
  waterProgress: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
  },
});
