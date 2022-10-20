import { isEqual, some } from 'lodash';
import { ChangeEvent, FocusEvent, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  updateDebt,
  raiseError,
  deleteDebt,
  DebtContext,
  UpdateDebtValue,
  ConvertAPRToMonthlyPayment,
  InputValidation,
  FormatFields,
} from '@/util';
import styles from './debt-card.module.scss';
import { IDebt } from '@/types';

interface DebtCardProps {
  debt: IDebt
}

export default function DebtCard({ debt }: DebtCardProps) {
  const {
    selectedDebt,
    handleSelectedDebt,
    isUserAuthenticated,
    handleDeleteLocalDebt,
    handleUpdateLocalDebt,
    handleValueToUpdate,
    handleDebtList,
  } = useContext(DebtContext);

  const [cardFields, setCardFields] = useState({ balance: debt.balance, apr: debt.apr, payment: debt.payment });
  const [isLoading, setIsLoading] = useState(false);

  const recommendedMonthlyPayment = useMemo(() => ConvertAPRToMonthlyPayment(cardFields.apr, cardFields.balance), [cardFields.apr, cardFields.balance]);
  const isCredit = useMemo(() => debt && ['credit', 'creditcard', 'credit card'].includes(debt.type.trim().toLowerCase()) , [debt]);

  console.log(isCredit);

  const validation = useMemo(() => ({
    fieldsUpdated: { valid: !isEqual(cardFields, { balance: debt.balance, apr: debt.apr, payment: debt.payment }) },
    balance: InputValidation(cardFields.balance, 'balance'),
    apr: InputValidation(cardFields.apr, 'apr'),
    payment: InputValidation(cardFields.payment, 'payment', cardFields.balance),
  }), [cardFields, debt]);

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    handleSelectedDebt(debt);

    setCardFields({ ...cardFields, [name]: parseFloat(value) } as IDebt);
  }, [cardFields, debt, handleSelectedDebt]);

  const resetFields = useCallback(() => {
    setCardFields({ balance: debt.balance, apr: debt.apr, payment: debt.payment });
  }, [debt]);

  const formatLocalFields = useCallback(() => {
    const localFields = FormatFields(cardFields, 'string');

    setCardFields({ ...localFields });
  }, [cardFields]);

  const submitCardUpdate = useCallback(async (event: FocusEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (some(validation, ['valid', false]) || selectedDebt != debt) {
      resetFields();
      return;
    }

    const updatedDebt = { ...debt, ...FormatFields(cardFields, 'number') };

    if (isEqual(updatedDebt, debt)) {
      return;
    }

    formatLocalFields();

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
  }, [validation, selectedDebt, debt, cardFields, formatLocalFields, isUserAuthenticated, resetFields, handleUpdateLocalDebt, handleDebtList]);

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
    window.onbeforeunload = () => selectedDebt != null;
  }, [selectedDebt]);

  useEffect(() => {
    formatLocalFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (debt == null || cardFields == null) {
    return null;
  }

  return (
    <form
      className={`${styles.card} shadow-sm`}
      id={debt.id}
      onBlur={submitCardUpdate}
    >
      {
        isLoading && (
          <div className={styles.loading}>
            <div
              className='spinner-border text-warning'
              role='status'
            >
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
          <ul
            className='dropdown-menu'
            aria-labelledby='debt-card-dropdown-menu'
            onFocus={() => handleSelectedDebt(debt)}
          >
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
            className={`form-control ${!validation.balance.valid && 'is-invalid'}`}
            min={1}
            step={0.01}
            type='number'
            name='balance'
            required
            value={isNaN(cardFields.balance) ? '' : cardFields.balance}
            onChange={handleInput}
            onClick={() => handleSelectedDebt(debt)}
          />
          <div className='invalid-feedback'>
            {validation.balance.message}
          </div>
        </div>
        <label htmlFor={`${debt.id}-interest-rate`}>Interest Rate (APR)</label>
        <div className='input-group mb-2'>
          <input
            id={`${debt.id}-interest-rate`}
            className={`form-control ${!validation.apr.valid && 'is-invalid'}`}
            type='number'
            name='apr'
            max={100}
            min={0}
            step={0.001}
            required
            value={isNaN(cardFields.apr) ? '' : cardFields.apr}
            onChange={handleInput}
            onClick={() => handleSelectedDebt(debt)}
          />
          <span className='input-group-text'>%</span>
          <div className='invalid-feedback'>
            {InputValidation(cardFields.apr, 'apr').message}
          </div>
        </div>
        <label htmlFor={`${debt.id}-monthly-payment`}>Monthly Payment</label>
        <div className='input-group mb-1'>
          <span className='input-group-text'>$</span>
          <input
            id={`${debt.id}-monthly-payment`}
            className={`form-control ${!validation.payment.valid && 'is-invalid'}`}
            type='number'
            min={0}
            step={0.01}
            name='payment'
            required
            value={isNaN(cardFields.payment) ? '' : cardFields.payment}
            onChange={handleInput}
            onClick={() => handleSelectedDebt(debt)}
          />
          <div className='invalid-feedback'>
            {validation.payment.message}
          </div>
        </div>
        {
          !isCredit && (
            <label
              className={styles.caption}
              htmlFor={`${debt.id}-monthly-payment`}
            >
              <div>
              Monthly interest rate: {recommendedMonthlyPayment.monthlyInterestRatePercentage}
              </div>
            Recommended minimum payment: <strong>{recommendedMonthlyPayment.monthlyPayment}</strong>
            </label>
          )
        }
      </div>
    </form >
  );
}