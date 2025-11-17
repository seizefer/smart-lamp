import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomTabNavigator } from './BottomTabNavigator';
import { AddEditAlarmScreen } from '../screens/AddEditAlarmScreen';

const Stack = createStackNavigator();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          presentation: 'modal'
        }}
      >
        <Stack.Screen name="Main" component={BottomTabNavigator} />
        <Stack.Screen name="AddAlarm" component={AddEditAlarmScreen} />
        <Stack.Screen name="EditAlarm" component={AddEditAlarmScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
