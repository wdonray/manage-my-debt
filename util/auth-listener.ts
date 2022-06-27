import { CognitoUserAmplify } from '@aws-amplify/ui';
import { Hub } from 'aws-amplify';
import { invoke } from 'lodash';
import { mutation, query } from '@/graphql';
import { API, Auth } from 'aws-amplify';
import { HubCallback } from '@aws-amplify/core';

let lastInvoked = '';
let listener: HubCallback | null = null;

const callbacks = {
  'signIn': onSignIn,
  'signUp': onSignUp,
  'signOut': onSignOut,
  'configured': onConfigured,
  'userLoaded': onUserLoaded,
};


export function onAuthEvents(user: CognitoUserAmplify) {
  if (user != null && lastInvoked != 'signIn') {
    invoke(callbacks, 'userLoaded');
    lastInvoked = 'userLoaded';
  }

  listener = (data: any) => InvokeCallbacks(data);

  Hub.listen('auth', listener);
}

export function onCleanUp() {
  if (listener == null) {
    return;
  }

  Hub.remove('auth', listener);
}

function InvokeCallbacks(data: any) {
  const { payload } = data;

  if (lastInvoked != payload.event) {
    invoke(callbacks, payload.event, payload.data);
    lastInvoked = payload.event;
  }
}

function onUserLoaded() {
  console.log('User Loaded');
}

async function onSignIn(data: any) {
  console.log({ SignIn: data });

  const response = (await API.graphql({
    query: query.getUser,
    variables: { id: data.userDataKey },
  })) as any;

  const user = response.data.getUser;

  if (!user) {
    const currentSignedInUser = await Auth.currentAuthenticatedUser();

    const createUserInput = { id: currentSignedInUser.userDataKey, name: currentSignedInUser.username };

    await API.graphql({
      query: mutation.createUser,
      variables: { input: createUserInput },
    });
  }
}

async function onSignUp(data: any) {
  console.log({ SignUp: data });
  const { user } = data;
  const createUserInput = { id: user.userDataKey, name: user.username };

  await API.graphql({
    query: mutation.createUser,
    variables: { input: createUserInput },
    authMode: 'AWS_IAM',
  });
}

function onSignOut(data: any) {
  console.log({ SignOut: data });
}

function onConfigured(data: any) {
  console.log({ Configured: data });
}