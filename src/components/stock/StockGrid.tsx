import React from 'react';
import { View, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import StockCard from './StockCard';

export interface Stock {
  id: string;
  name: string;
  price: string;
  icon?: string;
  low?: number;
  high?: number;
  companyName?: string;
}

interface StockGridProps {
  stocks: Stock[];
  columns?: number; // configurable (default: 2)
  onStockPress?: (stock: Stock) => void;
}

export default function StockGrid({ stocks, columns = 2, onStockPress }: StockGridProps) {
  const screenWidth = Dimensions.get('window').width;
  const cardMargin = 12;
  const cardWidth = (screenWidth - cardMargin * (columns + 1)) / columns;

  return (
    <FlatList
      data={stocks}
      keyExtractor={(item) => item.id}
      numColumns={columns}
      columnWrapperStyle={[columns > 1 && styles.row, { marginTop: 0 }]}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={{ margin: cardMargin / 2, width: cardWidth, alignItems: 'center' }}>
          <StockCard 
            id={item.id}
            name={item.name}
            price={item.price}
            icon={item.icon}
            onPress={() => onStockPress?.(item)}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8, // Reduced padding
    paddingTop: 0, // No top padding
    marginTop: 0, // No top margin
  },
  row: {
    justifyContent: 'center',
  },
});