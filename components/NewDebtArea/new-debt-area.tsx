import { ChangeEvent, FormEvent, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { DebtContext, createDebt, raiseError, InputValidation, FormatFields } from '@/util';
import { find, some, uniqueId } from 'lodash';
import styles from './new-debt-area.module.scss';

const initialState = {
  apr: 1.0,
  balance: 1.0,
  name: '',
  payment: 1.0,
  type: '',
  userDebtId: '',
};

export default function NewDebtArea() {
  const { userId, isUserAuthenticated, handleAddLocalDebt, handleDebtList, debtList, localDebtList } = useContext(DebtContext);

  const [isLoading, setIsLoading] = useState(false);
  const [cardFields, setCreateDebtFields] = useState(initialState);

  const currentDebtList = useMemo(() => (isUserAuthenticated ? debtList : localDebtList), [localDebtList, debtList, isUserAuthenticated]);
  const debtExist = useMemo(() => find(currentDebtList, { name: cardFields.name, type: cardFields.type }), [currentDebtList, cardFields.name, cardFields.type]);

  const validation = useMemo(
    () => ({
      debtExist: { valid: !debtExist, message: 'Duplicate debt found!' },
      blankName: { valid: cardFields.name.trim() !== '' },
      balance: InputValidation(cardFields.balance, 'balance'),
      apr: InputValidation(cardFields.apr, 'apr'),
      payment: InputValidation(cardFields.payment, 'payment', cardFields.balance),
    }),
    [cardFields, debtExist]
  );

  const handleInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      let { name } = event.target;

      if (name === 'debt-name') {
        name = 'name';
      }

      setCreateDebtFields({ ...cardFields, [name]: event.target.value });
    },
    [cardFields]
  );

  const handleScrollToDebt = useCallback(() => document.getElementById('debt-list')?.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'center' }), []);

  const handleFieldBlur = useCallback(() => {
    const formattedFields = FormatFields({ balance: cardFields.balance, apr: cardFields.apr, payment: cardFields.payment }, 'string');

    setCreateDebtFields({ ...cardFields, ...formattedFields });
  }, [cardFields]);

  const handleAddDebt = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLoading(true);

      if (userId == null) {
        return;
      }

      try {
        const formattedFields = FormatFields({ balance: cardFields.balance, apr: cardFields.apr, payment: cardFields.payment }, 'number');
        const trimFields = { ...cardFields, type: cardFields.type.trim(), name: cardFields.name.trim() };
        const debt = await createDebt({ ...trimFields, ...formattedFields, userDebtId: userId });

        handleDebtList(debt);
      } catch (err) {
        raiseError(err);
      } finally {
        setCreateDebtFields({ ...cardFields, name: '', type: '' });
        setIsLoading(false);
        setTimeout(() => handleScrollToDebt(), 100);
      }
    },
    [cardFields, handleDebtList, handleScrollToDebt, userId]
  );

  const handleLocalAddDebt = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setIsLoading(true);
      handleAddLocalDebt({ ...cardFields, id: uniqueId() });

      setCreateDebtFields({ ...cardFields, name: '', type: '' });
      setIsLoading(false);

      setTimeout(() => handleScrollToDebt(), 100);
    },
    [cardFields, handleAddLocalDebt, handleScrollToDebt]
  );

  useEffect(() => {
    handleFieldBlur();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles['debt-area-container']}>
      <form
        onSubmit={!isUserAuthenticated ? handleLocalAddDebt : handleAddDebt}
        autoComplete='off'
      >
        <fieldset disabled={isLoading}>
          <div className='row m-0'>
            <div className={`col-12 p-0 ${styles['name-container']}`}>
              <div className='row m-0 justify-content-center'>
                <div className={`input-group col-12 col-md-4 ${styles['name-inner-content']}`}>
                  <input
                    id='new-debt-card-name'
                    required
                    className='form-control'
                    placeholder='Name of debt...'
                    type='text'
                    name='debt-name'
                    maxLength={24}
                    value={cardFields.name}
                    onChange={handleInput}
                    autoFocus
                  />
                  <span className='input-group-text'>
                    <i className='bi bi-pencil-square'></i>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={`row m-0 p-3 ${styles['field-container']}`}>
            <div className='col-12 col-md-4'>
              <label htmlFor='new-debt-card-balance'>Balance</label>
              <div className='input-group mb-2'>
                <span className='input-group-text'>$</span>
                <input
                  id='new-debt-card-balance'
                  className={`form-control rounded-end ${!validation.balance.valid && 'is-invalid'}`}
                  type='number'
                  min={1}
                  step={0.01}
                  name='balance'
                  required
                  value={cardFields.balance}
                  onChange={handleInput}
                  onBlur={handleFieldBlur}
                />
                <div className='invalid-feedback'>{validation.balance.message}</div>
              </div>
            </div>
            <div className='col-12 col-md-4'>
              <label htmlFor='new-debt-card-apr'>Interest Rate (APR)</label>
              <div className='input-group mb-2'>
                <input
                  id='new-debt-card-apr'
                  className={`form-control ${!validation.apr.valid && 'is-invalid'}`}
                  type='number'
                  max={100}
                  min={0}
                  step={0.001}
                  name='apr'
                  required
                  value={cardFields.apr}
                  onChange={handleInput}
                  onBlur={handleFieldBlur}
                />
                <span className='input-group-text rounded-end'>%</span>
                <div className='invalid-feedback'>{validation.apr.message}</div>
              </div>
            </div>
            <div className='col-12 col-md-4'>
              <label htmlFor='new-debt-card-payment'>Monthly Payment</label>
              <div className='input-group mb-2'>
                <span className='input-group-text'>$</span>
                <input
                  id='new-debt-card-payment'
                  className={`form-control rounded-end ${!validation.payment.valid && 'is-invalid'}`}
                  type='number'
                  min={0}
                  step={0.01}
                  name='payment'
                  required
                  value={cardFields.payment}
                  onChange={handleInput}
                  onBlur={handleFieldBlur}
                />
                <div className='invalid-feedback'>{validation.payment.message}</div>
              </div>
            </div>
            <div className='row m-0 justify-content-center mt-3'>
              <button
                type='submit'
                className='btn btn-success col-12 col-md-4 col-xl-2'
                disabled={some(validation, ['valid', false])}
              >
                <i className='bi bi-plus'></i> Add New Debt
              </button>
            </div>
            {!validation.debtExist.valid && (
              <div className='col-12 text-center'>
                <strong className='text-danger'>{validation.debtExist.message}</strong>
              </div>
            )}
          </div>
        </fieldset>
      </form>
    </div>
  );
}
