/**
 * Exercise Screen
 * 
 * Displays exercise tracking, workout history,
 * and fitness statistics.
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

export default function ExerciseScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Weekly Summary */}
        <View style={[styles.summaryCard, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            This Week
          </Text>
          
          <View style={styles.statsRow}>
            <StatBox
              icon="flame"
              label="Calories"
              value="2,450"
              unit="kcal"
              iconColor={colors.error}
              textColor={colors.text}
              secondaryTextColor={colors.textSecondary}
            />
            <StatBox
              icon="time"
              label="Duration"
              value="4.5"
              unit="hours"
              iconColor={colors.primary}
              textColor={colors.text}
              secondaryTextColor={colors.textSecondary}
            />
            <StatBox
              icon="trending-up"
              label="Workouts"
              value="3"
              unit="sessions"
              iconColor={colors.success}
              textColor={colors.text}
              secondaryTextColor={colors.textSecondary}
            />
          </View>
        </View>

        {/* Today's Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Today's Activity
            </Text>
            <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
              <Ionicons name="add" size={20} color={colors.textOnPrimary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.activityCard, { backgroundColor: colors.surfaceVariant }]}>
            <Ionicons name="walk" size={32} color={colors.primary} />
            <View style={styles.activityInfo}>
              <Text style={[styles.activityTitle, { color: colors.text }]}>
                Steps
              </Text>
              <Text style={[styles.activityValue, { color: colors.text }]}>
                7,543 / 10,000
              </Text>
            </View>
            <View style={styles.progressRing}>
              <Text style={[styles.progressPercent, { color: colors.primary }]}>
                75%
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Workouts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recent Workouts
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <WorkoutCard
            icon="barbell"
            title="Upper Body Strength"
            duration={45}
            calories={320}
            date="Today, 7:00 AM"
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            secondaryTextColor={colors.textSecondary}
            iconColor={colors.success}
          />
          <WorkoutCard
            icon="bicycle"
            title="Morning Cycling"
            duration={60}
            calories={480}
            date="Yesterday, 6:30 AM"
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            secondaryTextColor={colors.textSecondary}
            iconColor={colors.info}
          />
          <WorkoutCard
            icon="fitness"
            title="HIIT Training"
            duration={30}
            calories={350}
            date="2 days ago"
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            secondaryTextColor={colors.textSecondary}
            iconColor={colors.error}
          />
        </View>

        {/* Quick Start Workouts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Start
          </Text>
          <View style={styles.quickStartGrid}>
            <QuickStartButton
              icon="walk"
              label="Walking"
              backgroundColor={colors.surfaceVariant}
              iconColor={colors.primary}
              textColor={colors.text}
            />
            <QuickStartButton
              icon="bicycle"
              label="Cycling"
              backgroundColor={colors.surfaceVariant}
              iconColor={colors.info}
              textColor={colors.text}
            />
            <QuickStartButton
              icon="barbell"
              label="Strength"
              backgroundColor={colors.surfaceVariant}
              iconColor={colors.success}
              textColor={colors.text}
            />
            <QuickStartButton
              icon="body"
              label="Yoga"
              backgroundColor={colors.surfaceVariant}
              iconColor={colors.warning}
              textColor={colors.text}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Components
interface StatBoxProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  unit: string;
  iconColor: string;
  textColor: string;
  secondaryTextColor: string;
}

function StatBox({ icon, label, value, unit, iconColor, textColor, secondaryTextColor }: StatBoxProps) {
  return (
    <View style={styles.statBox}>
      <Ionicons name={icon} size={24} color={iconColor} />
      <Text style={[styles.statValue, { color: textColor }]}>{value}</Text>
      <Text style={[styles.statUnit, { color: secondaryTextColor }]}>{unit}</Text>
      <Text style={[styles.statLabel, { color: secondaryTextColor }]}>{label}</Text>
    </View>
  );
}

interface WorkoutCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  duration: number;
  calories: number;
  date: string;
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
  iconColor: string;
}

function WorkoutCard({
  icon,
  title,
  duration,
  calories,
  date,
  backgroundColor,
  textColor,
  secondaryTextColor,
  iconColor,
}: WorkoutCardProps) {
  return (
    <TouchableOpacity style={[styles.workoutCard, { backgroundColor }]}>
      <View style={[styles.workoutIcon, { backgroundColor: iconColor + '20' }]}>
        <Ionicons name={icon} size={28} color={iconColor} />
      </View>
      <View style={styles.workoutInfo}>
        <Text style={[styles.workoutTitle, { color: textColor }]}>{title}</Text>
        <Text style={[styles.workoutDetails, { color: secondaryTextColor }]}>
          {duration} min • {calories} kcal
        </Text>
        <Text style={[styles.workoutDate, { color: secondaryTextColor }]}>
          {date}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={secondaryTextColor} />
    </TouchableOpacity>
  );
}

interface QuickStartButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  backgroundColor: string;
  iconColor: string;
  textColor: string;
}

function QuickStartButton({ icon, label, backgroundColor, iconColor, textColor }: QuickStartButtonProps) {
  return (
    <TouchableOpacity style={[styles.quickStartButton, { backgroundColor }]}>
      <Ionicons name={icon} size={32} color={iconColor} />
      <Text style={[styles.quickStartLabel, { color: textColor }]}>{label}</Text>
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statValue: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginTop: Spacing.xs,
  },
  statUnit: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.sm,
  },
  statLabel: {
    fontFamily: Typography.fontFamily.regular,
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
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: Spacing.borderRadius.md,
  },
  activityInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  activityTitle: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: 4,
  },
  activityValue: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  progressRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#B39DDB',
  },
  progressPercent: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
  workoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    marginBottom: Spacing.sm,
  },
  workoutIcon: {
    width: 56,
    height: 56,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  workoutTitle: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: 2,
  },
  workoutDetails: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.sm,
    marginBottom: 2,
  },
  workoutDate: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
  },
  quickStartGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  quickStartButton: {
    width: '48%',
    padding: Spacing.lg,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickStartLabel: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    marginTop: Spacing.sm,
  },
});
