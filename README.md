# Stock Market App

A comprehensive stock market application built with React Native, providing real-time stock data, watchlist functionality, and detailed stock information.

## 📱 About the App

Stock Market App is a mobile application designed to help users track and monitor stock market data in real-time. The app provides a clean, intuitive interface for both novice and experienced investors to stay updated with their favorite stocks.

### Key Features:

- **Real-time Stock Data**: Get up-to-date stock prices and market information
- **Watchlists**: Create and manage multiple watchlists to organize your stocks
- **Stock Details**: View comprehensive information about each stock including price history and key metrics
- **Search Functionality**: Easily find stocks by company name or ticker symbol
- **Offline Support**: Access your watchlists and recent searches even without an internet connection
- **Themes**: Switch between light and dark mode for comfortable viewing in any environment

### Screens:
1. **Home/Explore**: Browse and discover trending stocks
2. **Search**: Find stocks by company name or ticker
3. **Watchlists**: View and manage your saved watchlists
4. **Stock Detail**: View detailed information about a specific stock
5. **Watchlist Detail**: View the stocks in a specific watchlist

The app is built with performance and user experience in mind, ensuring smooth navigation and quick access to the information you need.

## Features

- 📈 Real-time stock data
- 📱 Cross-platform (iOS & Android)
- ⭐ Add stocks to watchlists
- 🔍 Search for stocks
- 📊 View detailed stock information
- 🔄 Offline data caching

## Tech Stack

- React Native
- TypeScript
- React Navigation
- Context API for state management
- Alpha Vantage API for stock data
- AsyncStorage for local storage

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- React Native development environment setup
- iOS Simulator / Xcode (for iOS development)
- Android Studio / Android Emulator (for Android development)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Ajishi2/stock-app.git
   cd stock-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Alpha Vantage API key:
     ```
     ALPHA_VANTAGE_API_KEY=your_api_key_here
     ```

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```
