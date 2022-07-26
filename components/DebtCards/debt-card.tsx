import { IDebt } from '@/types';
import { isEqual, keys } from 'lodash';
import { ChangeEvent, FocusEvent, useCallback, useEffect, useState } from 'react';
import { updateDebt, raiseError, removeProperties } from '@/util';
import styles from './debt-card.module.scss';
import { TargetActiveElement } from 'util/hooks/active-element';

interface DebtCardProps {
  debt: IDebt
}

export default function DebtCard({ debt }: DebtCardProps) {
  const [cardFields, setCardFields] = useState({ ...debt });
  const targetedInput = TargetActiveElement() as HTMLInputElement;

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setCardFields({ ...cardFields, [name]: value });
  }, [cardFields]);

  const submitCardUpdate = useCallback(async (event: FocusEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEqual(cardFields, debt)) {
      return;
    }

    const updatePayload = removeProperties(cardFields, 'owner', 'createdAt', 'updatedAt', '_deleted', '_lastChangedAt');

    try {
      await updateDebt({ ...updatePayload });
    } catch (err: any) {
      raiseError(err);
    }
  }, [cardFields, debt]);

  useEffect(() => {
    if (keys(cardFields).includes(targetedInput.name)) {
      window.onbeforeunload = function () {
        return true;
      };
    }
  }, [cardFields, targetedInput]);

  return (
    <form className={styles.card} id={debt.id} onBlur={submitCardUpdate}>
      <div className={styles.header}>
        <h5>{debt.name}</h5>
      </div>
      <div className={styles.body}>
        <label htmlFor={`${debt.id}-card-balance`}>Balance</label>
        <div className='input-group mb-2'>
          <span className='input-group-text'>$</span>
          <input
            id={`${debt.id}-card-balance`}
            className='form-control'
            type='number'
            name='balance'
            value={cardFields.balance}
            onChange={handleInput}
          />
        </div>
        <label htmlFor={`${debt.id}-interest-rate`}>Interest Rate (APR)</label>
        <div className='input-group mb-2'>
          <input
            id={`${debt.id}-interest-rate`}
            className='form-control'
            type='number'
            name='apr'
            value={cardFields.apr}
            onChange={handleInput}
          />
        </div>
        <label htmlFor={`${debt.id}-monthly-payment`}>Monthly Payment</label>
        <div className='input-group'>
          <span className='input-group-text'>$</span>
          <input
            id={`${debt.id}-monthly-payment`}
            className='form-control'
            type='number'
            name='payment'
            value={cardFields.payment}
            onChange={handleInput}
          />
        </div>
      </div>
    </form>
  );
}