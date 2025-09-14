"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native'
import { fetchCompanyOverview, fetchCompanyLogo as fetchLogo, fetchChartData as fetchChartDataFromAPI, type ChartDataPoint } from '../services/api/alphaVantageAPI'
import { useRoute, useNavigation, CommonActions, type RouteProp } from "@react-navigation/native"
import BookmarkIcon from '../assets/icons/bookmark.svg';
import CheckmarkIcon from '../assets/icons/checkmark.svg';
import Header from "../components/navigation/Header"
import { LineChart, Grid } from "react-native-svg-charts"
import * as shape from "d3-shape"
import type { RootStackParamList } from "../navigation/types"
import { useWatchlist, Stock } from '../context/WatchlistContext';
type ProductScreenRouteProp = RouteProp<RootStackParamList, "ProductScreen">

const TIME_FILTERS = ["1D", "1W", "1M", "3M", "6M", "1Y"]

const ProductScreen = ({ navigation }: any) => {
  const route = useRoute<ProductScreenRouteProp>()
  const { symbol, companyName, price, low, high, fromViewAll, viewAllType } = route.params
  

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: true
    });
  }, [navigation]);

  const handleBackPress = () => {
    if (fromViewAll && viewAllType) {
 
      navigation.navigate('ViewAllScreen', { 
        type: viewAllType,
        title: viewAllType === 'gainers' ? 'Top Gainers' : 
               viewAllType === 'losers' ? 'Top Losers' : 'Most Active'
      });
    } else {

      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
  
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          })
        );
      }
    }
  };

  const [timeFilter, setTimeFilter] = useState<string>("1D")
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [priceChange, setPriceChange] = useState({ change: 0, percentage: 0 })
  const [companyInfo, setCompanyInfo] = useState<any>(null)
  const [companyLogo, setCompanyLogo] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const [dataError, setDataError] = useState<string | null>(null)
  const { watchlists, addToWatchlist, removeFromWatchlist, createWatchlist } = useWatchlist();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [selectedWatchlistId, setSelectedWatchlistId] = useState<string | null>(null);
  const handleSaveToWatchlist = () => {
    if (newWatchlistName.trim()) {
      createWatchlist(newWatchlistName.trim());
      setNewWatchlistName('');
    }
  };

  useEffect(() => {
    fetchChartData()
  }, [symbol, timeFilter])


  useEffect(() => {
    fetchCompanyInfo()
    fetchCompanyLogo()
  }, [symbol])

  const fetchCompanyInfo = async () => {
    const data = await fetchCompanyOverview(symbol);
    if (data) {
      setCompanyInfo(data);
    }
  }

  const fetchCompanyLogo = async () => {
    const logoUrl = await fetchLogo(symbol);
    if (logoUrl) {
      setCompanyLogo(logoUrl);
    }
  }

  const fetchChartData = async () => {
    setLoading(true);
    setDataError(null);
    try {
      const { data, error } = await fetchChartDataFromAPI(symbol, timeFilter);
      
      if (error) {
        throw new Error(error);
      }
      
      const prices = data
      let showCount = prices.length
      

      if (prices.length > 0) {
        switch (timeFilter) {
          case "1D":
            showCount = Math.min(24, prices.length)
            break
          case "1W":
            showCount = Math.min(7, prices.length)
            break
          case "1M":
            showCount = Math.min(30, prices.length)
            break
          case "3M":
            showCount = Math.min(12, prices.length)
            break
          case "6M":
            showCount = Math.min(24, prices.length)
            break
          case "1Y":
            showCount = Math.min(52, prices.length)
            break
        }

        const pricesToShow = prices.slice(-showCount).map(p => p.value)

        const priceChange = pricesToShow.length > 1 
          ? ((pricesToShow[pricesToShow.length - 1] - pricesToShow[0]) / pricesToShow[0]) * 100 
          : 0
        
        setChartData(prices);
        setPriceChange({
          change: priceChange,
          percentage: priceChange / pricesToShow[0] * 100
        });
        setDataError(null);
      } else {
        setDataError("No series data found for this period.")
        setChartData([])
      }
    } catch (err) {
      setDataError("Error fetching chart data.")
      setChartData([])
    } finally {
      setLoading(false)
    }
  }

  const toggleWatchlistSelection = (watchlistId: string) => {
    setSelectedWatchlistId(watchlistId === selectedWatchlistId ? null : watchlistId);
  };

  const formatPrice = (value: number) => `$${Number(value).toFixed(2)}`
  const formatMarketCap = (value: string | undefined) => {
    if (!value) return 'N/A';
    const num = parseFloat(value);
    if (isNaN(num)) return 'N/A';
    if (num >= 1000000000000) {
      return `$${(num / 1000000000000).toFixed(2)}T`;
    } else if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else {
      return `$${num.toFixed(2)}`;
    }
  }



  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header 
          title="Details Screen" 
          showSearch={false} 
          style={styles.headerStyle}
          onBackPress={handleBackPress}
        />
        <TouchableOpacity 
          style={styles.bookmarkButton} 
          onPress={() => setShowSaveModal(true)}
        >
          <BookmarkIcon width={28} height={28}/>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Company info + price */}
        <View style={styles.topRow}>
          <View style={styles.companyInfo}>
            {companyLogo ? (
              <Image source={{ uri: companyLogo }} style={styles.logo} />
            ) : null}
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.companyName}>{companyInfo?.Name ?? companyName ?? `${symbol} Company`}</Text>
              <Text style={styles.ticker}>{symbol}, Common Stock</Text>
              <Text style={styles.exchange}>{companyInfo?.Exchange ?? "NASDAQ"}</Text>
            </View>
          </View>
          <View style={styles.priceInfo}>
            <Text style={styles.currentPrice}>{formatPrice(price || 0)}</Text>
            <Text style={[styles.changeText, priceChange.change >= 0 ? styles.positive : styles.negative]}>
              {priceChange.change >= 0 ? "+" : ""}
              {priceChange.change.toFixed(2)} ({priceChange.percentage.toFixed(2)}%)
            </Text>
          </View>
        </View>
        
        {/* Graph */}
        <View style={styles.chartContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text>Loading chart...</Text>
            </View>
          ) : chartData.length > 1 ? (
            <LineChart
              style={styles.chart}
              data={chartData.map(d => d.value)}
              svg={{ stroke: priceChange.change >= 0 ? '#4CAF50' : '#F44336' }}
              contentInset={{ top: 20, bottom: 20 }}
              curve={shape.curveNatural}
            >
              <Grid />
            </LineChart>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No chart data available</Text>
              {dataError && <Text style={styles.noDataSubtext}>{dataError}</Text>}
              {!dataError && <Text style={styles.noDataSubtext}>Try selecting a different time period</Text>}
            </View>
          )}
        </View>

        {/* Time Filter Buttons */}
        <View style={styles.timeFilterRow}>
          {TIME_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.timeButton,
                timeFilter === filter && styles.timeButtonActive,
              ]}
              onPress={() => setTimeFilter(filter)}
            >
              <Text
                style={[
                  styles.timeButtonText,
                  timeFilter === filter && styles.timeButtonTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Company Description */}
        {companyInfo && companyInfo.Description && (
          <View style={styles.companyOverview}>
            <Text style={styles.overviewTitle}>About {companyInfo.Name || symbol}</Text>
            <Text style={styles.overviewText}>{companyInfo.Description}</Text>
          </View>
        )}
        
        {/* Sector and Industry in separate orange boxes */}
        <View style={styles.orangeBoxRow}>
          {companyInfo?.Sector && (
            <View style={styles.orangeBox}>
              <Text style={styles.orangeBoxText}>
                Sector: {companyInfo.Sector}
              </Text>
            </View>
          )}
          {companyInfo?.Industry && (
            <View style={styles.orangeBox}>
              <Text style={styles.orangeBoxText}>
                Industry: {companyInfo.Industry}
              </Text>
            </View>
          )}
        </View>

        {/* Stock Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>52 Week Low</Text>
            <Text style={styles.statValue}>{formatPrice(companyInfo?.["52WeekLow"] || low || 0)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Current Price</Text>
            <Text style={styles.statValue}>{formatPrice(price || 0)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>52 Week High</Text>
            <Text style={styles.statValue}>{formatPrice(companyInfo?.["52WeekHigh"] || high || 0)}</Text>
          </View>
        </View>

        {/* Financial Metrics Row */}
        {companyInfo && (
          <View style={styles.financialMetrics}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Market Cap</Text>
                <Text style={styles.metricValue}>
                  {companyInfo.MarketCapitalization ? formatMarketCap(companyInfo.MarketCapitalization) : "N/A"}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Div Yield</Text>
                <Text style={styles.metricValue}>
                  {companyInfo.DividendYield ? `${(companyInfo.DividendYield * 100).toFixed(2)}%` : "N/A"}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Profit Margin</Text>
                <Text style={styles.metricValue}>
                  {companyInfo.ProfitMargin ? `${(companyInfo.ProfitMargin * 100).toFixed(2)}%` : "N/A"}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Beta</Text>
                <Text style={styles.metricValue}>{companyInfo.Beta || "N/A"}</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>P/E Ratio</Text>
                <Text style={styles.metricValue}>{companyInfo.PERatio || "N/A"}</Text>
              </View>
            </ScrollView>
          </View>
        )}

     
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showSaveModal}
        onRequestClose={() => setShowSaveModal(false)}
      >
        <View style={styles.popupOverlay}>
          <TouchableOpacity style={styles.popupBackdrop} onPress={() => setShowSaveModal(false)} activeOpacity={1} />
          <View style={styles.popupContent}>
            <Text style={styles.popupTitle}>Add to Watchlist</Text>

            {/* New Watchlist Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter new watchlist name"
                placeholderTextColor="#999"
                value={newWatchlistName}
                onChangeText={setNewWatchlistName}
              />
              <TouchableOpacity 
                style={[styles.addButton, !newWatchlistName.trim() && styles.disabledButton]}
                onPress={() => {
                  if (newWatchlistName.trim()) {
                    createWatchlist(newWatchlistName.trim());
                    setNewWatchlistName("");
                  }
                }}
                disabled={!newWatchlistName.trim()}
              >
                <Text style={styles.addButtonText}>Create</Text>
              </TouchableOpacity>
            </View>

            {/* Existing Watchlists */}
            <Text style={styles.sectionTitle}>Your Watchlists</Text>
            <View style={styles.watchlistContainer}>
              {watchlists.length > 0 ? (
                watchlists.map((watchlist) => {
                  const isStockInWatchlist = watchlist.stocks.some(stock => stock.id === symbol);
                  return (
                    <TouchableOpacity
                      key={watchlist.id}
                      style={[
                        styles.watchlistItem,
                        selectedWatchlistId === watchlist.id && styles.watchlistItemSelected
                      ]}
                      onPress={() => toggleWatchlistSelection(watchlist.id)}
                    >
                      <View style={[
                        styles.checkbox,
                        selectedWatchlistId === watchlist.id && styles.checkboxActive
                      ]}>
                        {selectedWatchlistId === watchlist.id && (
                          <View style={{ margin: 3 }}>
                            <CheckmarkIcon width={14} height={14} fill="#fff" />
                          </View>
                        )}
                      </View>
                      <Text style={styles.watchlistName}>{watchlist.name}</Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text style={styles.emptyText}>No watchlists yet. Create one above.</Text>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.popupButtons}>
              <TouchableOpacity
                style={[styles.popupButton, styles.cancelButton]}
                onPress={() => setShowSaveModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.popupButton, styles.saveButton]} 
                onPress={() => {
                  if (selectedWatchlistId) {
                    const stock: Stock = {
                      id: symbol,
                      name: symbol,
                      companyName: companyName || symbol,
                      price: price !== undefined && price !== null ? price.toString() : '0',
                      low: typeof low === 'number' ? low : 0,
                      high: typeof high === 'number' ? high : 0
                    };
                    addToWatchlist(selectedWatchlistId, stock);
                    Alert.alert('Success', `Added ${symbol} to watchlist`);
                    setShowSaveModal(false);
                  } else {
                    Alert.alert('Error', 'Please select a watchlist');
                  }
                }}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerContainer: {
    backgroundColor: '#1a202c',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  // Bookmark icon in header
  bookmarkButton: {
    position: 'absolute',
    right: 16,
    top: 15,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: '100%',
  },
  // Save button in modal
  saveButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginLeft: 8,
    flex: 1,
  },
  
  content: { padding: 16 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  companyInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  logo: { width: 50, height: 50, borderRadius: 8 },
  companyName: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  ticker: { fontSize: 14, color: "#666", marginTop: 2 },
  exchange: { fontSize: 12, color: "#999", marginTop: 1 },
  priceInfo: { alignItems: "flex-end" },
  currentPrice: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  changeText: { fontSize: 14, marginTop: 4 },
  positive: { color: "#10B981" },
  negative: { color: "#EF4444" },
  chartContainer: { marginVertical: 20, backgroundColor: "#f9f9f9", borderRadius: 10, padding: 10 },
  chart: {
    height: 200,
    padding: 0,
    margin: 0
  },
  loadingContainer: { height: 250, justifyContent: "center", alignItems: "center" },
  noDataContainer: { height: 250, justifyContent: "center", alignItems: "center" },
  noDataText: { fontSize: 16, color: "#666", marginBottom: 8 },
  noDataSubtext: { fontSize: 14, color: "#999", textAlign: "center" },
  timeFilterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    padding: 4,
  },
  timeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 2,
  },
  timeButtonActive: { backgroundColor: "#007AFF" },
  timeButtonText: { fontSize: 12, color: "#333", fontWeight: "500" },
  timeButtonTextActive: { color: "#fff", fontWeight: "bold" },
  orangeBoxRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  orangeBox: {
    backgroundColor: "rgba(230, 76, 25, 0.2)", 
    borderRadius: 50, 
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 105, 53, 0.6)", 
  },
  
  orangeBoxText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  statItem: { alignItems: "center", flex: 1 },
  statLabel: { fontSize: 12, color: "#666", marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: "bold", color: "#333" },
  financialMetrics: {
    marginBottom: 20,
  },
  metricItem: {
    alignItems: "center",

    marginRight: -2,
    minWidth: 100,
  },
  metricLabel: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#333",
  },
  companyOverview: { marginTop: 20 },
  overviewTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#333" },
  overviewText: { fontSize: 14, color: "#444", lineHeight: 22, marginBottom: 16 },
  companyDetails: { marginTop: 12 },
  overviewMeta: { fontSize: 14, color: "#555", marginBottom: 6 },
  labelText: { fontWeight: "600", color: "#333" },
  popupOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  popupBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  popupContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  addButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  watchlistContainer: {
    marginBottom: 24,
  },
  watchlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  watchlistItemSelected: {
    borderColor: '#4a5568',

  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4a5568',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
   
    borderColor: '#FF6B35',
  },
  checkboxSelected: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  disabledButton: {
    opacity: 0.5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E2E8F0',
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  emptyText: {
    color: '#A0AEC0',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  watchlistName: {
    fontSize: 16,
    color: "#333",
  },
  popupButtons: {
    flexDirection: "row",
    gap: 12,
  },
  popupButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f1f3f4",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "500",
    fontSize: 16,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
})

export default ProductScreen