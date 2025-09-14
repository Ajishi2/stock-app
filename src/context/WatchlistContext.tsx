import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Stock {
  id: string;
  name: string;
  companyName: string;
  price: string;
  low: number;
  high: number;
}

export interface Watchlist {
  id: string;
  name: string;
  stocks: Stock[];
}

interface WatchlistContextType {
  watchlists: Watchlist[];
  addToWatchlist: (watchlistId: string, stock: Stock) => void;
  removeFromWatchlist: (watchlistId: string, stockId: string) => void;
  createWatchlist: (name: string) => void;
  deleteWatchlist: (id: string) => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);

  const addToWatchlist = (watchlistId: string, stock: Stock) => {
    setWatchlists(prev => 
      prev.map(watchlist => 
        watchlist.id === watchlistId
          ? { 
              ...watchlist, 
              stocks: watchlist.stocks.some(s => s.id === stock.id) 
                ? watchlist.stocks 
                : [...watchlist.stocks, stock] 
            }
          : watchlist
      )
    );
  };

  const removeFromWatchlist = (watchlistId: string, stockId: string) => {
    setWatchlists(prev => 
      prev.map(watchlist => 
        watchlist.id === watchlistId
          ? {
              ...watchlist,
              stocks: watchlist.stocks.filter(stock => stock.id !== stockId)
            }
          : watchlist
      )
    );
  };

  const createWatchlist = (name: string) => {
    const newWatchlist: Watchlist = {
      id: Date.now().toString(),
      name,
      stocks: []
    };
    setWatchlists(prev => [...prev, newWatchlist]);
    return newWatchlist;
  };

  const deleteWatchlist = (id: string) => {
    setWatchlists(prev => prev.filter(watchlist => watchlist.id !== id));
  };

  return (
    <WatchlistContext.Provider value={{ watchlists, addToWatchlist, removeFromWatchlist, createWatchlist, deleteWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};