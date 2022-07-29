import { ICreateDebtInput } from '@/types';
import { createDebt, raiseError } from '@/util';
import { ChangeEvent, FormEvent, useCallback, useMemo, useState } from 'react';
import styles from './new-debt-area.module.scss';

interface NewDebtAreaProps {
  userId: string
  isUserAuthenticated: boolean
  handleAddLocalDebt: (debt: ICreateDebtInput) => void
}

export default function NewDebtArea({
  userId,
  isUserAuthenticated,
  handleAddLocalDebt,
}: NewDebtAreaProps) {
  const [isLoading, setIsLoading] = useState(false);

  const initialState = useMemo(() => ({
    name: '',
    type: '',
    balance: 0,
    apr: 0,
    payment: 0,
    userDebtId: '',
  }), []);

  const [createDebtFields, setCreateDebtFields] = useState<ICreateDebtInput>(initialState);

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setCreateDebtFields({ ...createDebtFields, [name]: value });
  }, [createDebtFields]);

  const handleAddDebt = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!isUserAuthenticated) {
      handleAddLocalDebt(createDebtFields);
      setIsLoading(false);
      return;
    }

    try {
      await createDebt({ ...createDebtFields, userDebtId: userId });
    } catch (err: any) {
      raiseError(err);
    } finally {
      setIsLoading(false);
    }
  }, [createDebtFields, handleAddLocalDebt, isUserAuthenticated, userId]);

  const handleResetFilters = useCallback(() => setCreateDebtFields(initialState), [initialState]);

  return (
    <div className={styles['new-debt-container']}>
      <form onSubmit={handleAddDebt}>
        <fieldset disabled={isLoading} className='row'>
          <div className='col-4'>
            <label htmlFor='new-debt-card-name'>Name</label>
            <div className='input-group mb-2'>
              <input
                id='new-debt-card-name'
                required
                className='form-control'
                type='text'
                name='name'
                maxLength={24}
                value={createDebtFields.name}
                onChange={handleInput}
              />
            </div>
          </div>
          <div className='col-4'>
            <label htmlFor='new-debt-card-type'>Type (Optional)</label>
            <div className='input-group mb-2'>
              <input
                id='new-debt-card-type'
                className='form-control'
                type='text'
                name='type'
                maxLength={24}
                value={createDebtFields.type}
                onChange={handleInput}
              />
            </div>
          </div>
          <div className='col-4'>
            <label htmlFor='new-debt-card-balance'>Balance</label>
            <div className='input-group mb-2'>
              <span className='input-group-text'>$</span>
              <input
                id='new-debt-card-balance'
                className='form-control'
                type='number'
                name='balance'
                value={createDebtFields.balance}
                onChange={handleInput}
              />
            </div>
          </div>
          <div className='col-4'>
            <label htmlFor='new-debt-card-apr'>Interest Rate (APR)</label>
            <div className='input-group mb-2'>
              <input
                id='new-debt-card-apr'
                className='form-control'
                type='number'
                name='apr'
                value={createDebtFields.apr}
                onChange={handleInput}
              />
            </div>
          </div>
          <div className='col-4'>
            <label htmlFor='new-debt-card-payment'>Monthly Payment</label>
            <div className='input-group mb-2'>
              <span className='input-group-text'>$</span>
              <input
                id='new-debt-card-payment'
                className='form-control'
                type='number'
                name='payment'
                value={createDebtFields.payment}
                onChange={handleInput}
              />
            </div>
          </div>
          <div className='d-flex flex-row justify-content-end align-items-center'>
            <div className={styles['action-button']}>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleResetFilters}
              >
                Reset
              </button>
            </div>
            <div className={styles['action-button']}>
              <button
                type="submit"
                className="btn btn-success"
              >
                Add
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
}