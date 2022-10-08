import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '@aws-amplify/ui-react/styles.css';
import '../styles/globals.scss';
import 'react-toastify/dist/ReactToastify.css';

type NextPageWithLayout = NextPage & {
  // eslint-disable-next-line no-unused-vars
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      require('bootstrap/dist/js/bootstrap');
    }
  }, []);

  return (
    <>
      <Script
        id={process.env.ADSENSE_ID}
        data-ad-client={process.env.ADSENSE_AD_CLIENT}
        async strategy='afterInteractive'
        onError={(e) => { console.error('Script failed to load', e); }}
        src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
      />
      {getLayout(<Component {...pageProps} />)}
    </>
  );
}