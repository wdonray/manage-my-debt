export interface IDebt {
  id: string;
  name: string;
  type: string;
  balance: number;
  apr: number;
  owner?: string;
  payment: number;
  userDebtId: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  _deleted?: boolean;
  _lastChangedAt?: number;
  _version?: number;
}

export interface ICreateDebtInput {
  id?: string;
  name: string;
  type: string;
  balance: number;
  apr: number;
  payment: number;
  userDebtId: string;
}

export interface IUpdateDebtInput {
  id: string;
  name?: string;
  type?: string;
  balance?: number;
  apr?: number;
  payment?: number;
  userDebtId: string;
}

export interface IDeleteDebtInput {
  id: string;
  _version: number;
}