import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAlarmStore } from '../store/useAlarmStore';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../theme/spacing';
import { Alarm, RepeatDays } from '../types';
import * as Haptics from 'expo-haptics';

const DAYS = [
  { key: 'monday', label: '周一', short: '一' },
  { key: 'tuesday', label: '周二', short: '二' },
  { key: 'wednesday', label: '周三', short: '三' },
  { key: 'thursday', label: '周四', short: '四' },
  { key: 'friday', label: '周五', short: '五' },
  { key: 'saturday', label: '周六', short: '六' },
  { key: 'sunday', label: '周日', short: '日' }
];

export const AddEditAlarmScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route
}) => {
  const { alarms, addAlarm, updateAlarm, deleteAlarm } = useAlarmStore();
  const alarmId = route.params?.alarmId;
  const existingAlarm = alarmId ? alarms.find((a) => a.id === alarmId) : null;
  const isEdit = !!existingAlarm;

  const [time, setTime] = useState(
    existingAlarm
      ? new Date(`2000-01-01T${existingAlarm.time}:00`)
      : new Date()
  );
  const [label, setLabel] = useState(existingAlarm?.label || '');
  const [repeatDays, setRepeatDays] = useState<RepeatDays>(
    existingAlarm?.repeat || {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    }
  );
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleTimeChange = (_: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setTime(selectedTime);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const toggleDay = (day: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRepeatDays((prev) => ({
      ...prev,
      [day]: !prev[day as keyof RepeatDays]
    }));
  };

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    const alarmData = {
      time: timeString,
      label,
      repeat: repeatDays,
      enabled: true,
      sound: 'default',
      vibrate: true,
      snooze: true,
      snoozeDuration: 10,
      gradualVolume: true,
      lightEffect: true
    };

    if (isEdit && alarmId) {
      updateAlarm(alarmId, alarmData);
    } else {
      addAlarm({
        id: Date.now().toString(),
        ...alarmData
      });
    }

    navigation.goBack();
  };

  const handleDelete = () => {
    if (alarmId) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      deleteAlarm(alarmId);
      navigation.goBack();
    }
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundLight]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButton}>取消</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{isEdit ? '编辑闹钟' : '新建闹钟'}</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>保存</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Time Picker */}
          <Card style={styles.timeCard}>
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.timeDisplay}>
                {time.toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })}
              </Text>
            </TouchableOpacity>
          </Card>

          {(showTimePicker || Platform.OS === 'ios') && (
            <Card style={styles.pickerCard}>
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
                textColor={colors.text}
                style={styles.picker}
              />
            </Card>
          )}

          {/* Label */}
          <Card style={styles.inputCard}>
            <Text style={styles.inputLabel}>标签</Text>
            <TextInput
              style={styles.input}
              value={label}
              onChangeText={setLabel}
              placeholder="早安闹钟"
              placeholderTextColor={colors.textMuted}
            />
          </Card>

          {/* Repeat Days */}
          <Card style={styles.repeatCard}>
            <Text style={styles.inputLabel}>重复</Text>
            <View style={styles.daysContainer}>
              {DAYS.map((day) => (
                <TouchableOpacity
                  key={day.key}
                  onPress={() => toggleDay(day.key)}
                  activeOpacity={0.8}
                  style={styles.dayButton}
                >
                  <View
                    style={[
                      styles.dayCircle,
                      repeatDays[day.key as keyof RepeatDays] &&
                        styles.dayCircleActive
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        repeatDays[day.key as keyof RepeatDays] &&
                          styles.dayTextActive
                      ]}
                    >
                      {day.short}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Delete Button */}
          {isEdit && (
            <Button
              title="删除闹钟"
              onPress={handleDelete}
              variant="outline"
              style={styles.deleteButton}
              textStyle={styles.deleteButtonText}
            />
          )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingTop: spacing.xl
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text
  },
  cancelButton: {
    fontSize: fontSize.md,
    color: colors.textSecondary
  },
  saveButton: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.primary
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl
  },
  timeCard: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    marginBottom: spacing.lg
  },
  timeDisplay: {
    fontSize: 64,
    fontWeight: fontWeight.bold,
    color: colors.text
  },
  pickerCard: {
    marginBottom: spacing.lg,
    overflow: 'hidden'
  },
  picker: {
    width: '100%'
  },
  inputCard: {
    marginBottom: spacing.lg
  },
  inputLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.md
  },
  input: {
    fontSize: fontSize.lg,
    color: colors.text,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface
  },
  repeatCard: {
    marginBottom: spacing.lg
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dayButton: {
    flex: 1,
    alignItems: 'center'
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dayCircleActive: {
    backgroundColor: colors.primary
  },
  dayText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary
  },
  dayTextActive: {
    color: colors.text,
    fontWeight: fontWeight.bold
  },
  deleteButton: {
    marginTop: spacing.xl,
    borderColor: colors.error
  },
  deleteButtonText: {
    color: colors.error
  }
});
