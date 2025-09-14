// Temporary hardcoded values for testing
const API_KEY = '9FHTZTPZM6OWNKYW';
const BASE_URL = 'https://www.alphavantage.co/query';

export const getTopGainersLosers = async () => {
  try {
    console.log('Making request to Alpha Vantage...');
    
    const url = `${BASE_URL}?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`;
    console.log('Full URL:', url);
    
    const response = await fetch(url);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Response data:', data);

    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }

    return {
      topGainers: data.top_gainers || [],
      topLosers: data.top_losers || [],
      mostActivelyTraded: data.most_actively_traded || [],
    };
  } catch (error) {
    console.error('Error fetching top gainers/losers:', error);
    throw error;
  }
};