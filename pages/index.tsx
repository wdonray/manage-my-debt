import { Amplify } from 'aws-amplify';
import { Authenticator, View } from '@aws-amplify/ui-react';
import { Layout } from '@/components';
import config from 'aws-exports';
import type { NextPage } from 'next';

Amplify.configure(config);

const Home: NextPage = () => {
  return ( 
    <Authenticator.Provider>
      <View>
        <Layout>
          <main> Debt Repayment </main>
        </Layout>
      </View>
    </Authenticator.Provider>
  );
};

export default Home;
