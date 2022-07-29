import { IDebt } from '@/types';

interface UserDebtItems {
  items: IDebt[]
  nextToken: string | number
  startedAt: string | number
}

export interface IUser {
  readonly id: string;
  readonly name: string;
  readonly debt?: UserDebtItems;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}