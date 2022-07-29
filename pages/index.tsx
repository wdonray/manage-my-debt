import { Amplify } from 'aws-amplify';
import { Authenticator, View } from '@aws-amplify/ui-react';
import { DebtCards, Layout, NewDebtArea } from '@/components';
import config from 'aws-exports';
import type { NextPage } from 'next';
import { ToastContainer } from 'react-toastify';
import { useCallback, useMemo, useState } from 'react';
import { UserContext, UserContextInterface } from 'util/context';
import { ICreateDebtInput } from '@/types';
import { CognitoUserAmplify } from '@aws-amplify/ui';

Amplify.configure(config);

const Home: NextPage = (props) => {
  const [user, setUser] = useState<any>(null);
  const [isUserConfirmed, setIsUserConfirmed] = useState<boolean | null>(null);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string | null>(null);

  const handleUser = useCallback((value: CognitoUserAmplify | null) => setUser(value), []);
  const handleIsUserConfirmed = useCallback((value: boolean | null) => setIsUserConfirmed(value), []);
  const handleForgotPasswordEmail = useCallback((value: string | null) => setForgotPasswordEmail(value), []);

  const [localDebtList, setLocalDebtList] = useState<ICreateDebtInput[]>([]);

  const userContextValue: UserContextInterface = {
    user,
    isUserConfirmed,
    forgotPasswordEmail,
    handleUser,
    handleIsUserConfirmed,
    handleForgotPasswordEmail,
  };

  const debtList = useMemo(() => user?.debt.items ?? localDebtList, [user, localDebtList]);

  const handleAddLocalDebt = useCallback((createDebtInput: ICreateDebtInput) => {
    const updatedList = [...localDebtList, createDebtInput];

    setLocalDebtList(updatedList);
  }, [localDebtList]);

  console.log(user);

  return ( 
    <Authenticator.Provider>
      <UserContext.Provider value={userContextValue}>
        <ToastContainer
          position='top-center'
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          draggable
          pauseOnHover
        />
        <View {...props}>
          <Layout>
            <main>
              <div>
                <NewDebtArea
                  handleAddLocalDebt={handleAddLocalDebt}
                  isUserAuthenticated={user != null}
                  userId={user?.id}
                />
                <DebtCards debtList={debtList} />
              </div>
            </main>
          </Layout>
        </View>
      </UserContext.Provider>
    </Authenticator.Provider>
  );
};

export default Home;
