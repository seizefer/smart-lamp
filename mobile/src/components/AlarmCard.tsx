import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { Card } from './Card';
import { colors } from '../theme/colors';
import { spacing, fontSize, fontWeight } from '../theme/spacing';
import { Alarm } from '../types';
import * as Haptics from 'expo-haptics';

interface AlarmCardProps {
  alarm: Alarm;
  onToggle: () => void;
  onPress: () => void;
  index: number;
}

export const AlarmCard: React.FC<AlarmCardProps> = ({
  alarm,
  onToggle,
  onPress,
  index
}) => {
  const getRepeatText = () => {
    const days = alarm.repeat;
    const activeDays = Object.entries(days).filter(([_, active]) => active);

    if (activeDays.length === 0) return '仅一次';
    if (activeDays.length === 7) return '每天';
    if (activeDays.length === 5 &&
        days.monday && days.tuesday && days.wednesday &&
        days.thursday && days.friday) {
      return '工作日';
    }
    if (activeDays.length === 2 && days.saturday && days.sunday) {
      return '周末';
    }

    const dayNames: { [key: string]: string } = {
      monday: '一',
      tuesday: '二',
      wednesday: '三',
      thursday: '四',
      friday: '五',
      saturday: '六',
      sunday: '日'
    };

    return activeDays.map(([day]) => dayNames[day]).join(', ');
  };

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggle();
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100)}
      exiting={FadeOutLeft}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <Card style={styles.card}>
          <View style={styles.content}>
            <View style={styles.leftContent}>
              <Text style={[styles.time, !alarm.enabled && styles.disabled]}>
                {alarm.time}
              </Text>
              <Text style={[styles.label, !alarm.enabled && styles.disabled]}>
                {alarm.label || '闹钟'}
              </Text>
              <Text style={[styles.repeat, !alarm.enabled && styles.disabled]}>
                {getRepeatText()}
              </Text>
            </View>
            <Switch
              value={alarm.enabled}
              onValueChange={handleToggle}
              trackColor={{ false: colors.surface, true: colors.primaryLight }}
              thumbColor={alarm.enabled ? colors.primary : colors.textMuted}
              ios_backgroundColor={colors.surface}
            />
          </View>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  leftContent: {
    flex: 1
  },
  time: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs
  },
  label: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs
  },
  repeat: {
    fontSize: fontSize.sm,
    color: colors.textMuted
  },
  disabled: {
    opacity: 0.5
  }
});
