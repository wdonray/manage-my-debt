import {
  useCallback,
  FormEvent,
  ChangeEvent,
  useState,
  useContext,
  useMemo,
} from 'react';
import {
  UserContext,
  handleSignUp,
  raiseError,
} from '@/util';
import SocialSignIn from './social-sign-in';
import { isEmpty } from 'lodash';
import { IUser } from '@/types';

interface AuthField {
  email: string
  name: string
  password: string,
  confirmPassword: string
}

interface CreateAccountProps {
  styles: { readonly [key: string]: string }
  handleSignIn: () => void
  signUpCallBack: () => void
}

export default function CreateAccount({ styles, handleSignIn, signUpCallBack }: CreateAccountProps) {
  const { handleIsUserConfirmed } = useContext(UserContext);

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authFields, setAuthFields] = useState<AuthField>({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });

  const passwordClassNames = useMemo(() => `form-control ${!isEmpty(errorMessage) && 'border-danger'}`, [errorMessage]);

  const handleSignUpSuccess = useCallback((user: IUser) => {
    if (!user) {
      return;
    }

    handleIsUserConfirmed(false);
    localStorage.setItem('user', JSON.stringify({ email: authFields.email, password: authFields.password }));
    signUpCallBack();
  }, [handleIsUserConfirmed, authFields.email, authFields.password, signUpCallBack]);

  const handleValidation = useCallback(() => {
    if (authFields.password === authFields.confirmPassword) {
      setErrorMessage('');
      return true;
    }

    setErrorMessage('Passwords must match!');
    return false;
  }, [authFields]);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!handleValidation()) {
      return;
    }

    setIsLoading(true);
    const { email, name, password } = authFields;

    try {
      const user = await handleSignUp(email, name, password);

      handleSignUpSuccess(user);
    } catch (err) {
      raiseError(err);
    }

    setIsLoading(false);
  }, [authFields, handleSignUpSuccess, handleValidation]);

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setErrorMessage('');
    setAuthFields({ ...authFields, [name]: value });
  }, [authFields]);

  return (
    <div className={styles['sign-in-wrapper']}>
      <h1>Create Account</h1>
      <p className={styles['sub-header']}>
        Already have an account?
        <a
          href='#'
          onClick={handleSignIn}
        >
          Sign in
        </a>
      </p>
      <p className='text-danger'>{errorMessage}</p>
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
            placeholder='Name'
            type='text'
            name='name'
            value={authFields.name}
            onChange={handleInput}
            required
            disabled={isLoading}
          />
        </div>
        <div className={styles['input-wrapper']}>
          <input
            className={passwordClassNames}
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
          <input
            className={passwordClassNames}
            placeholder='Confirm password'
            type='password'
            name='confirmPassword'
            value={authFields.confirmPassword}
            onChange={handleInput}
            required
            disabled={isLoading}
          />
        </div>
        <div className={styles['input-wrapper']}>
          <button
            type='submit'
            className='btn btn-primary w-100'
            disabled={isLoading}
          >
            {isLoading ? (
              <div className='spinner-border text-info' role='status'>
                <span className='visually-hidden'>Loading...</span>
              </div>
            ) : 'Create Account'}
          </button>
        </div>
      </form>
      <div className={styles['social-split-wrapper']}>
        <hr />
        <span>or continue with</span>
        <hr />
      </div>
      <SocialSignIn
        callback={handleSignUpSuccess}
        styles={styles}
      />
    </div >
  );
}