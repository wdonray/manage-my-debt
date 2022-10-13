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
  const [cardFields, setCreateDebtFields] = useState(initialState);
  const [hideBar, setHideBar] = useState(true);

  const currentDebtList = useMemo(() => isUserAuthenticated ? debtList : localDebtList, [localDebtList, debtList, isUserAuthenticated]);
  const recommendedMonthlyPayment = useMemo(() => ConvertAPRToMonthlyPayment(cardFields.apr, cardFields.balance), [cardFields.apr, cardFields.balance]);
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

  const handleHideModal = useCallback(() => {
    const closeButton = document.getElementById('close-add-debt');

    closeButton?.click();
  }, []);

  const handleScrollToDebt = useCallback(() => document.getElementById('debt-list')?.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'center' }), []);

  const handleFieldBlur = useCallback(() => {
    const formattedFields = FormatFields({ balance: cardFields.balance, apr: cardFields.apr, payment: cardFields.payment }, 'string');

    setCreateDebtFields({ ...cardFields, ...formattedFields });
  }, [cardFields]);

  const handleSideBarHidden = useCallback(() => setHideBar(!hideBar), [hideBar]);

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
      setTimeout(() => handleScrollToDebt(), 100);

      if (hideBar) {
        handleHideModal();
      }
    }
  }, [cardFields, handleDebtList, handleHideModal, handleScrollToDebt, hideBar, userId]);

  const handleLocalAddDebt = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    handleAddLocalDebt({ ...cardFields, id: uniqueId() });

    setCreateDebtFields({ ...cardFields, name: '', type: '' });
    setIsLoading(false);

    setTimeout(() => handleScrollToDebt(), 100);

    if (hideBar) {
      handleHideModal();
    }
  }, [cardFields, handleAddLocalDebt, handleHideModal, handleScrollToDebt, hideBar]);

  const handleResetFilters = useCallback(() => setCreateDebtFields(initialState), []);

  useEffect(() => {
    handleFieldBlur();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <button
        type='button'
        id={styles['debt-btn']}
        className='btn rounded-circle rounded-5'
        data-bs-toggle='offcanvas'
        data-bs-target='#new-debt-area'
        aria-expanded='false'
        aria-controls='new-debt-area'
      >
        <i className='bi bi-plus' />
      </button>
      <div
        id='new-debt-area'
        className='offcanvas offcanvas-start text-bg-dark'
        tabIndex={-1}
      >
        <div className='offcanvas-header'>
          <h5 className='offcanvas-title'>
            Add New Debt
          </h5>
          <button
            type='button'
            id='close-add-debt'
            className='btn-close btn-close-white'
            data-bs-dismiss='offcanvas'
            aria-label='Close'
          />
        </div>
        <div className='offcanvas-body'>
          <form onSubmit={!isUserAuthenticated ? handleLocalAddDebt : handleAddDebt}>
            <fieldset disabled={isLoading} className='grid'>
              <div className='col-12'>
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
              <div className='col-12'>
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
              <div className='col-12'>
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
              <div className='col-12'>
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
                  <div className='invalid-feedback'>
                    {validation.apr.message}
                  </div>
                </div>
              </div>
              <div className='col-12'>
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
              <div className='row px-4 px-md-2 g-3 mt-1'>
                <div className='form-check col-12'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    value=''
                    checked={hideBar}
                    onChange={handleSideBarHidden}
                    id='hide-sidebar'
                  />
                  <label
                    className='form-check-label'
                    htmlFor='hide-sidebar'
                  >
                    Hide sidebar after adding debt
                  </label>
                </div>
                <button
                  type='button'
                  className='btn btn-secondary col-12 col-md-5'
                  onClick={handleResetFilters}
                >
                  Reset
                </button>
                <button
                  type='submit'
                  className='btn btn-success col-12 col-md-5 ms-auto'
                  disabled={some(validation, ['valid', false])}
                >
                  Add
                </button>
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
    </div>
  );
}