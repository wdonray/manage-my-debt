import { useMemo, useCallback } from 'react';
import Head from 'next/head';
import styles from './header.module.scss';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { AuthenticationModal } from '@/components';

export const siteTitle = 'Manage My Debt';

export default function Header() {
  const { route, signOut } = useAuthenticator((context) => [context.user]);

  const authenticated = useMemo(() => route === 'authenticated', [route]);
  const buttonText = useMemo(() => authenticated ? 'Sign Out' : 'Sign In', [authenticated]);
  const bsData = useMemo(() => authenticated ? null : { toggle: 'modal', target: '#authentication-modal' }, [authenticated]);

  const handleAction = useCallback(() => authenticated ? signOut() : null, [authenticated, signOut]);

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
      <header className={styles.header}>
        <h2>{siteTitle}</h2>
        <button
          type='button'
          className='btn btn-info'
          data-bs-toggle={bsData?.toggle}
          data-bs-target={bsData?.target}
          onClick={handleAction}
        >
          {buttonText}
        </button>
      </header>
      <AuthenticationModal />
    </>
  );
}