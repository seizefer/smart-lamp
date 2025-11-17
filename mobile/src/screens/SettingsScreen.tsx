import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../components/Card';
import { colors } from '../theme/colors';
import { spacing, fontSize, fontWeight } from '../theme/spacing';
import * as Haptics from 'expo-haptics';

export const SettingsScreen: React.FC = () => {
  const [use24Hour, setUse24Hour] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);
  const [hapticFeedback, setHapticFeedback] = React.useState(true);

  const handleToggle = (setter: (value: boolean) => void, value: boolean) => {
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setter(!value);
  };

  const SettingRow: React.FC<{
    label: string;
    value: boolean;
    onToggle: () => void;
  }> = ({ label, value, onToggle }) => (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.surface, true: colors.primaryLight }}
        thumbColor={value ? colors.primary : colors.textMuted}
        ios_backgroundColor={colors.surface}
      />
    </View>
  );

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundLight]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Text style={styles.title}>设置</Text>
          </View>

          {/* General Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>通用</Text>
            <Card>
              <SettingRow
                label="24小时制"
                value={use24Hour}
                onToggle={() => handleToggle(setUse24Hour, use24Hour)}
              />
              <View style={styles.divider} />
              <SettingRow
                label="深色模式"
                value={darkMode}
                onToggle={() => handleToggle(setDarkMode, darkMode)}
              />
              <View style={styles.divider} />
              <SettingRow
                label="通知"
                value={notifications}
                onToggle={() => handleToggle(setNotifications, notifications)}
              />
              <View style={styles.divider} />
              <SettingRow
                label="触觉反馈"
                value={hapticFeedback}
                onToggle={() => handleToggle(setHapticFeedback, hapticFeedback)}
              />
            </Card>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>关于</Text>
            <Card>
              <TouchableOpacity style={styles.settingRow} activeOpacity={0.8}>
                <Text style={styles.settingLabel}>版本</Text>
                <Text style={styles.settingValue}>1.0.0</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.settingRow} activeOpacity={0.8}>
                <Text style={styles.settingLabel}>反馈</Text>
                <Text style={styles.settingValue}>›</Text>
              </TouchableOpacity>
            </Card>
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appInfoText}>SmartLamp</Text>
            <Text style={styles.appInfoSubtext}>
              智能闹钟与光照控制应用
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  safeArea: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: spacing.xl
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    paddingTop: spacing.xxl
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.text
  },
  section: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md
  },
  settingLabel: {
    fontSize: fontSize.md,
    color: colors.text
  },
  settingValue: {
    fontSize: fontSize.md,
    color: colors.textSecondary
  },
  divider: {
    height: 1,
    backgroundColor: colors.surface
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: spacing.xxl
  },
  appInfoText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs
  },
  appInfoSubtext: {
    fontSize: fontSize.sm,
    color: colors.textSecondary
  }
});
