import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  LayoutChangeEvent,
  Text
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing, borderRadius, fontSize } from '../theme/spacing';
import * as Haptics from 'expo-haptics';

interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  showValue?: boolean;
  thumbColor?: string;
  trackColor?: string;
  activeTrackColor?: string;
  label?: string;
  unit?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  showValue = true,
  thumbColor = colors.primary,
  trackColor = colors.surface,
  activeTrackColor = colors.primary,
  label,
  unit = ''
}) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const [dragging, setDragging] = useState(false);

  const normalizedValue = (value - minimumValue) / (maximumValue - minimumValue);
  const thumbPosition = new Animated.Value(normalizedValue * sliderWidth);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setDragging(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    onPanResponderMove: (_, gestureState) => {
      let newPosition = normalizedValue * sliderWidth + gestureState.dx;
      newPosition = Math.max(0, Math.min(sliderWidth, newPosition));

      thumbPosition.setValue(newPosition);

      const newValue = (newPosition / sliderWidth) * (maximumValue - minimumValue) + minimumValue;
      const steppedValue = Math.round(newValue / step) * step;

      if (steppedValue !== value) {
        onValueChange(steppedValue);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    onPanResponderRelease: () => {
      setDragging(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setSliderWidth(width);
  };

  React.useEffect(() => {
    if (!dragging && sliderWidth > 0) {
      Animated.spring(thumbPosition, {
        toValue: normalizedValue * sliderWidth,
        useNativeDriver: false,
        tension: 100,
        friction: 10
      }).start();
    }
  }, [value, sliderWidth, dragging]);

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {showValue && (
            <Text style={styles.value}>
              {Math.round(value)}{unit}
            </Text>
          )}
        </View>
      )}
      <View style={styles.sliderContainer} onLayout={handleLayout}>
        <View style={[styles.track, { backgroundColor: trackColor }]} />
        <Animated.View
          style={[
            styles.activeTrack,
            {
              backgroundColor: activeTrackColor,
              width: thumbPosition
            }
          ]}
        />
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.thumb,
            {
              backgroundColor: thumbColor,
              left: thumbPosition,
              transform: [{ scale: dragging ? 1.2 : 1 }]
            }
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textSecondary
  },
  value: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: '600'
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center'
  },
  track: {
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    width: '100%'
  },
  activeTrack: {
    height: 4,
    borderRadius: 2,
    position: 'absolute'
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: 'absolute',
    marginLeft: -12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5
  }
});
