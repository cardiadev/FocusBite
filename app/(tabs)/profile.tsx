/**
 * Profile Screen
 * 
 * Displays user profile information, app settings,
 * preferences, and statistics.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: colors.surfaceVariant }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.textOnPrimary }]}>
              JD
            </Text>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>John Doe</Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>
            john.doe@example.com
          </Text>
          <TouchableOpacity
            style={[styles.editButton, { borderColor: colors.border }]}
          >
            <Text style={[styles.editButtonText, { color: colors.primary }]}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <StatCard
            icon="flame"
            value="15,420"
            label="Total Calories Tracked"
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            secondaryTextColor={colors.textSecondary}
            iconColor={colors.error}
          />
          <StatCard
            icon="fitness"
            value="42"
            label="Workouts Completed"
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            secondaryTextColor={colors.textSecondary}
            iconColor={colors.success}
          />
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Preferences
          </Text>
          
          <SettingItem
            icon="moon"
            title="Dark Mode"
            subtitle="Toggle app appearance"
            rightComponent={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.textOnPrimary}
              />
            }
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            secondaryTextColor={colors.textSecondary}
            iconColor={colors.primary}
          />
          
          <SettingItem
            icon="notifications"
            title="Notifications"
            subtitle="Enable push notifications"
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.textOnPrimary}
              />
            }
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            secondaryTextColor={colors.textSecondary}
            iconColor={colors.info}
          />
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            App Settings
          </Text>
          
          <MenuButton
            icon="person"
            title="Account Settings"
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            iconColor={colors.primary}
          />
          <MenuButton
            icon="shield-checkmark"
            title="Privacy & Security"
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            iconColor={colors.success}
          />
          <MenuButton
            icon="heart"
            title="Health Data"
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            iconColor={colors.error}
          />
          <MenuButton
            icon="download"
            title="Export Data"
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            iconColor={colors.warning}
          />
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About
          </Text>
          
          <MenuButton
            icon="information-circle"
            title="About FocusBite"
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            iconColor={colors.info}
          />
          <MenuButton
            icon="help-circle"
            title="Help & Support"
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            iconColor={colors.primary}
          />
          <MenuButton
            icon="star"
            title="Rate Us"
            backgroundColor={colors.surfaceVariant}
            textColor={colors.text}
            iconColor={colors.warning}
          />
        </View>

        {/* Version */}
        <Text style={[styles.version, { color: colors.textSecondary }]}>
          Version 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

// Components
interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
  iconColor: string;
}

function StatCard({ icon, value, label, backgroundColor, textColor, secondaryTextColor, iconColor }: StatCardProps) {
  return (
    <View style={[styles.statCard, { backgroundColor }]}>
      <Ionicons name={icon} size={28} color={iconColor} />
      <Text style={[styles.statValue, { color: textColor }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: secondaryTextColor }]}>{label}</Text>
    </View>
  );
}

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  rightComponent: React.ReactNode;
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
  iconColor: string;
}

function SettingItem({
  icon,
  title,
  subtitle,
  rightComponent,
  backgroundColor,
  textColor,
  secondaryTextColor,
  iconColor,
}: SettingItemProps) {
  return (
    <View style={[styles.settingItem, { backgroundColor }]}>
      <Ionicons name={icon} size={24} color={iconColor} />
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, { color: textColor }]}>{title}</Text>
        <Text style={[styles.settingSubtitle, { color: secondaryTextColor }]}>
          {subtitle}
        </Text>
      </View>
      {rightComponent}
    </View>
  );
}

interface MenuButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  backgroundColor: string;
  textColor: string;
  iconColor: string;
}

function MenuButton({ icon, title, backgroundColor, textColor, iconColor }: MenuButtonProps) {
  return (
    <TouchableOpacity style={[styles.menuButton, { backgroundColor }]}>
      <Ionicons name={icon} size={24} color={iconColor} />
      <Text style={[styles.menuTitle, { color: textColor }]}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color={textColor} />
    </TouchableOpacity>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  profileHeader: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
  },
  name: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  email: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.md,
  },
  editButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.borderRadius.full,
    borderWidth: 1,
  },
  editButtonText: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  statsSection: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statValue: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
  },
  statLabel: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
  },
  section: {
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.screenPadding,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    marginBottom: Spacing.sm,
  },
  settingInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  settingTitle: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.sm,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    marginBottom: Spacing.sm,
  },
  menuTitle: {
    fontFamily: Typography.fontFamily.medium,
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    marginLeft: Spacing.md,
  },
  version: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});
