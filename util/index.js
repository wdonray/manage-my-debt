import {
  handleSignIn,
  handleSignOut,
  handleSignUp,
  handleSocialSignIn,
  handleDBUserCreation,
  setUserConfirmation,
  isUserConfirmed,
  handleSendSignUpCode,
  handleConfirmCode,
  handleForgotPassword,
  handleForgotPasswordSubmit,
  fetchDBUser,
} from './authenticator';

export {
  handleSignIn,
  handleSignOut,
  handleSignUp,
  handleSocialSignIn,
  handleDBUserCreation,
  handleSendSignUpCode,
  handleConfirmCode,
  handleForgotPassword,
  handleForgotPasswordSubmit,
  setUserConfirmation,
  isUserConfirmed,
  fetchDBUser,
};

import { raiseError } from './error-handler';
export { raiseError };

import { UserContext, UserContextInterface, DebtContext, DebtContextInterface, UpdateDebtValue } from './context';
export { UserContext, UserContextInterface, DebtContext, DebtContextInterface, UpdateDebtValue };

import { createDebt, fetchDebt, updateDebt, deleteDebt } from './debt-handler';
export { createDebt, fetchDebt, updateDebt, deleteDebt };

import { difference, removeProperties } from './object-util';
export { difference, removeProperties };

import { TargetActiveElement } from './hooks';
export { TargetActiveElement };

import { SearchEnum } from './search-enum';
export { SearchEnum };