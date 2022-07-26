import { Amplify } from 'aws-amplify';
import { Authenticator, View } from '@aws-amplify/ui-react';
import { DebtCards, Layout } from '@/components';
import config from 'aws-exports';
import type { NextPage } from 'next';
import { ToastContainer } from 'react-toastify';

Amplify.configure(config);

const Home: NextPage = (props) => {
  return ( 
    <Authenticator.Provider>
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
            <DebtCards />
          </main>
        </Layout>
      </View>
    </Authenticator.Provider>
  );
};

export default Home;
