import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { useSleepStore } from '../store/useSleepStore';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../theme/spacing';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export const SleepScreen: React.FC = () => {
  const {
    isTracking,
    sessions,
    startTracking,
    stopTracking,
    getAverageQuality,
    loadSessions
  } = useSleepStore();

  const [elapsedTime, setElapsedTime] = useState(0);
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);

      pulseAnim.value = withRepeat(
        withTiming(1.2, {
          duration: 1500,
          easing: Easing.inOut(Easing.ease)
        }),
        -1,
        true
      );

      return () => clearInterval(interval);
    } else {
      setElapsedTime(0);
      pulseAnim.value = 1;
    }
  }, [isTracking]);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }]
  }));

  const handleStartStop = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (isTracking) {
      stopTracking(85); // Mock quality score
    } else {
      startTracking();
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}小时${mins}分钟`;
  };

  const averageQuality = getAverageQuality(7);
  const recentSessions = sessions.slice(0, 5);

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
            <Text style={styles.title}>睡眠监测</Text>
          </View>

          {/* Sleep Tracking Display */}
          <Card style={styles.trackingCard} gradient>
            <Animated.View style={[styles.moonContainer, animatedPulseStyle]}>
              <Text style={styles.moonEmoji}>🌙</Text>
            </Animated.View>

            {isTracking ? (
              <>
                <Text style={styles.statusText}>正在监测...</Text>
                <Text style={styles.timeText}>{formatTime(elapsedTime)}</Text>
              </>
            ) : (
              <>
                <Text style={styles.statusText}>准备就绪</Text>
                <Text style={styles.subtitleText}>开始追踪您的睡眠</Text>
              </>
            )}

            <Button
              title={isTracking ? '停止监测' : '开始监测'}
              onPress={handleStartStop}
              variant={isTracking ? 'outline' : 'primary'}
              size="lg"
              style={styles.trackButton}
            />
          </Card>

          {/* Sleep Stats */}
          <View style={styles.statsContainer}>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{sessions.length}</Text>
              <Text style={styles.statLabel}>总记录</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{averageQuality}%</Text>
              <Text style={styles.statLabel}>平均质量</Text>
            </Card>
          </View>

          {/* Recent Sessions */}
          {recentSessions.length > 0 && (
            <View style={styles.sessionsContainer}>
              <Text style={styles.sectionTitle}>最近记录</Text>
              {recentSessions.map((session) => (
                <Card key={session.id} style={styles.sessionCard}>
                  <View style={styles.sessionHeader}>
                    <Text style={styles.sessionDate}>{session.date}</Text>
                    <View style={styles.qualityBadge}>
                      <Text style={styles.qualityText}>{session.quality}%</Text>
                    </View>
                  </View>
                  <Text style={styles.sessionDuration}>
                    {formatDuration(session.duration)}
                  </Text>
                  <View style={styles.sessionDetails}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>深睡</Text>
                      <Text style={styles.detailValue}>
                        {formatDuration(session.deepSleep)}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>浅睡</Text>
                      <Text style={styles.detailValue}>
                        {formatDuration(session.lightSleep)}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>清醒</Text>
                      <Text style={styles.detailValue}>
                        {formatDuration(session.awake)}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
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
  trackingCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
    paddingVertical: spacing.xxl
  },
  moonContainer: {
    marginBottom: spacing.lg
  },
  moonEmoji: {
    fontSize: 80
  },
  statusText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm
  },
  timeText: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xl
  },
  subtitleText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xl
  },
  trackButton: {
    minWidth: 200
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xl
  },
  statValue: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary
  },
  sessionsContainer: {
    paddingHorizontal: spacing.lg
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md
  },
  sessionCard: {
    marginBottom: spacing.md
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  sessionDate: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text
  },
  qualityBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm
  },
  qualityText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.text
  },
  sessionDuration: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  detailItem: {
    flex: 1,
    alignItems: 'center'
  },
  detailLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs
  },
  detailValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text
  }
});
