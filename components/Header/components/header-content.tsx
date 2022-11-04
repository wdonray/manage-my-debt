import { SIZE, UserContext, handleSignOut, raiseError, useBreakPoint } from '@/util';
import { useCallback, useContext, useMemo } from 'react';

interface HeaderContentProps {
  authenticated: boolean;
  handleAuthenticated: (value: boolean) => void;
  styles: { readonly [key: string]: string };
}

export default function HeaderContent({ authenticated, handleAuthenticated, styles }: HeaderContentProps) {
  const { handleUser } = useContext(UserContext);

  const breakPoint = useBreakPoint();

  const mobile = useMemo(() => {
    return breakPoint.value === SIZE.SM || breakPoint.value === SIZE.XS;
  }, [breakPoint]);

  const headerClass = useMemo(() => {
    return `d-flex align-items-center flex-${mobile ? 'column-reverse' : 'row'} ${mobile ? 'justify-content-center' : 'justify-content-end'}`;
  }, [mobile]);
  const aboutClass = useMemo(() => {
    return `fw-bold text-white text-decoration-none text-${mobile ? 'light' : 'secondary'} me-md-5 ${mobile && 'mt-3'} `;
  }, [mobile]);
  const buttonClass = useMemo(() => {
    return `btn rounded-sm py-1 px-2 ${styles.login}`;
  }, [styles]);

  const buttonText = useMemo(() => {
    return authenticated ? 'Logout' : 'Login';
  }, [authenticated]);

  const bsData = useMemo(() => {
    if (!authenticated) {
      return { toggle: 'modal', target: '#authentication-modal' };
    }

    return null;
  }, [authenticated]);

  const handleAction = useCallback(async () => {
    if (!authenticated) {
      return;
    }

    try {
      await handleSignOut();

      handleUser(null);
      handleAuthenticated(false);
    } catch (error) {
      raiseError(error);
    }
  }, [authenticated, handleUser, handleAuthenticated]);

  if (breakPoint.value === SIZE.SM || breakPoint.value === SIZE.XS) {
    return (
      <div className='text-center'>
        <i
          className='bi bi-list fs-1'
          data-bs-toggle='offcanvas'
          data-bs-target='#mobile-canvas'
          aria-controls='mobile-canvas'
        />
        <div
          className={`offcanvas offcanvas-end ${styles.canvas}`}
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
            <div className={headerClass}>
              <a
                href='#'
                className={aboutClass}
                data-bs-toggle='modal'
                data-bs-target='#about-modal'
              >
                About
              </a>
              <button
                type='button'
                className={buttonClass}
                data-bs-toggle={bsData?.toggle}
                data-bs-target={bsData?.target}
                onClick={handleAction}
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={headerClass}>
      <a
        href='#'
        className={aboutClass}
        data-bs-toggle='modal'
        data-bs-target='#about-modal'
      >
        About
      </a>
      <button
        type='button'
        className={buttonClass}
        data-bs-toggle={bsData?.toggle}
        data-bs-target={bsData?.target}
        onClick={handleAction}
      >
        {buttonText}
      </button>
    </div>
  );
}
