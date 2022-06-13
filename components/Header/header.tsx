import Head from 'next/head';
import styles from './header.module.scss';

export const siteTitle = 'Debt Repayment';

export default function Header() {
  return (
    <>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <meta
          name='description'
          content='Learn how to pay off debt!'
        />
        <meta name='og:title' content={siteTitle} />
        <meta name='twitter:card' content='summary_large_image' />
      </Head>
      <header className={styles.header} />
    </>
  );
}