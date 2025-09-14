import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { enableScreens } from 'react-native-screens';
import { WatchlistProvider } from './src/context/WatchlistContext';
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="#1a202c"
      />
      <NavigationContainer>
        <WatchlistProvider>
          <AppNavigator />
        </WatchlistProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
enableScreens();

export default App;