
import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  showSearch?: boolean;
  onSearchChange?: (text: string) => void;
  onBackPress?: () => void;
  searchValue?: string;
  style?: any;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showSearch = false, 
  onSearchChange, 
  onBackPress,
  searchValue, 
  style 
}) => {
  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, style]}>
      <View style={[styles.header, style]}>
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={[styles.title, onBackPress && { marginLeft: 10 }]}>{title}</Text>
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
    paddingVertical: 12, 
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
  },
  backButton: {
    padding: 8,
    marginRight: 4,
  },
  backButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
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