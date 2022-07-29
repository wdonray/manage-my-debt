import { IDebt } from 'types/debt';
import { DebtCard } from './index';

interface DebtCardsProps {
  debtList: IDebt[]
}

export default function DebtCards({ debtList }: DebtCardsProps) {
  if (!debtList.length) {
    return (
      <div>Nothing Here!</div>
    );
  }

  return (
    <div className='row g-3'>
      {debtList.map((debt: IDebt) => (
        <div className='col-4 mr-0' key={debt.id}>
          <DebtCard debt={debt} />
        </div>
      ))}
    </div>
  );
}