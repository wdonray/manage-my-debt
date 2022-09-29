declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_ANALYTICS: string;
      ADSENSE_ID: string;
      ADSENSE_AD_CLIENT: string;
    }
  }
}

export { };