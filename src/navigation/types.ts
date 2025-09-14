export type RootStackParamList = {
  MainTabs: undefined;
  ViewAllScreen: {
    type: 'gainers' | 'losers';
    stocks: any[];
  };
  ProductScreen: {
    symbol: string;
    companyName?: string;
    price?: number;
    low?: number;
    high?: number;
    stockData?: any;
    fromViewAll?: boolean;
    viewAllType?: 'gainers' | 'losers';
  };
  WatchlistScreen: undefined;
  WatchlistDetail: {
    watchlistName: string;
    watchlistId: string;
  };
};
