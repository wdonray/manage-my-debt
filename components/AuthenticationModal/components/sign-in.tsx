import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { handleSignIn, raiseError } from '@/util';

import { IUser } from 'types/user';
import SocialSignIn from './social-sign-in';

interface AuthField {
  email: string;
  password: string;
}

interface SignInProps {
  styles: { readonly [key: string]: string };
  handleCreateAccount: () => void;
  handleForgotPassword: () => void;
  handleSignInSuccess: (user: IUser) => void;
}

export default function SignIn({ styles, handleCreateAccount, handleForgotPassword, handleSignInSuccess }: SignInProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [authFields, setAuthFields] = useState<AuthField>({ email: '', password: '' });

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLoading(true);
      const { email, password } = authFields;

      try {
        const user = await handleSignIn(email, password);

        handleSignInSuccess(user);
      } catch (err) {
        raiseError(err);
      }

      setIsLoading(false);
    },
    [authFields, handleSignInSuccess]
  );

  const handleInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;

      setAuthFields({ ...authFields, [name]: value });
    },
    [authFields]
  );

  return (
    <div className={styles['sign-in-wrapper']}>
      <h1>Sign in</h1>
      <p className={styles['sub-header']}>
        Do not have an account?
        <a
          href='#'
          onClick={handleCreateAccount}
        >
          Create account
        </a>
      </p>
      <form onSubmit={handleSubmit}>
        <div className={styles['input-wrapper']}>
          <input
            className='form-control'
            placeholder='Email address'
            type='email'
            name='email'
            value={authFields.email}
            onChange={handleInput}
            required
            disabled={isLoading}
          />
        </div>
        <div className={styles['input-wrapper']}>
          <input
            className='form-control'
            placeholder='Password'
            type='password'
            name='password'
            value={authFields.password}
            onChange={handleInput}
            required
            disabled={isLoading}
          />
        </div>
        <div className={styles['input-wrapper']}>
          <a
            className='float-end'
            href='#'
            onClick={handleForgotPassword}
          >
            Forgot Password
          </a>
        </div>
        <div className={styles['input-wrapper']}>
          <button
            type='submit'
            className='btn btn-primary w-100'
            disabled={isLoading}
          >
            {isLoading ? (
              <div
                className='spinner-border text-info'
                role='status'
              >
                <span className='visually-hidden'>Loading...</span>
              </div>
            ) : (
              'Log in'
            )}
          </button>
        </div>
      </form>
      {!isLoading && (
        <div>
          <div className={styles['social-split-wrapper']}>
            <hr />
            <span>or continue with</span>
            <hr />
          </div>
          <SocialSignIn
            callback={handleSignInSuccess}
            styles={styles}
          />
        </div>
      )}
    </div>
  );
}
