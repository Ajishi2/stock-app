import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Header from '../components/navigation/Header';
import StockGrid from '../components/stock/StockGrid';

import { BASE_URL, API_KEY } from '../services/api/alphaVantageAPI';

// --- Helper to fetch data ---
const getTopGainersLosers = async () => {
  try {
    const url = `${BASE_URL}?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }

    return {
      topGainers: data.top_gainers || [],
      topLosers: data.top_losers || [],
      mostActivelyTraded: data.most_actively_traded || [],
    };
  } catch (error) {
    throw error;
  }
};

const ExploreScreen = () => {
  const [topGainers, setTopGainers] = useState<any[]>([]);
  const [topLosers, setTopLosers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [allStocks, setAllStocks] = useState<{gainers: any[], losers: any[]}>({ gainers: [], losers: [] });

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    loadStockData();
  }, []);

  // Filter stocks based on search query
  const filterStocks = (stocks: any[], query: string) => {
    if (!query) return stocks;
    const lowerCaseQuery = query.toLowerCase();
    return stocks.filter(stock => 
      stock.name.toLowerCase().includes(lowerCaseQuery) ||
      (stock.companyName && stock.companyName.toLowerCase().includes(lowerCaseQuery))
    );
  };

  // Get filtered stocks
  const filteredGainers = filterStocks(topGainers, searchQuery);
  const filteredLosers = filterStocks(topLosers, searchQuery);
  const showSearchResults = searchQuery.length > 0;

  const loadStockData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getTopGainersLosers();

      // Format stocks for display
      const formatStocks = (stocks: any[]) =>
        stocks.map((stock, index) => ({
          id: stock.ticker || index.toString(),
          name: stock.ticker,
          companyName: stock.name, // Store company name for search
          price: `$${stock.price}`,
          change: stock.change_percentage,
          changeAmount: stock.change_amount,
          volume: stock.volume,
        }));

      const formattedGainers = formatStocks(data.topGainers);
      const formattedLosers = formatStocks(data.topLosers);
      
      setTopGainers(formattedGainers);
      setTopLosers(formattedLosers);
      setAllStocks({
        gainers: formattedGainers,
        losers: formattedLosers
      });
    } catch (err: any) {
      setError(err.message || 'Error fetching stock data');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAll = (type: 'gainers' | 'losers') => {
    navigation.navigate('ViewAllScreen', { 
      type,
      stocks: type === 'gainers' ? topGainers : topLosers 
    });
  };

  const handleStockPress = (stock: any) => {
    navigation.navigate('ProductScreen', { 
      symbol: stock.name,
      stockData: stock 
    });
  };

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
        title="Stockaroo" 
        showSearch 
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <FlatList
        data={[{ key: 'content' }]}
        renderItem={() => (
          <View style={styles.scrollContent}>
            {showSearchResults ? (
              // Show search results
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    Search Results for "{searchQuery}"
                  </Text>
                </View>
                <View style={[styles.stockGridContainer, { alignItems: 'flex-start' }]}>
                {filteredGainers.length > 0 || filteredLosers.length > 0 ? (
                  <StockGrid 
                    stocks={[...filteredGainers, ...filteredLosers]}
                    columns={2}
                    onStockPress={handleStockPress}
                    style={{ alignSelf: 'flex-start' }}
                  />
                ) : (
                  <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>No stocks found matching "{searchQuery}"</Text>
                  </View>
                )}
                </View>
              </View>
            ) : (
              // Show regular sections when not searching
              <>
                {/* Top Gainers Section */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Top Gainers</Text>
                    <TouchableOpacity onPress={() => handleViewAll('gainers')}>
                      <Text style={styles.viewAll}>View All</Text>
                    </TouchableOpacity>
                  </View>
                  <StockGrid 
                    stocks={topGainers.slice(0, 4)} 
                    columns={2} 
                    onStockPress={handleStockPress}
                  />
                </View>

                {/* Top Losers Section */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Top Losers</Text>
                    <TouchableOpacity onPress={() => handleViewAll('losers')}>
                      <Text style={styles.viewAll}>View All</Text>
                    </TouchableOpacity>
                  </View>
                  <StockGrid 
                    stocks={topLosers.slice(0, 4)} 
                    columns={2} 
                    onStockPress={handleStockPress}
                  />
                </View>
              </>
            )}
          </View>
        )}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadStockData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a202c',
  },
  stockGridContainer: {
    paddingHorizontal: 0,
    marginHorizontal: 12,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  section: {
    marginBottom: 24,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  viewAll: {
    fontSize: 14,
    color: '#33d49e',
    fontWeight: '600',
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

export default ExploreScreen;