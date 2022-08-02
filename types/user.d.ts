import { IDebt } from '@/types';

interface UserDebtItems {
  items: IDebt[];
  nextToken: string | number;
  startedAt: string | number;
}

export interface IUser {
  id: string;
  name: string;
  debt?: UserDebtItems;
  createdAt?: string | null;
  updatedAt?: string | null;
}