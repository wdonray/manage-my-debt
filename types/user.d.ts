import { IDebt } from '@/types';

export interface IUser {
  readonly id: string;
  readonly name: string;
  readonly debt?: (IDebt | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}