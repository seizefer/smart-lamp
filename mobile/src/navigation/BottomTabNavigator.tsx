import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';
import { AlarmsScreen } from '../screens/AlarmsScreen';
import { LightControlScreen } from '../screens/LightControlScreen';
import { SleepScreen } from '../screens/SleepScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const Tab = createBottomTabNavigator();

const TabIcon: React.FC<{ emoji: string; focused: boolean }> = ({
  emoji,
  focused
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(focused ? 1.2 : 1) }]
  }));

  return (
    <Animated.View style={animatedStyle}>
      <View
        style={[
          styles.iconContainer,
          focused && styles.iconContainerFocused
        ]}
      >
        <Animated.Text style={styles.iconText}>{emoji}</Animated.Text>
      </View>
    </Animated.View>
  );
};

export const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted
      }}
    >
      <Tab.Screen
        name="Alarms"
        component={AlarmsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⏰" focused={focused} />
          )
        }}
      />
      <Tab.Screen
        name="Light"
        component={LightControlScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="💡" focused={focused} />
          )
        }}
      />
      <Tab.Screen
        name="Sleep"
        component={SleepScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🌙" focused={focused} />
          )
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⚙️" focused={focused} />
          )
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.backgroundCard,
    borderTopWidth: 0,
    height: 80,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 20
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconContainerFocused: {
    backgroundColor: colors.surface
  },
  iconText: {
    fontSize: 24
  }
});
