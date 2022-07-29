import {
  useCallback,
  FormEvent,
  ChangeEvent,
  useState,
  useContext,
} from 'react';
import {
  handleForgotPassword,
  raiseError,
  UserContext,
} from '@/util';

interface ForgotPasswordProps {
  styles: { readonly [key: string]: string }
  handleBackToSignIn: () => void
  handleResetPassword: () => void
}

export default function ForgotPassword({ styles, handleBackToSignIn, handleResetPassword }: ForgotPasswordProps) {
  const { handleForgotPasswordEmail } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await handleForgotPassword(email);
      handleForgotPasswordEmail(email);
      handleResetPassword();
    } catch (err) {
      raiseError(err);
    }

    setIsLoading(false);
  }, [email, handleResetPassword, handleForgotPasswordEmail]);

  const handleEmailInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setEmail(value);
  }, []);

  return (
    <div className={styles['sign-in-wrapper']}>
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles['input-wrapper']}>
          <input
            className='form-control'
            placeholder='Email address'
            type='email'
            name='email'
            value={email}
            onChange={handleEmailInput}
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
          onClick={handleBackToSignIn}
        >
          Back
        </a>
      </p>
    </div >
  );
}