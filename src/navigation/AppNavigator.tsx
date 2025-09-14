// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import ViewAllScreen from '../screens/ViewAllScreen';
import ProductScreen from '../screens/ProductScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import WatchlistDetailScreen from '../screens/WatchlistDetailScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#1a202c' }, // Match your dark theme
        animation: 'fade',
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen 
        name="ViewAllScreen" 
        component={ViewAllScreen}
        options={{
          headerShown: false, // This will hide the default header
        }}
      />
      <Stack.Screen name="ProductScreen" component={ProductScreen} />
      <Stack.Screen name="WatchlistScreen" component={WatchlistScreen} />
      <Stack.Screen 
        name="WatchlistDetail" 
        component={WatchlistDetailScreen}
        options={{
          headerShown: false,

        }}
      />
    </Stack.Navigator>
  );
};