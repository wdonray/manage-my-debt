import { UserContext } from '@/util';
import { useContext, useMemo } from 'react';
import { IDebt } from 'types/debt';
import { DebtCard } from './index';

export default function DebtCards() {
  const { user } = useContext(UserContext);

  const debtList = useMemo(() => user?.debt.items ?? [], [user]);

  if (!debtList.length) {
    return (
      <div>Nothing Here!</div>
    );
  }

  return (
    <div className='d-flex justify-content-center align-items-center px-3 py-2'>
      {debtList.map((debt: IDebt) => (
        <div className='mx-2' key={debt.id}>
          <DebtCard debt={debt} />
        </div>
      ))}
    </div>
  );
}