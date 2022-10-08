import { useContext, useMemo, useCallback } from 'react';
import { handleSignOut, UserContext, raiseError } from '@/util';

interface HeaderContentProps {
  styles: { readonly [key: string]: string },
  handleAuthenticated:(value: boolean) => void,
  authenticated: boolean,
  mobile?: boolean,
}

export default function HeaderContent({ 
  styles,
  handleAuthenticated,
  authenticated,
  mobile,
}: HeaderContentProps) {
  const { handleUser } = useContext(UserContext);

  const buttonText = useMemo(() => authenticated ? 'Sign Out' : 'Sign In', [authenticated]);
  const bsData = useMemo(() => authenticated ? null : { toggle: 'modal', target: '#authentication-modal' }, [authenticated]);

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

  return (
    <div className={`d-flex align-items-center flex-${mobile ? 'column-reverse' : 'row'} ${mobile && 'justify-content-center'}`}>
      <a
        href='#'
        className={`fw-bold text-decoration-none text-${mobile ? 'light': 'secondary'} me-md-5 ${mobile && 'mt-3'} `}
        data-bs-toggle='modal'
        data-bs-target='#about-modal'
      >
        About
      </a>
      <button
        type='button'
        className={`btn py-2 px-3 ${styles['sign-in']}`}
        data-bs-toggle={bsData?.toggle}
        data-bs-target={bsData?.target}
        onClick={handleAction}
      >
        {buttonText}
      </button>
    </div>
  );
}