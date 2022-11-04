import { ConfirmCode, CreateAccount, ForgotPassword, ResetPassword, SignIn } from './components';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { IUser } from 'types/user';
import { UserContext } from '@/util';
import styles from './authentication-modal.module.scss';

enum AuthenticationState {
  ConfirmCode,
  CreateAccount,
  ForgotPassword,
  Loading,
  ResetPassword,
  SignIn,
}

export default function AuthenticationModal() {
  const [state, setState] = useState<AuthenticationState>(AuthenticationState.SignIn);
  const { handleIsUserConfirmed, handleUser } = useContext(UserContext);

  const handleStateChange = useCallback((state: AuthenticationState) => {
    return setState(state);
  }, []);
  const isAuthenticationState = useCallback(
    (stateToCompare: AuthenticationState) => {
      return state === stateToCompare;
    },
    [state]
  );

  const handleHideModal = useCallback(() => {
    const closeButton = document.getElementById('close-authentication-modal');

    closeButton?.click();
  }, []);

  const bsModalData = useMemo(() => {
    if (!isAuthenticationState(AuthenticationState.ConfirmCode)) {
      return null;
    }

    return { backdrop: 'static', keyboard: 'false' };
  }, [isAuthenticationState]);

  const checkLocalUser = useCallback(() => {
    handleStateChange(AuthenticationState.Loading);
    const user = localStorage.getItem('user');

    if (!user) {
      handleStateChange(AuthenticationState.SignIn);
      return;
    }

    const parsedUser = JSON.parse(user);

    if (parsedUser) {
      handleIsUserConfirmed(false);
      handleStateChange(AuthenticationState.ConfirmCode);
      return;
    }

    handleStateChange(AuthenticationState.SignIn);
  }, [handleIsUserConfirmed, handleStateChange]);

  const handleSignInSuccess = useCallback(
    (user: IUser) => {
      if (!user) {
        return;
      }

      handleUser(user);
      handleHideModal();
    },
    [handleHideModal, handleUser]
  );

  const authenticationComponent = useMemo(() => {
    if (isAuthenticationState(AuthenticationState.Loading)) {
      return (
        <div className='d-flex justify-content-center'>
          <div
            className='spinner-border text-info m-5 p-3'
            role='status'
          >
            <span className='visually-hidden'>Loading...</span>
          </div>
        </div>
      );
    } else if (isAuthenticationState(AuthenticationState.ConfirmCode)) {
      return (
        <ConfirmCode
          styles={styles}
          handleSignInSuccess={handleSignInSuccess}
        />
      );
    } else if (isAuthenticationState(AuthenticationState.SignIn)) {
      return (
        <SignIn
          styles={styles}
          handleCreateAccount={() => {
            return handleStateChange(AuthenticationState.CreateAccount);
          }}
          handleForgotPassword={() => {
            return handleStateChange(AuthenticationState.ForgotPassword);
          }}
          handleSignInSuccess={handleSignInSuccess}
        />
      );
    } else if (isAuthenticationState(AuthenticationState.ForgotPassword)) {
      return (
        <ForgotPassword
          styles={styles}
          handleBackToSignIn={() => {
            return handleStateChange(AuthenticationState.SignIn);
          }}
          handleResetPassword={() => {
            return handleStateChange(AuthenticationState.ResetPassword);
          }}
        />
      );
    } else if (isAuthenticationState(AuthenticationState.ResetPassword)) {
      return (
        <ResetPassword
          styles={styles}
          handleBackToSignIn={() => {
            return handleStateChange(AuthenticationState.SignIn);
          }}
          handleBackToForgotPassword={() => {
            return handleStateChange(AuthenticationState.ForgotPassword);
          }}
        />
      );
    }

    return (
      <CreateAccount
        styles={styles}
        handleSignIn={() => {
          return handleStateChange(AuthenticationState.SignIn);
        }}
        signUpCallBack={checkLocalUser}
      />
    );
  }, [isAuthenticationState, checkLocalUser, handleSignInSuccess, handleStateChange]);

  useEffect(() => {
    checkLocalUser();
  }, [checkLocalUser]);

  return (
    <div
      id='authentication-modal'
      className={`modal fade ${styles['modal-wrapper']}`}
      data-bs-backdrop={bsModalData?.backdrop}
      data-bs-keyboard={bsModalData?.keyboard}
    >
      <div className='modal-dialog modal-dialog-centered'>
        <div className={`modal-content ${styles['modal-content-wrapper']}`}>
          <div className='modal-header border-0'>
            <i
              id='close-authentication-modal'
              data-bs-dismiss='modal'
              className={`bi bi-x ${styles.close}`}
              aria-label='Close'
            ></i>
          </div>
          <div className='modal-body'>{authenticationComponent}</div>
        </div>
      </div>
    </div>
  );
}
