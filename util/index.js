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

import { UserContext, UserContextInterface, DebtContext, DebtContextInterface, UpdateDebtValue, DebtRef } from './context';
export { UserContext, UserContextInterface, DebtContext, DebtContextInterface, UpdateDebtValue, DebtRef };

import { createDebt, fetchDebt, updateDebt, deleteDebt } from './debt-handler';
export { createDebt, fetchDebt, updateDebt, deleteDebt };

import { difference, removeProperties } from './object-util';
export { difference, removeProperties };

import { useBreakPoint, SIZE } from './hooks';
export { useBreakPoint, SIZE };

import { SearchEnum } from './search-enum';
export { SearchEnum };

import { ConvertAPRToMonthlyPayment, InputValidation, ConvertToCurrency, FormatFields } from './finance-calculations';
export { ConvertAPRToMonthlyPayment, InputValidation, ConvertToCurrency, FormatFields };

import { TrackPageLoaded, TrackEvent } from './ga';
export { TrackPageLoaded, TrackEvent };