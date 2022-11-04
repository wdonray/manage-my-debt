import { Amplify } from 'aws-amplify';
import { Authenticator, View } from '@aws-amplify/ui-react';
import { DebtCards, Layout, NewDebtArea, CalculationArea, Header } from '@/components';
import config from 'aws-exports';
import type { NextPage } from 'next';
import { ToastContainer } from 'react-toastify';
import { useCallback, useEffect, useState } from 'react';
import { DebtContext, DebtContextInterface, UpdateDebtValue, UserContext, UserContextInterface } from '@/util';
import { IDebt, IUser } from '@/types';

Amplify.configure(config);

const Home: NextPage = (props) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isUserConfirmed, setIsUserConfirmed] = useState<boolean | null>(null);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string | null>(null);
  const [debtList, setDebtList] = useState<IDebt[]>([]);
  const [localDebtList, setLocalDebtList] = useState<IDebt[]>([]);
  const [selectedDebt, setSelectedDebt] = useState<IDebt | null>(null);
  const [valueToUpdate, setValueToUpdate] = useState(UpdateDebtValue.name);
  const [loading, setLoading] = useState<boolean | null>(true);

  const handleValueToUpdate = useCallback((value: UpdateDebtValue) => setValueToUpdate(value), []);
  const handleSelectedDebt = useCallback((value: IDebt | null) => setSelectedDebt(value), []);
  const handleUser = useCallback((value: IUser | null) => setUser(value), []);
  const handleIsUserConfirmed = useCallback((value: boolean | null) => setIsUserConfirmed(value), []);
  const handleForgotPasswordEmail = useCallback((value: string | null) => setForgotPasswordEmail(value), []);

  const handleDebtList = useCallback(
    (debt: IDebt) => {
      const updatedList = [...debtList];

      const existingIndex = updatedList.findIndex((item) => item.id === debt.id);

      if (existingIndex != -1) {
        updatedList.splice(existingIndex, 1, debt);
      } else {
        updatedList.push(debt);
      }

      setDebtList(updatedList.filter((item) => !item._deleted));
    },
    [debtList]
  );

  const handleAddLocalDebt = useCallback(
    (debt: IDebt) => {
      const updatedList = [...localDebtList, debt];

      setLocalDebtList(updatedList);
    },
    [localDebtList]
  );

  const handleUpdateLocalDebt = useCallback(
    (debt: IDebt) => {
      const updatedList = localDebtList.map((item) => (item.id === debt.id ? debt : item));

      setLocalDebtList(updatedList);
    },
    [localDebtList]
  );

  const handleDeleteLocalDebt = useCallback(
    (id: string) => {
      setLocalDebtList(localDebtList.filter((item) => item.id != id));
    },
    [localDebtList]
  );

  const userContextValue: UserContextInterface = {
    user,
    isUserConfirmed,
    forgotPasswordEmail,
    handleUser,
    handleIsUserConfirmed,
    handleForgotPasswordEmail,
  };

  const debtContextValue: DebtContextInterface = {
    selectedDebt,
    isUserAuthenticated: user != null,
    userId: user?.id,
    debtList,
    localDebtList,
    valueToUpdate,
    handleValueToUpdate,
    handleAddLocalDebt,
    handleUpdateLocalDebt,
    handleDeleteLocalDebt,
    handleSelectedDebt,
    handleDebtList,
  };

  useEffect(() => {
    if (user !== null && debtList.length === 0) {
      const userDebt = user.debt?.items.filter((item) => !item._deleted) ?? [];

      setDebtList(userDebt);
    }
  }, [user, debtList.length]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 2000);
    }
  }, [loading]);

  return (
    <Authenticator.Provider>
      <UserContext.Provider value={userContextValue}>
        <DebtContext.Provider value={debtContextValue}>
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
                {loading ? (
                  <div className='d-flex justify-content-center align-items-center loading-container'>
                    <div className='loading'>Loading</div>
                  </div>
                ) : (
                  <div className='main-body'>
                    <Header />
                    <div className='container'>
                      <NewDebtArea />
                      <DebtCards />
                      <CalculationArea />
                    </div>
                  </div>
                )}
              </main>
            </Layout>
          </View>
        </DebtContext.Provider>
      </UserContext.Provider>
    </Authenticator.Provider>
  );
};

export default Home;
