import { ReactNode, useCallback, useState } from 'react';
import { Header } from '@/components';
import { UserContext, UserContextInterface } from '@/util';
import { CognitoUserAmplify } from '@aws-amplify/ui';

export default function Layout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CognitoUserAmplify | null>(null);
  const [isUserConfirmed, setIsUserConfirmed] = useState<boolean | null>(null);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string | null>(null);

  const handleUser = useCallback((value: CognitoUserAmplify | null) => setUser(value), []);
  const handleIsUserConfirmed = useCallback((value: boolean | null) => setIsUserConfirmed(value), []);
  const handleForgotPasswordEmail = useCallback((value: string | null) => setForgotPasswordEmail(value), []);

  const userContextValue: UserContextInterface = {
    user,
    isUserConfirmed,
    forgotPasswordEmail,
    handleUser,
    handleIsUserConfirmed,
    handleForgotPasswordEmail,
  };

  return (
    <UserContext.Provider value={userContextValue}>
      <Header />
      <div className='container'>
        <main>{children}</main>
      </div>
    </UserContext.Provider>
  );
}