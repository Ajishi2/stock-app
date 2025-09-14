import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { NavigationState, Route } from '@react-navigation/native';

const TabBar: React.FC<BottomTabBarProps> = ({
  state = { 
    index: 0, 
    routes: [],
    key: 'tab',
    routeNames: [],
    type: 'tab',
    stale: false as const,
    history: []
  } as unknown as NavigationState<Record<string, object>>,
  descriptors = {},
  navigation
}) => {
  const insets = useSafeAreaInsets();
  
  // Early return if no routes are available
  if (!state?.routes?.length) {
    return null;
  }

  return (
    <SafeAreaView edges={['bottom']} style={[styles.safeArea, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route: Route<string>, index: number) => {
          const { options } = descriptors[route.key] || {};
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={[
                styles.tabButton,
                isFocused && styles.tabButtonActive, // apply active style
                index !== state.routes.length - 1 && styles.tabDivider, // add divider except last
              ]}
            >
              <Text style={[styles.tabText, isFocused && styles.tabTextActive]}>
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#1a202c',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1a202c',
    marginHorizontal: 16,
    borderRadius: 15,
    height: 56,
    overflow: 'hidden',
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,  // Increased from 12 to 16 for better touch targets
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,  // Added minimum height for better touch targets
  },
  tabButtonActive: {
    backgroundColor: '#33d49e',
  },
  tabDivider: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabText: {
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#ffffff',
  },
});

export default TabBar;
