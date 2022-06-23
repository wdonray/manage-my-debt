// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Debt, User } = initSchema(schema);

export {
  Debt,
  User
};