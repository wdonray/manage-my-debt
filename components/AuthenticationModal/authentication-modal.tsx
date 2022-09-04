import styles from './authentication-modal.module.scss';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SignIn, CreateAccount, ConfirmCode, ForgotPassword, ResetPassword } from './components';
import { UserContext } from '@/util';
import { toast } from 'react-toastify';
import { IUser } from 'types/user';

enum AuthenticationState {
  Loading,
  SignIn,
  CreateAccount,
  ConfirmCode,
  ForgotPassword,
  ResetPassword,
}

export default function AuthenticationModal() {
  const [state, setState] = useState<AuthenticationState>(AuthenticationState.SignIn);
  const { isUserConfirmed, handleIsUserConfirmed, handleUser } = useContext(UserContext);

  const handleStateChange = useCallback((state: AuthenticationState) => setState(state), []);
  const isAuthenticationState = useCallback((stateToCompare: AuthenticationState) => state === stateToCompare, [state]);

  const handleHideModal = useCallback(() => {
    const closeButton = document.getElementById('close-authentication-modal');

    closeButton?.click();
  }, []);

  const bsModalData = useMemo(() => {
    if (isUserConfirmed) {
      return null;
    }

    return { backdrop: 'static', keyboard: 'false' };
  }, [isUserConfirmed]);

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

  const handleSignInSuccess = useCallback((user: IUser) => {
    if (!user) {
      return;
    }

    handleUser(user);
    handleHideModal();
    toast.success('Welcome back!');
  }, [handleHideModal, handleUser]);

  const authenticationComponent = useMemo(() => {
    if (isAuthenticationState(AuthenticationState.Loading)) {
      return (
        <div className='d-flex justify-content-center'>
          <div className='spinner-border text-info m-5 p-3' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
        </div>
      );
    }
    else if (isAuthenticationState(AuthenticationState.ConfirmCode)) {
      return (
        <ConfirmCode
          styles={styles}
          handleSignInSuccess={handleSignInSuccess}
        />
      );
    }
    else if (isAuthenticationState(AuthenticationState.SignIn)) {
      return (
        <SignIn
          styles={styles}
          handleCreateAccount={() => handleStateChange(AuthenticationState.CreateAccount)}
          handleForgotPassword={() => handleStateChange(AuthenticationState.ForgotPassword)}
          handleSignInSuccess={handleSignInSuccess}
        />
      );
    }
    else if (isAuthenticationState(AuthenticationState.ForgotPassword)) {
      return (
        <ForgotPassword
          styles={styles}
          handleBackToSignIn={() => handleStateChange(AuthenticationState.SignIn)}
          handleResetPassword={() => handleStateChange(AuthenticationState.ResetPassword)}
        />
      );
    }
    else if (isAuthenticationState(AuthenticationState.ResetPassword)) {
      return (
        <ResetPassword
          styles={styles}
          handleBackToSignIn={() => handleStateChange(AuthenticationState.SignIn)}
          handleBackToForgotPassword={() => handleStateChange(AuthenticationState.ForgotPassword)}
        />
      );
    }

    return (
      <CreateAccount
        styles={styles}
        handleSignIn={() => handleStateChange(AuthenticationState.SignIn)}
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
      className={`modal ${styles['modal-wrapper']}`}
      data-bs-backdrop={bsModalData?.backdrop}
      data-bs-keyboard={bsModalData?.keyboard}
    >
      <div className='modal-dialog modal-dialog-centered'>
        <div className={`modal-content ${styles['modal-content-wrapper']}`}>
          <div className='modal-header'>
            <button
              id='close-authentication-modal'
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
            />
          </div>
          <div className='modal-body'>
            {authenticationComponent}
          </div>
        </div>
      </div>
    </div >
  );
}
