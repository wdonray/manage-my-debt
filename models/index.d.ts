import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type DebtMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Debt {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly balance: number;
  readonly apr: number;
  readonly payment: number;
  readonly user: User;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Debt, DebtMetaData>);
  static copyOf(source: Debt, mutator: (draft: MutableModel<Debt, DebtMetaData>) => MutableModel<Debt, DebtMetaData> | void): Debt;
}

export declare class User {
  readonly id: string;
  readonly name: string;
  readonly debt?: (Debt | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}