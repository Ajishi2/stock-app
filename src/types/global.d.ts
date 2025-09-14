declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '*.svg?url' {
  const content: string;
  export default content;
}

declare namespace NodeJS {
  interface ProcessEnv {
    ALPHA_VANTAGE_API_KEY: string;
    ALPHA_VANTAGE_BASE_URL: string;
  }
}
