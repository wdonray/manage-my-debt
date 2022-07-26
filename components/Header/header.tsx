import {
  useMemo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import styles from './header.module.scss';
import { AuthenticationModal } from '@/components';
import { UserContext, handleSignOut, raiseError, fetchDBUser } from '@/util';
import { Hub, Auth } from 'aws-amplify';

export const siteTitle = 'Manage My Debt';

export default function Header() {
  const { handleUser } = useContext(UserContext);
  const [authenticated, setAuthenticated] = useState(false);

  const buttonText = useMemo(() => authenticated ? 'Sign Out' : 'Sign In', [authenticated]);
  const bsData = useMemo(() => authenticated ? null : { toggle: 'modal', target: '#authentication-modal' }, [authenticated]);

  const handleAction = useCallback(async () => {
    if (!authenticated) {
      return;
    }

    try {
      await handleSignOut();

      handleUser(null);
      setAuthenticated(false);
    } catch (error: any) {
      raiseError(error);
    }
  }, [handleUser, authenticated]);

  const handleAddDebt = useCallback(async () => {
    try {
      // const createDebtResponse = await createDebt({
      //   name: 'MOHELA - Student Loan',
      //   type: 'Loan',
      //   balance: 20000,
      //   apr: 12,
      //   payment: 250,
      //   userDebtId: user.id,
      // });

      // console.log(createDebtResponse);
    } catch (err: any) {
      raiseError(err);
    }
  }, []);

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
    <>
      <header className={styles.header}>
        <h2>Manage My Debt</h2>
        <button type='button' className='btn btn-success' onClick={handleAddDebt}>
          Add
        </button>
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