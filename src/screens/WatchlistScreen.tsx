"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import { useNavigation, NavigationProp } from "@react-navigation/native"
import { ChevronForwardIcon } from "../assets/icons"
import { RootStackParamList } from "../navigation/types"
import Header from "../components/navigation/Header"
import TabBar from "../components/navigation/TabBar"
import { useWatchlist } from "../context/WatchlistContext"

interface Watchlist {
  id: string
  name: string

}

const WatchlistScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'WatchlistDetail'>>()
  const { watchlists } = useWatchlist()

  const renderWatchlistItem = ({ item, index }: { item: Watchlist, index: number }) => (
    <TouchableOpacity
      style={styles.watchlistItem}
      onPress={() => {
        navigation.navigate("WatchlistDetail", {
          watchlistName: item.name,
          watchlistId: item.id,
        })
      }}
    >
      <View style={styles.watchlistContent}>
        <Text style={styles.watchlistName}>{item.name.replace(/^\d+\.?\s*/, '')}</Text>
   
      </View>
      <View style={{ width: 20, height: 20 }}>
        <ChevronForwardIcon width="100%" height="100%" />
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <Header title="Watchlists" showSearch={false} />

      <View style={styles.content}>
        <FlatList
          data={watchlists}
          renderItem={renderWatchlistItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No watchlists yet</Text>
              <Text style={[styles.emptyText, { fontSize: 14, opacity: 0.7 }]}>Add stocks to create a watchlist</Text>
            </View>
          }
        />
      </View>

      <TabBar />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a202c",
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 8,
  },
  watchlistItem: {
    backgroundColor: '#2D3748',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  watchlistContent: {
    flex: 1,
  },
  watchlistName: {
    color: '#E2E8F0',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: "left",
  },
})

export default WatchlistScreen
