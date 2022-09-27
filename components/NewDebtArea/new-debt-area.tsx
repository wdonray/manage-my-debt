import { ChangeEvent, FormEvent, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import styles from './new-debt-area.module.scss';
import { find, some, uniqueId } from 'lodash';
import { DebtContext, ConvertAPRToMonthlyPayment, createDebt, raiseError, InputValidation, FormatFields } from '@/util';

const initialState = {
  name: '',
  type: '',
  balance: 1.00,
  apr: 1.00,
  payment: 1.00,
  userDebtId: '',
};

export default function NewDebtArea() {
  const { userId, isUserAuthenticated, handleAddLocalDebt, handleDebtList, debtList, localDebtList } = useContext(DebtContext);
  const [isLoading, setIsLoading] = useState(false);
  const [collapseShown, setCollapseShown] = useState(false);

  const [cardFields, setCreateDebtFields] = useState(initialState);

  const currentDebtList = useMemo(() => isUserAuthenticated ? debtList : localDebtList, [localDebtList, debtList, isUserAuthenticated]);

  const recommendedMonthlyPayment = useMemo(() => ConvertAPRToMonthlyPayment(cardFields.apr, cardFields.balance), [cardFields.apr, cardFields.balance]);
  const collapseIconClass = useMemo(() => `bi bi-${collapseShown ? 'dash' : 'plus'}`, [collapseShown]);
  const buttonClass = useMemo(() => collapseShown ? 'danger' : 'success', [collapseShown]);
  const debtExist = useMemo(() => find(currentDebtList, { name: cardFields.name, type: cardFields.type }), [currentDebtList, cardFields.name, cardFields.type]);

  const validation = useMemo(() => ({
    debtExist: { valid: !debtExist, message: 'Duplicate debt found!' },
    blankName: { valid: cardFields.name.trim() !== '' },
    balance: InputValidation(cardFields.balance, 'balance'),
    apr: InputValidation(cardFields.apr, 'apr'),
    payment: InputValidation(cardFields.payment, 'payment', cardFields.balance),
  }), [cardFields, debtExist]);

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    let { name } = event.target;

    if (name === 'debt-name') {
      name = 'name';
    }

    setCreateDebtFields({ ...cardFields, [name]: event.target.value });
  }, [cardFields]);

  const handleFieldBlur = useCallback(() => {
    const formattedFields = FormatFields({ balance: cardFields.balance, apr: cardFields.apr, payment: cardFields.payment }, 'string');

    setCreateDebtFields({ ...cardFields, ...formattedFields });
  }, [cardFields]);

  const handleAddDebt = useCallback(async (event: FormEvent<HTMLFormElement>) => {
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
    }
  }, [cardFields, handleDebtList, userId]);

  const handleLocalAddDebt = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    handleAddLocalDebt({ ...cardFields, id: uniqueId() });
    setCreateDebtFields({ ...cardFields, name: '', type: '' });
    setIsLoading(false);
  }, [cardFields, handleAddLocalDebt]);

  const handleResetFilters = useCallback(() => setCreateDebtFields(initialState), []);

  const handleCollapseShown = useCallback((value) => {
    if (value === collapseShown) {
      return;
    }

    setCollapseShown(value);
  }, [collapseShown]);

  useEffect(() => {
    const collapse = document.getElementById('new-debt-area');

    collapse?.addEventListener('show.bs.collapse', () => handleCollapseShown(true));
    collapse?.addEventListener('hide.bs.collapse', () => handleCollapseShown(false));

    return () => {
      collapse?.removeEventListener('show.bs.collapse', () => handleCollapseShown(true));
      collapse?.removeEventListener('hide.bs.collapse', () => handleCollapseShown(false));
    };
  }, [handleCollapseShown]);

  useEffect(() => {
    handleFieldBlur();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='grid'>
      <button
        type='button'
        className={`btn btn-outline-${buttonClass} col-12 col-md-3 col-lg-2 ${styles.collapse}`}
        data-bs-toggle='collapse'
        data-bs-target='#new-debt-area'
        aria-expanded='false'
        aria-controls='new-debt-area'
      >
        <h5 className='d-flex align-items-center mb-0'>
          <i className={collapseIconClass} />
          Add Debt
        </h5>
      </button>
      <div
        id='new-debt-area'
        className={`collapse col-12 ${styles['new-debt-container']}`}
      >
        <form onSubmit={!isUserAuthenticated ? handleLocalAddDebt : handleAddDebt}>
          <fieldset disabled={isLoading} className='row'>
            <div className='col-12 col-md-4'>
              <label htmlFor='new-debt-card-name'>Name</label>
              <div className='input-group mb-2'>
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
                />
              </div>
            </div>
            <div className='col-12 col-md-4'>
              <label htmlFor='new-debt-card-type'>Type (Optional)</label>
              <div className='input-group mb-2'>
                <input
                  id='new-debt-card-type'
                  className='form-control'
                  placeholder='Credit Card, Student Loan, etc...'
                  type='text'
                  name='type'
                  maxLength={24}
                  value={cardFields.type}
                  onChange={handleInput}
                />
              </div>
            </div>
            <div className='col-12 col-md-4'>
              <label htmlFor='new-debt-card-balance'>Balance</label>
              <div className='input-group mb-2'>
                <span className='input-group-text'>$</span>
                <input
                  id='new-debt-card-balance'
                  className={`form-control ${!validation.balance.valid && 'is-invalid'}`}
                  type='number'
                  min={1}
                  step={0.01}
                  name='balance'
                  required
                  value={cardFields.balance}
                  onChange={handleInput}
                  onBlur={handleFieldBlur}
                />
                <div className='invalid-feedback'>
                  {validation.balance.message}
                </div>
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
                <span className='input-group-text'>%</span>
                <div className='invalid-feedback'>
                  {validation.apr.message}
                </div>
              </div>
            </div>
            <div className='col-12 col-md-4'>
              <label htmlFor='new-debt-card-payment'>Monthly Payment</label>
              <div className='input-group mb-2'>
                <span className='input-group-text'>$</span>
                <input
                  id='new-debt-card-payment'
                  className={`form-control ${!validation.payment.valid && 'is-invalid'}`}
                  type='number'
                  min={0}
                  step={0.01}
                  name='payment'
                  required
                  value={cardFields.payment}
                  onChange={handleInput}
                  onBlur={handleFieldBlur}
                />
                <div className='invalid-feedback'>
                  {validation.payment.message}
                </div>
              </div>
              {
                recommendedMonthlyPayment.monthlyPayment != '$0.00' && (
                  <label
                    className={styles.caption}
                    htmlFor='new-debt-card-payment'
                  >
                    <div className='mb-1'>
                      Monthly interest rate: {recommendedMonthlyPayment.monthlyInterestRatePercentage}
                    </div>
                    Recommended minimum payment: <strong>{recommendedMonthlyPayment.monthlyPayment}</strong>
                  </label>
                )
              }
            </div>
            <div className='d-flex flex-row mt-3 justify-content-end align-items-center'>
              <div className={styles['action-button']}>
                <button
                  type='button'
                  className='btn btn-outline-secondary'
                  onClick={handleResetFilters}
                >
                  Reset
                </button>
              </div>
              <div className={styles['action-button']}>
                <button
                  type='submit'
                  className='btn btn-success'
                  disabled={some(validation, ['valid', false])}
                >
                  Add
                </button>
              </div>
            </div>
            {
              !validation.debtExist.valid && (
                <div className='col-12 text-center'>
                  <strong className='text-danger'>{validation.debtExist.message}</strong>
                </div>
              )
            }
          </fieldset>
        </form>
      </div>
    </div>
  );
}