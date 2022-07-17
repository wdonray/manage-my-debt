import { useEffect, useCallback, MouseEvent, useContext } from 'react';
import { Hub } from 'aws-amplify';
import { handleDBUserCreation, handleSocialSignIn, raiseError, UserContext } from '@/util';

interface SocialSignInProps {
  callback: any
  styles: { readonly [key: string]: string }
}

export default function SocialSignIn({ callback, styles }: SocialSignInProps) {
  const { user } = useContext(UserContext);

  const handleSocialSubmit = useCallback(async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const { innerText } = event.target as HTMLElement;
    const type = innerText as 'Facebook' | 'Google';

    try {
      await handleSocialSignIn(type);
    } catch (error: any) {
      raiseError(error);
    }
  }, []);

  useEffect(() => {
    const socialSignIn = Hub.listen('auth', async ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn': {
          let dbUser = await handleDBUserCreation(data);

          console.log(user);

          if (!user) {
            callback(dbUser);
          }

          break;
        }
      }
    });

    return socialSignIn;
  }, [callback, user]);

  return (
    <div className={styles['social-wrapper']}>
      <button
        className={`btn btn-outline-primary ${styles['icon-wrapper']}`}
        onClick={handleSocialSubmit}
      >
        <span className='bi bi-facebook' />
        Facebook
      </button>

      <button
        className={`btn btn-outline-danger ${styles['icon-wrapper']}`}
        onClick={handleSocialSubmit}
      >
        <span className='bi bi-google' />
        Google
      </button>
    </div>
  );
}