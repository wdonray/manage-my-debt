import { mutation, query } from '@/graphql';
import { API, Auth } from 'aws-amplify';
import { CognitoUserAmplify } from '@aws-amplify/ui';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';

async function fetchDBUser(userDataKey: string, authMode?: 'AWS_IAM') {
  const getUserResponse = (await API.graphql({
    query: query.getUser,
    variables: { id: userDataKey },
    authMode,
  })) as any;

  return getUserResponse.data.getUser as CognitoUserAmplify;
}

async function createDBUser(createUserInput: { id: string, name: string }, authMode?: 'AWS_IAM') {
  const { id, name } = createUserInput;

  const createUserResponse = await API.graphql({
    query: mutation.createUser,
    variables: { input: { id, name } },
    authMode,
  }) as any;

  return createUserResponse.data.createUser as CognitoUserAmplify;
}

export async function handleDBUserCreation(signInResponse: any) {
  let dbUser = await fetchDBUser(signInResponse.userDataKey);

  if (!dbUser) {
    const currentSignedInUser = await Auth.currentAuthenticatedUser();

    const createUserInput = { id: currentSignedInUser.userDataKey, name: currentSignedInUser.username };

    dbUser = await createDBUser(createUserInput);
  }

  return dbUser;
}

export async function handleSignIn(email: string, password: string) {
  const signInResponse: any = await Auth.signIn(email, password);

  return handleDBUserCreation(signInResponse);
}

export async function handleSocialSignIn(type: 'Facebook' | 'Google') {
  await Auth.federatedSignIn({
    provider: CognitoHostedUIIdentityProvider[type],
  });
}

export async function handleSignUp(email: string, name: string, password: string) {
  const { user }: any = await Auth.signUp({
    username: email,
    password,
    attributes: { name },
  });


  let dbUser = await fetchDBUser(user.userDataKey, 'AWS_IAM');

  if (!dbUser) {
    const createUserInput = { id: user.userDataKey, name: user.username };

    dbUser = await createDBUser(createUserInput, 'AWS_IAM');
  }

  return dbUser;
}

export async function handleSendSignUpCode(email: string) {
  await Auth.resendSignUp(email);
}

export async function handleConfirmCode(email: string, code: string) {
  await Auth.confirmSignUp(email, code);
}

export async function handleForgotPassword(email: string) {
  await Auth.forgotPassword(email);
}

export async function handleForgotPasswordSubmit(email: string, code: string, password: string) {
  await Auth.forgotPasswordSubmit(email, code, password);
}

export async function handleChangePassword(email: string, oldPassword: string, newPassword: string) {
  await Auth.changePassword(email, oldPassword, newPassword);
}

export async function handleSignOut() {
  await Auth.signOut();
}