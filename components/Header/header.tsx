import {
  useMemo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import styles from './header.module.scss';
import { AuthenticationModal, AboutModal } from '@/components';
import { UserContext, fetchDBUser, useBreakPoint, SIZE } from '@/util';
import { Hub, Auth } from 'aws-amplify';
import Image from 'next/image';
import { HeaderContent } from './components';

export const siteTitle = 'Manage My Debt';

export default function Header() {
  const { handleUser } = useContext(UserContext);
  const [authenticated, setAuthenticated] = useState(false);
  const breakPoint = useBreakPoint();

  const imageSize = useMemo(() => {
    const defaultSizes = { width: '300rem', height: '100' };

    if (!breakPoint.width) {
      return defaultSizes;
    }

    if (breakPoint.value === SIZE.XS) {
      return { width: breakPoint.width - 175, height: '50' };
    }

    return defaultSizes;
  }, [breakPoint]);

  const handleAuthenticated = useCallback((value: boolean) => setAuthenticated(value), []);

  useEffect(() => {
    const authCheck = async () => {
      const response = await Auth.currentAuthenticatedUser();

      const user = await fetchDBUser(response.userDataKey);

      if (!response) {
        return;
      }

      setAuthenticated(true);
      handleUser(user);
    };

    authCheck();
  }, [handleUser]);

  useEffect(() => {
    const authCheck = Hub.listen('auth', async ({ payload: { event } }) => {
      switch (event) {
        case 'signIn': {
          setAuthenticated(true);
          break;
        }
      }
    });

    return authCheck;
  }, []);

  return (
    <div>
      <header className={`${styles.header} py-2 px-2 px-md-5`}>
        <Image 
          src='/brand-logo/svg/logo-no-background.svg' 
          alt='brand-logo'
          className={styles.logo}
          width={imageSize.width}
          height={imageSize.height}
        />

        {
          (breakPoint.value === SIZE.SM || breakPoint.value === SIZE.XS) ?  (
            <div>
              <i 
                className='bi bi-list fs-1'
                data-bs-toggle='offcanvas' 
                data-bs-target='#mobile-canvas' 
                aria-controls='mobile-canvas'
              />
              <div 
                className='offcanvas offcanvas-end text-bg-dark' 
                tabIndex={-1} 
                id='mobile-canvas' 
              >
                <div className='offcanvas-header'>
                  <button 
                    type='button' 
                    className='btn-close btn-close-white' 
                    data-bs-dismiss='offcanvas' 
                    aria-label='Close'
                  />
                </div>
                <div className='offcanvas-body'>
                  <HeaderContent 
                    styles={styles} 
                    handleAuthenticated={handleAuthenticated}
                    authenticated={authenticated}
                    mobile
                  />
                </div>
              </div>
            </div>
          ) : (
            <HeaderContent 
              styles={styles} 
              handleAuthenticated={handleAuthenticated}
              authenticated={authenticated}
            />
          )
        }
      </header>
      <AuthenticationModal />
      <AboutModal />
    </div>
  );
}