import { createContext } from 'react';
import { IUser } from 'types/user';

export interface UserContextInterface {
  user: IUser | null
  isUserConfirmed: boolean | null
  forgotPasswordEmail: string | null
  handleUser: (value: IUser | null) => void
  handleIsUserConfirmed: (value: boolean | null) => void
  handleForgotPasswordEmail: (value: string | null) => void
}

export const UserContext = createContext<UserContextInterface>({
  user: null,
  isUserConfirmed: null,
  forgotPasswordEmail: null,
  handleUser: () => { return; },
  handleIsUserConfirmed: () => { return; },
  handleForgotPasswordEmail: () => { return; },
});