import { AuthenticationModal, AboutModal } from '@/components';
import { HeaderContent } from './components';
import { Hub, Auth } from 'aws-amplify';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { UserContext, fetchDBUser, useBreakPoint, SIZE } from '@/util';
import Image from 'next/image';
import styles from './header.module.scss';

export const siteTitle = 'Manage My Debt';

export default function Header() {
  const { handleUser } = useContext(UserContext);
  const breakPoint = useBreakPoint();

  const [authenticated, setAuthenticated] = useState(false);

  const handleAuthenticated = useCallback((value: boolean) => setAuthenticated(value), []);

  const imageSize = useMemo(() => {
    const defaultSizes = { width: '30', height: '30' };

    if (!breakPoint.width) {
      return defaultSizes;
    }

    if (breakPoint.value === SIZE.XS) {
      return { width: '30', height: '30' };
    }

    return defaultSizes;
  }, [breakPoint]);
  const startedClass = useMemo(() => `btn rounded-sm py-1 px-2 ${styles.started}`, []);

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
      <header className={`${styles.header} m-0 py-3 px-2 px-md-5`}>
        <div className={`row ${styles.body}`}>
          <div className='col-10 col-md-6 px-3'>
            <div className={`${styles.logo} d-flex flex-row align-items-end`}>
              <Image
                src='/avalanche-logo.png'
                layout='fixed'
                alt='brand-logo'
                width={imageSize.width}
                height={imageSize.height}
              />
              <h4>
                Manage<mark className={styles.mark}>My</mark>Debt
              </h4>
            </div>
          </div>

          <div className='col-2 col-md-6'>
            <HeaderContent
              styles={styles}
              handleAuthenticated={handleAuthenticated}
              authenticated={authenticated}
            />
          </div>

          <div className='col-12'>
            <div className={`row px-2 py-4 p-md-4 p-lg-5 ${styles['text-body']}`}>
              <div className='col-12'>
                <h1 className='display-1'>Everything you need</h1>
                <h1 className='display-1'>in one place</h1>
              </div>

              <div className='col-12 col-md-6'>
                <span>An avalanche debt repayment calculator for those ready to create a plan to get rid of their debt.</span>
              </div>

              {!authenticated && (
                <div className='col-12 pt-4'>
                  <button
                    type='button'
                    className={startedClass}
                    data-bs-toggle='modal'
                    data-bs-target='#authentication-modal'
                  >
                    Get Started <i className='bi bi-arrow-right'></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <AuthenticationModal />
      <AboutModal />
    </div>
  );
}
