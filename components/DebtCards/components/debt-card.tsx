import { isEqual, keys } from 'lodash';
import { ChangeEvent, FocusEvent, useCallback, useContext, useEffect, useState } from 'react';
import { updateDebt, raiseError, deleteDebt, DebtContext, UpdateDebtValue } from '@/util';
import styles from './debt-card.module.scss';
import { TargetActiveElement } from 'util/hooks/active-element';
import { IDebt } from '@/types';

interface DebtCardProps {
  debt: IDebt
}

export default function DebtCard({ debt }: DebtCardProps) {
  const { handleSelectedDebt, isUserAuthenticated, handleDeleteLocalDebt, handleUpdateLocalDebt, handleValueToUpdate, handleDebtList } = useContext(DebtContext);
  const [cardFields, setCardFields] = useState({ balance: debt.balance, apr: debt.apr, payment: debt.payment });
  const [isLoading, setIsLoading] = useState(false);
  const targetedInput = TargetActiveElement() as HTMLInputElement;

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setCardFields({ ...cardFields, [name]: value } as IDebt);
  }, [cardFields]);

  const submitCardUpdate = useCallback(async (event: FocusEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !keys(cardFields).includes(targetedInput.name) ||
      cardFields == null ||
      isEqual(cardFields, { balance: debt.balance, apr: debt.apr, payment: debt.payment })
    ) {
      return;
    }

    const updatedDebt = { ...debt, ...cardFields };

    if (!isUserAuthenticated) {
      handleUpdateLocalDebt(updatedDebt);
      return;
    }

    try {
      const debt = await updateDebt(updatedDebt);

      handleDebtList(debt);
    } catch (err) {
      raiseError(err);
    }
  }, [cardFields, debt, handleDebtList, handleUpdateLocalDebt, isUserAuthenticated, targetedInput.name]);

  const handleDelete = useCallback(async () => {
    if (!debt._version || debt?.id == null) {
      return;
    }

    setIsLoading(true);

    try {
      const deletedDebt = await deleteDebt({ id: debt.id, _version: debt._version });

      handleDebtList(deletedDebt);
    } catch (err) {
      raiseError(err);
    } finally {
      setIsLoading(false);
    }
  }, [debt._version, debt.id, handleDebtList]);

  const handleLocalDelete = useCallback(() => {
    if (debt?.id == null) {
      return;
    }

    setIsLoading(true);
    handleDeleteLocalDebt(debt.id);
    setIsLoading(false);
  }, [debt.id, handleDeleteLocalDebt]);

  useEffect(() => {
    window.onbeforeunload = () => keys(cardFields).includes(targetedInput.name);
  }, [cardFields, targetedInput]);

  if (debt == null || cardFields == null) {
    return null;
  }

  return (
    <form
      className={styles.card}
      id={debt.id}
      onBlur={submitCardUpdate}
      onClick={() => handleSelectedDebt(debt)}
    >
      {
        isLoading && (
          <div className={styles.loading}>
            <div className='spinner-border text-info' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
          </div>
        )
      }
      <div className={styles.header}>
        <span className='d-flex flex-column'>
          <h5>{debt.name}</h5>
          {debt.type.length ? <span>({debt.type})</span> : <span>(None)</span>}
        </span>
        <div className='dropdown'>
          <i
            className={`${styles['card-options']} bi bi-three-dots`}
            id='debt-card-dropdown-menu'
            data-bs-toggle='dropdown'
            aria-expanded='false'
          />
          <ul className='dropdown-menu' aria-labelledby='debt-card-dropdown-menu'>
            <li>
              <button
                type='button'
                className='dropdown-item'
                data-bs-toggle='modal'
                data-bs-target='#update-debt-modal'
                onClick={() => handleValueToUpdate(UpdateDebtValue.name)}
              >
                <i className='bi bi-pencil-square'></i> Rename
              </button>
            </li>
            <li>
              <button
                type='button'
                className='dropdown-item'
                data-bs-toggle='modal'
                data-bs-target='#update-debt-modal'
                onClick={() => handleValueToUpdate(UpdateDebtValue.type)}
              >
                Change Type
              </button>
            </li>
            <hr className='my-2'></hr>
            <li>
              <button
                type='button'
                className='dropdown-item'
                onClick={!isUserAuthenticated ? handleLocalDelete : handleDelete}
              >
                <i className='bi bi-trash'></i> Remove
              </button>
            </li>
          </ul>
        </div>
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
    </form >
  );
}