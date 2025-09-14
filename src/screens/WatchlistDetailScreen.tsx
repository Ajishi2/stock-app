import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native"
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native"
import { Stock, useWatchlist } from "../context/WatchlistContext"
import { RootStackParamList } from "../navigation/types"
import Header from "../components/navigation/Header"
import TabBar from "../components/navigation/TabBar"

type WatchlistDetailRouteProp = RouteProp<RootStackParamList, 'WatchlistDetail'>;

const WatchlistDetailScreen = () => {
  const route = useRoute<WatchlistDetailRouteProp>();
  const { watchlistId, watchlistName } = route.params
  const { watchlists } = useWatchlist()
  const navigation = useNavigation<any>()
  const [loading, setLoading] = useState<boolean>(true)
  const [stocks, setStocks] = useState<Stock[]>([])

  useEffect(() => {
    const currentWatchlist = watchlists.find(w => w.id === watchlistId)
    if (currentWatchlist) {
      setStocks(currentWatchlist.stocks)
    }
    setLoading(false)
  }, [watchlists, watchlistId])

  const handleStockPress = (stock: Stock) => {
    navigation.navigate("ProductScreen", {
      symbol: stock.name,
      companyName: stock.companyName,
      price: parseFloat(stock.price),
      low: stock.low,
      high: stock.high
    })
  }

  const renderStockItem = ({ item }: { item: Stock }) => (
    <TouchableOpacity
      style={styles.stockItem}
      onPress={() => handleStockPress(item)}
    >
      <View style={styles.stockInfo}>
        <Text style={styles.stockSymbol}>{item.name}</Text>
        <Text style={styles.stockName} numberOfLines={1}>{item.companyName}</Text>
      </View>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title={watchlistName} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header title={watchlistName} />
      
      {stocks.length > 0 ? (
        <FlatList
          data={stocks}
          renderItem={renderStockItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No stocks in this watchlist</Text>
        </View>
      )}
      
      <TabBar />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a202c",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  stockItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#2d3748",
    borderRadius: 8,
    marginBottom: 8,
  },
  stockInfo: {
    flex: 1,
    marginRight: 12,
  },
  stockSymbol: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  stockName: {
    color: "#a0aec0",
    fontSize: 14,
  },
  stockPriceContainer: {
    alignItems: "flex-end",
  },
  stockPrice: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#a0aec0",
    fontSize: 16,
  },
})

export default WatchlistDetailScreen