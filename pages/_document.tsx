import { Html, Head, Main, NextScript } from 'next/document';
// import { GoogleAdsenseContainer } from '@/components';

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel='icon'
          href='/avalanche.ico'
        />
        <meta
          name='description'
          content='Learn how to pay off debt!'
        />

        <meta
          name='og:title'
          content='Manage My Debt'
        />
        <meta
          name='twitter:card'
          content='summary_large_image'
        />
        <link
          rel='stylesheet'
          href='https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.3/font/bootstrap-icons.css'
        />
        <link
          rel='preconnect'
          href='https://fonts.googleapis.com'
        />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap'
          rel='stylesheet'
        />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${process.env.ADSENSE_ID}`}
          crossOrigin='anonymous'
        />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
      {/* <footer>
        <GoogleAdsenseContainer slot='8679993967' />
      </footer> */}
    </Html>
  );
}
