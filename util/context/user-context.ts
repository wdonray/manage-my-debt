import { CognitoUserAmplify } from '@aws-amplify/ui';
import { createContext } from 'react';

export interface UserContextInterface {
  user: CognitoUserAmplify | null
  isUserConfirmed: boolean | null
  forgotPasswordEmail: string | null
  handleUser: (value: CognitoUserAmplify | null) => void
  handleIsUserConfirmed: (value: boolean | null) => void
  handleForgotPasswordEmail: (value: string | null) => void
}

export const UserContext = createContext<UserContextInterface>({
  user: null,
  isUserConfirmed: null,
  forgotPasswordEmail: null,
  handleUser: () => { },
  handleIsUserConfirmed: () => { },
  handleForgotPasswordEmail: () => { },
});