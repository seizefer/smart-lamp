import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor
} from 'react-native-reanimated';
import { useLightStore } from '../store/useLightStore';
import { Card } from '../components/Card';
import { Slider } from '../components/Slider';
import { colors, getColorTemperatureColor } from '../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../theme/spacing';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export const LightControlScreen: React.FC = () => {
  const {
    isOn,
    brightness,
    colorTemperature,
    currentScene,
    scenes,
    toggleLight,
    setBrightness,
    setColorTemperature,
    applyScene,
    loadState
  } = useLightStore();

  const lightScale = useSharedValue(isOn ? 1 : 0.8);
  const lightOpacity = useSharedValue(isOn ? 1 : 0.5);

  useEffect(() => {
    loadState();
  }, []);

  useEffect(() => {
    lightScale.value = withSpring(isOn ? 1 : 0.8);
    lightOpacity.value = withSpring(isOn ? 1 : 0.5);
  }, [isOn]);

  const animatedLightStyle = useAnimatedStyle(() => ({
    transform: [{ scale: lightScale.value }],
    opacity: lightOpacity.value
  }));

  const handleToggleLight = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    toggleLight();
  };

  const handleBrightnessChange = (value: number) => {
    setBrightness(value);
    if (!isOn && value > 0) {
      toggleLight();
    }
  };

  const handleScenePress = (scene: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    applyScene(scene);
  };

  const lightColor = getColorTemperatureColor(colorTemperature);
  const adjustedBrightness = isOn ? brightness / 100 : 0;

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
            <Text style={styles.title}>智能灯光</Text>
          </View>

          {/* Light Bulb Display */}
          <TouchableOpacity
            onPress={handleToggleLight}
            activeOpacity={0.8}
            style={styles.lightContainer}
          >
            <Animated.View style={[styles.lightBulb, animatedLightStyle]}>
              <View
                style={[
                  styles.lightGlow,
                  {
                    backgroundColor: lightColor,
                    opacity: adjustedBrightness * 0.6
                  }
                ]}
              />
              <View
                style={[
                  styles.lightCore,
                  {
                    backgroundColor: lightColor,
                    opacity: adjustedBrightness
                  }
                ]}
              />
              <Text style={styles.lightEmoji}>💡</Text>
            </Animated.View>
            <Text style={styles.lightStatus}>
              {isOn ? '开启' : '关闭'}
            </Text>
          </TouchableOpacity>

          {/* Controls */}
          <Card style={styles.controlCard}>
            <Slider
              value={brightness}
              onValueChange={handleBrightnessChange}
              minimumValue={0}
              maximumValue={100}
              label="亮度"
              unit="%"
              activeTrackColor={lightColor}
            />

            <View style={styles.spacer} />

            <Slider
              value={colorTemperature}
              onValueChange={setColorTemperature}
              minimumValue={2000}
              maximumValue={6500}
              step={100}
              label="色温"
              unit="K"
              activeTrackColor={getColorTemperatureColor(colorTemperature)}
            />
          </Card>

          {/* Scene Presets */}
          <View style={styles.scenesContainer}>
            <Text style={styles.sectionTitle}>场景</Text>
            <View style={styles.scenesGrid}>
              {scenes.map((scene) => (
                <TouchableOpacity
                  key={scene.id}
                  onPress={() => handleScenePress(scene)}
                  activeOpacity={0.8}
                  style={styles.sceneButton}
                >
                  <LinearGradient
                    colors={
                      currentScene?.id === scene.id
                        ? [colors.gradientStart, colors.gradientEnd]
                        : [colors.surface, colors.surfaceLight]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.sceneGradient}
                  >
                    <View
                      style={[
                        styles.scenePreview,
                        {
                          backgroundColor: getColorTemperatureColor(
                            scene.colorTemperature
                          ),
                          opacity: scene.brightness / 100
                        }
                      ]}
                    />
                    <Text style={styles.sceneName}>{scene.name}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
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
  lightContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl
  },
  lightBulb: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg
  },
  lightGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 20
  },
  lightCore: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60
  },
  lightEmoji: {
    fontSize: 80
  },
  lightStatus: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.text
  },
  controlCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg
  },
  spacer: {
    height: spacing.xl
  },
  scenesContainer: {
    paddingHorizontal: spacing.lg
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md
  },
  scenesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs
  },
  sceneButton: {
    width: (width - spacing.lg * 2 - spacing.xs * 4) / 3,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.md
  },
  sceneGradient: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center'
  },
  scenePreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: spacing.sm
  },
  sceneName: {
    fontSize: fontSize.sm,
    color: colors.text,
    textAlign: 'center'
  }
});
