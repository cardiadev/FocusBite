/**
 * Home Screen
 * 
 * Main dashboard showing overview of goals, recent activities,
 * and quick access to key features.
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

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeText, { color: colors.text }]}>
            Welcome back!
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Let's achieve your goals today
          </Text>
        </View>

        {/* Quick Stats Cards */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="flame"
            title="Calories"
            value="1,850"
            target="/ 2,000"
            color={colors.primary}
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            secondaryTextColor={colors.textSecondary}
          />
          <StatCard
            icon="barbell"
            title="Workouts"
            value="3"
            target="/ 5 this week"
            color={colors.success}
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            secondaryTextColor={colors.textSecondary}
          />
        </View>

        {/* Today's Goals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Today's Goals
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          <GoalCard
            title="Drink 8 glasses of water"
            progress={6}
            total={8}
            icon="water"
            primaryColor={colors.primary}
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            secondaryTextColor={colors.textSecondary}
          />
          <GoalCard
            title="Walk 10,000 steps"
            progress={7543}
            total={10000}
            icon="walk"
            primaryColor={colors.primary}
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            secondaryTextColor={colors.textSecondary}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            <ActionButton
              icon="add-circle"
              label="Log Meal"
              backgroundColor={colors.surfaceVariant}
              iconColor={colors.primary}
              textColor={colors.text}
            />
            <ActionButton
              icon="fitness"
              label="Log Workout"
              backgroundColor={colors.surfaceVariant}
              iconColor={colors.success}
              textColor={colors.text}
            />
            <ActionButton
              icon="calendar"
              label="Plan Week"
              backgroundColor={colors.surfaceVariant}
              iconColor={colors.info}
              textColor={colors.text}
            />
            <ActionButton
              icon="analytics"
              label="View Stats"
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

// Reusable Components
interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  target: string;
  color: string;
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
}

function StatCard({
  icon,
  title,
  value,
  target,
  color,
  backgroundColor,
  textColor,
  secondaryTextColor,
}: StatCardProps) {
  return (
    <View style={[styles.statCard, { backgroundColor }]}>
      <Ionicons name={icon} size={32} color={color} />
      <Text style={[styles.statTitle, { color: secondaryTextColor }]}>
        {title}
      </Text>
      <View style={styles.statValueRow}>
        <Text style={[styles.statValue, { color: textColor }]}>{value}</Text>
        <Text style={[styles.statTarget, { color: secondaryTextColor }]}>
          {target}
        </Text>
      </View>
    </View>
  );
}

interface GoalCardProps {
  title: string;
  progress: number;
  total: number;
  icon: keyof typeof Ionicons.glyphMap;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
}

function GoalCard({
  title,
  progress,
  total,
  icon,
  primaryColor,
  backgroundColor,
  textColor,
  secondaryTextColor,
}: GoalCardProps) {
  const percentage = (progress / total) * 100;

  return (
    <View style={[styles.goalCard, { backgroundColor }]}>
      <View style={styles.goalHeader}>
        <Ionicons name={icon} size={24} color={primaryColor} />
        <Text style={[styles.goalTitle, { color: textColor }]}>{title}</Text>
      </View>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: '#E0E0E0' }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${percentage}%`, backgroundColor: primaryColor },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: secondaryTextColor }]}>
          {progress} / {total}
        </Text>
      </View>
    </View>
  );
}

interface ActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  backgroundColor: string;
  iconColor: string;
  textColor: string;
}

function ActionButton({
  icon,
  label,
  backgroundColor,
  iconColor,
  textColor,
}: ActionButtonProps) {
  return (
    <TouchableOpacity style={[styles.actionButton, { backgroundColor }]}>
      <Ionicons name={icon} size={28} color={iconColor} />
      <Text style={[styles.actionLabel, { color: textColor }]}>{label}</Text>
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
    welcomeSection: {
      marginBottom: Spacing.lg,
    },
    welcomeText: {
      fontSize: Typography.fontSize['2xl'],
      fontWeight: Typography.fontWeight.bold,
      marginBottom: Spacing.xs,
    },
    subtitle: {
      fontSize: Typography.fontSize.base,
      fontWeight: Typography.fontWeight.regular,
    },
    statsGrid: {
      flexDirection: 'row',
      gap: Spacing.md,
      marginBottom: Spacing.lg,
    },
    statCard: {
      flex: 1,
      padding: Spacing.md,
      borderRadius: Spacing.borderRadius.md,
      alignItems: 'center',
    },
    statTitle: {
      fontSize: Typography.fontSize.sm,
      marginTop: Spacing.sm,
      fontWeight: Typography.fontWeight.medium,
    },
    statValueRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginTop: Spacing.xs,
    },
    statValue: {
      fontSize: Typography.fontSize.xl,
      fontWeight: Typography.fontWeight.bold,
    },
    statTarget: {
      fontSize: Typography.fontSize.sm,
      marginLeft: Spacing.xs,
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
    goalCard: {
      padding: Spacing.md,
      borderRadius: Spacing.borderRadius.md,
      marginBottom: Spacing.sm,
    },
    goalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    goalTitle: {
      fontSize: Typography.fontSize.base,
      fontWeight: Typography.fontWeight.medium,
      marginLeft: Spacing.sm,
      flex: 1,
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    progressBar: {
      flex: 1,
      height: 8,
      borderRadius: Spacing.borderRadius.full,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: Spacing.borderRadius.full,
    },
    progressText: {
      fontSize: Typography.fontSize.sm,
      marginLeft: Spacing.sm,
      minWidth: 60,
      textAlign: 'right',
    },
    actionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.md,
      marginTop: Spacing.sm,
    },
    actionButton: {
      width: '48%',
      padding: Spacing.md,
      borderRadius: Spacing.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 100,
    },
    actionLabel: {
      fontSize: Typography.fontSize.sm,
      fontWeight: Typography.fontWeight.medium,
      marginTop: Spacing.sm,
      textAlign: 'center',
    },
  });
