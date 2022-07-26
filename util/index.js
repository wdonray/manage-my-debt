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

import { UserContext, UserContextInterface } from './context';
export { UserContext, UserContextInterface };

import { createDebt, fetchDebt, updateDebt } from './debt-handler';
export { createDebt, fetchDebt, updateDebt };

import { difference, removeProperties } from './object-util';
export { difference, removeProperties };

import { TargetActiveElement } from './hooks';
export { TargetActiveElement };