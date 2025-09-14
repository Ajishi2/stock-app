import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Header from '../components/navigation/Header';
import StockGrid, { Stock } from '../components/stock/StockGrid';
import { RootStackParamList } from '../navigation/types';
import { getTopGainersLosers } from '../types/api';

type ViewAllScreenRouteProp = RouteProp<RootStackParamList, 'ViewAllScreen'>;

const ViewAllScreen = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');

  const navigation = useNavigation<any>();
  const route = useRoute<ViewAllScreenRouteProp>(); 
  const { type, stocks: initialStocks } = route.params ?? { type: 'gainers', stocks: [] };

  const isGainers = type === 'gainers';
  const title = isGainers ? 'Top Gainers' : 'Top Losers';

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (initialStocks && initialStocks.length > 0) {
        setStocks(initialStocks);
        setLoading(false);
      } else {
        loadStockData();
      }
    });

    return unsubscribe;
  }, [navigation, type, initialStocks]);

  const loadStockData = async () => {
    setLoading(true);
    setError(null);

    try {
      const { topGainers, topLosers } = await getTopGainersLosers();
      const data = isGainers ? topGainers : topLosers;

      const formattedStocks: Stock[] = (data || []).map((item: any) => {
        const symbol = item.ticker || item.symbol || 'N/A';
        const companyName = item.name || `${symbol} Inc`;
        
        const rawPrice = parseFloat(item.price?.replace('$', '') || '0');
        const changePercent = parseFloat(item.change_percentage?.replace('%', '') || '0');
        
        const changeAmount = (rawPrice * Math.abs(changePercent)) / 100;
        const lowNum = Math.max(0, rawPrice - changeAmount);
        const highNum = rawPrice + changeAmount;

        return {
          id: symbol,
          name: symbol,
          companyName,
          price: `$${rawPrice.toFixed(2)}`,
          low: lowNum,
          high: highNum,
          icon: undefined,
        } as Stock;
      });

      setStocks(formattedStocks);
    } catch (err: any) {
      console.error('loadStockData error:', err);
      if (err?.response?.data?.Information || err?.message) {
        setError(err?.response?.data?.Information ?? String(err.message));
      } else {
        setError('Failed to load stock data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStockPress = (stock: Stock) => {
    navigation.navigate('ProductScreen', { 
      symbol: stock.name,
      stockData: stock,
      fromViewAll: true,
      viewAllType: type
    });
  };

  const filteredStocks = stocks.filter((stock) =>
    stock.name.toLowerCase().includes(searchText.toLowerCase()) ||
    (stock.companyName?.toLowerCase().includes(searchText.toLowerCase()))
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#33d49e" />
        <Text style={styles.loadingText}>Loading stocks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadStockData}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
      <View style={styles.container}>
      <Header
        title={title}
        showSearch={false}
        searchValue={searchText}
        onSearchChange={setSearchText}
      />

        <FlatList
        data={[{ key: 'content' }]}
        renderItem={() => (
          <View style={styles.scrollContent}>
            {/* Stock Grid Section */}
            <View style={styles.section}>
              <StockGrid
                stocks={filteredStocks}
                columns={2}
                onStockPress={handleStockPress}
              />
            </View>
          </View>
        )}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
      />
      </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#1a202c',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  section: {
    marginTop: 16, 
    paddingHorizontal: 16, 
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a202c',
  },
  loadingText: {
    color: 'white',
    marginTop: 16,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#33d49e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default ViewAllScreen;