import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAlarmStore } from '../store/useAlarmStore';
import { AlarmCard } from '../components/AlarmCard';
import { colors } from '../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../theme/spacing';
import * as Haptics from 'expo-haptics';

export const AlarmsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { alarms, toggleAlarm, loadAlarms } = useAlarmStore();

  useEffect(() => {
    loadAlarms();
  }, []);

  const handleAddAlarm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('AddAlarm');
  };

  const handleAlarmPress = (alarmId: string) => {
    navigation.navigate('EditAlarm', { alarmId });
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundLight]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>闹钟</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddAlarm}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addButtonGradient}
            >
              <Text style={styles.addButtonText}>+</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {alarms.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>⏰</Text>
            <Text style={styles.emptyStateText}>还没有闹钟</Text>
            <Text style={styles.emptyStateSubtext}>点击 + 添加新闹钟</Text>
          </View>
        ) : (
          <FlatList
            data={alarms}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <AlarmCard
                alarm={item}
                onToggle={() => toggleAlarm(item.id)}
                onPress={() => handleAlarmPress(item.id)}
                index={index}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
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
    paddingVertical: spacing.xl,
    paddingTop: spacing.xxl
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.text
  },
  addButton: {
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8
  },
  addButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addButtonText: {
    fontSize: fontSize.xxxl,
    color: colors.text,
    fontWeight: fontWeight.bold
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: spacing.lg
  },
  emptyStateText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm
  },
  emptyStateSubtext: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center'
  }
});
