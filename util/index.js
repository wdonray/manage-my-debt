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
} from './authenticator';
import { UserContext, UserContextInterface } from './context/user-context';
import { raiseError } from './error-handler';

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
  UserContext,
  UserContextInterface,
  raiseError,
  setUserConfirmation,
  isUserConfirmed,
};