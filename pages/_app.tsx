import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
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

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      require('bootstrap/dist/js/bootstrap');
    }
  }, []);

  return getLayout(<Component {...pageProps} />);
}