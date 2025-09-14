import Config from 'react-native-config';

export const BASE_URL = Config.ALPHA_VANTAGE_BASE_URL || 'https://www.alphavantage.co/query';
export const API_KEY = Config.ALPHA_VANTAGE_API_KEY;

interface CompanyOverview {
  Symbol: string;
  AssetType: string;
  Name: string;
  Description: string;
  Exchange: string;
  Country: string;
  Sector: string;
  Industry: string;
  // Add other fields as needed
}

interface CompanyLogo {
  logo: string;
  // Add other fields as needed
}

export const fetchCompanyOverview = async (symbol: string): Promise<CompanyOverview | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();
    
    if (data['Error Message'] || data['Note'] || !data.Symbol) {
      console.log('No company overview data available');
      return null;
    }
    
    return data as CompanyOverview;
  } catch (error) {
    console.error('Error fetching company overview:', error);
    return null;
  }
};

export const fetchCompanyLogo = async (symbol: string): Promise<string | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=LOGO&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();
    
    if (data && data.logo) {
      return data.logo as string;
    }
    return null;
  } catch (error) {
    console.error('Error fetching company logo:', error);
    return null;
  }
};

export interface ChartDataPoint {
  date: string;
  value: number;
}

export const fetchChartData = async (symbol: string, timeFilter: string): Promise<{ data: ChartDataPoint[]; error: string | null }> => {
  try {
    let functionName = "";
    let seriesKey = "";
    let interval = "";

    switch (timeFilter) {
      case "1D":
        functionName = "TIME_SERIES_INTRADAY";
        seriesKey = "Time Series (5min)";
        interval = "5min";
        break;
      case "1W":
      case "1M":
        functionName = "TIME_SERIES_DAILY";
        seriesKey = "Time Series (Daily)";
        break;
      case "3M":
      case "6M":
      case "1Y":
        functionName = "TIME_SERIES_WEEKLY";
        seriesKey = "Weekly Time Series";
        break;
      default:
        functionName = "TIME_SERIES_INTRADAY";
        seriesKey = "Time Series (5min)";
        interval = "5min";
    }

    const params = new URLSearchParams({
      function: functionName,
      symbol,
      apikey: API_KEY,
      ...(interval && { interval }),
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    const data = await response.json();

    if (data["Error Message"] || data["Note"]) {
      return { data: [], error: data["Error Message"] || data["Note"] };
    }

    const timeSeries = data[seriesKey];
    if (!timeSeries) {
      return { data: [], error: "No data available" };
    }

    const chartData = Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
      date,
      value: parseFloat(values["4. close"]),
    }));

    // Sort by date and limit to last 100 points for better performance
    return {
      data: chartData
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-100),
      error: null,
    };
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return { data: [], error: "Failed to fetch chart data" };
  }
};