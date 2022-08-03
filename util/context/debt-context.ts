import { createContext } from 'react';
import { IDebt } from 'types/debt';

export enum UpdateDebtValue {
  name = 'name',
  type = 'type',
}

export interface DebtContextInterface {
  selectedDebt: IDebt | null,
  isUserAuthenticated: boolean,
  userId: string | undefined,
  debtList: IDebt[] | undefined,
  localDebtList: IDebt[] | undefined,
  valueToUpdate: UpdateDebtValue,
  handleValueToUpdate: (value: UpdateDebtValue) => void,
  handleAddLocalDebt: (debt: IDebt) => void,
  handleUpdateLocalDebt: (debt: IDebt) => void,
  handleDeleteLocalDebt: (id: string) => void,
  handleSelectedDebt: (debt: IDebt | null) => void,
  handleDebtList: (debt: IDebt) => void,
}

export const DebtContext = createContext<DebtContextInterface>({
  selectedDebt: null,
  isUserAuthenticated: false,
  userId: undefined,
  debtList: undefined,
  localDebtList: undefined,
  valueToUpdate: UpdateDebtValue.name,
  handleValueToUpdate: (value: UpdateDebtValue) => { return value; },
  handleAddLocalDebt: (debt: IDebt) => { return debt; },
  handleUpdateLocalDebt: (debt: IDebt) => { return debt; },
  handleDeleteLocalDebt: (id: string) => { return id; },
  handleSelectedDebt: (debt: IDebt | null) => { return debt; },
  handleDebtList: (debt: IDebt) => { return debt; },
});