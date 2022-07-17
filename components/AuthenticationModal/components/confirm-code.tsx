import { useState, useCallback, MouseEvent, useEffect, useMemo } from 'react';
import VerificationInput from 'react-verification-input';
import { handleSendSignUpCode, handleConfirmCode, raiseError, handleSignIn } from '@/util';
interface ConfirmCodeProps {
  styles: { readonly [key: string]: string }
  handleSignInSuccess: (user: any) => void
}

export default function ConfirmCode({ styles, handleSignInSuccess }: ConfirmCodeProps) {
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [counter, setCounter] = useState(30);

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
    try {
      await handleConfirmCode(user?.email, code);
      const userSignIn = await handleSignIn(user?.email, user?.password);

      handleSignInSuccess(userSignIn);

      localStorage.removeItem('user');
    } catch (err: any) {
      raiseError(err);
    }
  }, [user, handleSignInSuccess]);

  const handleVerificationInput = useCallback(async (value: string) => {
    setCode(value);

    if (value.length !== 6) {
      return;
    }

    await handleCodeCheck(value);
  }, [handleCodeCheck]);

  useEffect(() => {
    let timer: any = null;

    if (codeSent) {
      timer = startTimer();
    }

    return () => clearInterval(timer);
  }, [codeSent, startTimer]);

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
    </div>
  );
}