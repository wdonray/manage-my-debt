import {
  useCallback,
  FormEvent,
  ChangeEvent,
  useState,
  useContext,
  useMemo,
} from 'react';
import {
  handleForgotPasswordSubmit,
  raiseError,
  UserContext,
} from '@/util';
import { isEmpty } from 'lodash';

interface AuthField {
  code: string
  password: string
  confirmPassword: string
}

interface ResetPasswordProps {
  styles: { readonly [key: string]: string }
  handleBackToSignIn: () => void
  handleBackToForgotPassword: () => void
}

export default function ForgotPassword({ styles, handleBackToSignIn, handleBackToForgotPassword }: ResetPasswordProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [authFields, setAuthFields] = useState<AuthField>({ code: '', password: '', confirmPassword: '' });
  const { forgotPasswordEmail } = useContext(UserContext);

  const passwordClassNames = useMemo(() => `form-control ${!isEmpty(errorMessage) && 'border-danger'}`, [errorMessage]);

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

    if (!forgotPasswordEmail || !handleValidation()) {
      return;
    }

    const { code, confirmPassword } = authFields;

    setIsLoading(true);

    try {
      await handleForgotPasswordSubmit(forgotPasswordEmail, code, confirmPassword);
      handleBackToSignIn();
    } catch (error: any) {
      raiseError(error);
    }

    setIsLoading(false);
  }, [authFields, forgotPasswordEmail, handleBackToSignIn, handleValidation]);

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setErrorMessage('');
    setAuthFields({ ...authFields, [name]: value });
  }, [authFields]);

  return (
    <div className={styles['sign-in-wrapper']}>
      <h1>Reset Password</h1>
      <p className='text-danger'>{errorMessage}</p>
      <form onSubmit={handleSubmit}>
        <div className={styles['input-wrapper']}>
          <input
            className='form-control'
            placeholder='Code'
            type='number'
            name='code'
            value={authFields.code}
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
            ) : 'Reset Password'}
          </button>
        </div>
      </form>
      <p className={styles['sub-header']}>
        <a
          href='#'
          onClick={handleBackToForgotPassword}
        >
          Back
        </a>
      </p>
    </div >
  );
}