// Header.tsx - Fixed version
import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  showSearch?: boolean; // optional, defaults to false
  onSearchChange?: (text: string) => void; // callback when text changes
  searchValue?: string; // controlled input value
  style?: any; // custom style prop
}

const Header: React.FC<HeaderProps> = ({ title, showSearch = false, onSearchChange, searchValue, style }) => {
  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, style]}>
      <View style={[styles.header, style]}>
        <Text style={styles.title}>{title}</Text>
        {showSearch && (
          <TextInput
            style={styles.searchInput}
            placeholder="Search here..."
            placeholderTextColor="#666"
            value={searchValue}
            onChangeText={onSearchChange}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#1a202c',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12, // Reduced from paddingBottom: 12
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 50, // Set a minimum height
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchInput: {
    backgroundColor: '#273041',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: '50%',
    color: 'white',
  },
});

export default Header;