import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface StockCardProps {
  id: string;
  name: string;
  price: string;
  icon?: string;
  onPress?: (id: string) => void;
}

export default function StockCard({ id, name, price, icon, onPress }: StockCardProps) {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress?.(id)}
      activeOpacity={0.7}
    >
      {/* Circle for logo */}
      <View style={styles.iconWrapper}>
        {icon ? (
          <Image source={{ uri: icon }} style={styles.icon} />
        ) : null}
      </View>

      {/* Stock details */}
      <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
      <Text style={styles.price}>{price}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2f3749',
    borderRadius: 12,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4, // for Android shadow
    width: 144, // ~w-36
    height: 128, // ~h-32
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#d1d5db', // gray-300
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  name: {
    fontWeight: '600',
    fontSize: 14,
    color: 'white',
  },
  price: {
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
  },
});
