import { useState, useCallback, MouseEvent, useEffect, useMemo } from 'react';
import VerificationInput from 'react-verification-input';
import { handleSendSignUpCode, handleConfirmCode, raiseError, handleSignIn } from '@/util';
import { IUser } from '@/types';
interface ConfirmCodeProps {
  styles: { readonly [key: string]: string }
  handleSignInSuccess: (user: IUser) => void
}

export default function ConfirmCode({ styles, handleSignInSuccess }: ConfirmCodeProps) {
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [counter, setCounter] = useState(30);
  const [isLoading, setIsLoading] = useState(false);

  const user = useMemo(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  }, []);

  const handleSendCodeClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setCodeSent(true);
    handleSendSignUpCode(user?.email);
  }, [user]);

  const startTimer = useCallback(() => setInterval(() => {
    setCounter(counter - 1);

    if (counter === 1) {
      setCounter(30);
      setCodeSent(false);
    }
  }, 1000), [counter]);

  const handleCodeCheck = useCallback(async (code: string) => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      await handleConfirmCode(user?.email, code);
      const userSignIn = await handleSignIn(user?.email, user?.password);

      handleSignInSuccess(userSignIn);

      localStorage.removeItem('user');
    } catch (err) {
      raiseError(err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, user?.email, user?.password, handleSignInSuccess]);

  const handleVerificationInput = useCallback(async (value: string) => {
    setCode(value);

    if (value.length !== 6) {
      return;
    }

    await handleCodeCheck(value);
  }, [handleCodeCheck]);

  useEffect(() => {
    let timer: NodeJS.Timer;

    if (codeSent && !isLoading) {
      timer = startTimer();
    }

    return () => clearInterval(timer);
  }, [codeSent, isLoading, startTimer]);

  if (isLoading) {
    return (
      <div className='d-flex py-4'>
        <div className='spinner-border text-info mx-auto' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['confirm-code-wrapper']}>
      <h1>Enter Code</h1>
      <p className={styles['sub-header']}>
        Please enter the code sent to your email
      </p>
      <VerificationInput
        value={code}
        onChange={handleVerificationInput}
      />
      {
        !codeSent ? (
          <a
            className='mt-3'
            href='#'
            onClick={handleSendCodeClick}
          >
            send code
          </a>) : (
          <span className='mt-3'>
            {counter}
          </span>
        )
      }
      <button
        className='btn btn-primary mt-2'
        disabled={code.trim() === '' || code.length != 6}
        onClick={() => handleCodeCheck(code)}
      >
        Submit Code
      </button>
    </div>
  );
}