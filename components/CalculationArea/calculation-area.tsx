import { useContext, useState, useMemo, useCallback, ChangeEvent, useEffect } from 'react';
import { DebtContext, ConvertToCurrency, InputValidation, FormatFields } from '@/util';
import { orderBy, ceil } from 'lodash';
import styles from './calculation-area.module.scss';

export default function CalculationArea() {
  const { debtList, localDebtList, isUserAuthenticated } = useContext(DebtContext);

  const [paymentInput, setPaymentInput] = useState(0);

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const { value } = event.target;

    setPaymentInput(parseFloat(value));
  }, []);

  const validation = useMemo(() => ({ payment: InputValidation(paymentInput) }), [paymentInput]);

  const currentDebtList = useMemo(() => (isUserAuthenticated ? debtList : localDebtList), [localDebtList, debtList, isUserAuthenticated]);

  const fieldValueSum = useCallback(
    (field: string) => {
      const list = currentDebtList?.map((item) => FormatFields({ value: item[field] }, 'number').value);

      const reduced = list?.reduce((partialSum, a) => partialSum + a, 0);

      return {
        value: reduced,
        valueFormatted: ConvertToCurrency(reduced),
      };
    },
    [currentDebtList]
  );

  const leftOverSum = useMemo(() => {
    const leftOverValue = paymentInput - fieldValueSum('payment').value;

    return {
      value: leftOverValue <= 0 || Number.isNaN(leftOverValue) ? 0 : leftOverValue,
      valueFormatted: ConvertToCurrency(leftOverValue),
    };
  }, [fieldValueSum, paymentInput]);

  const paymentTooLow = useMemo(() => {
    if (paymentInput) {
      return paymentInput < fieldValueSum('payment').value;
    }

    return false;
  }, [fieldValueSum, paymentInput]);

  const highPriorityDebt = useMemo(() => {
    if (!currentDebtList || currentDebtList.length <= 0 || leftOverSum.value <= 0) {
      return null;
    }

    const topDebt = orderBy([...currentDebtList], ['apr'], ['desc'])[0];

    const formattedFields = FormatFields({ payment: topDebt.payment, leftOverSum: leftOverSum.value }, 'number');

    return {
      ...topDebt,
      updatedPayment: ceil(formattedFields.payment + formattedFields.leftOverSum, 2),
    };
  }, [currentDebtList, leftOverSum]);

  useEffect(() => {
    const paymentSum = fieldValueSum('payment').value;

    if (paymentInput <= 0 && paymentSum) {
      setPaymentInput(paymentSum);
    }
  }, [fieldValueSum, paymentInput]);

  // Total APR (%)
  // Payoff term (Date)
  // Total interest ($)

  if (!currentDebtList || currentDebtList.length <= 1) {
    return null;
  }

  return (
    <form
      className='mb-4 px-2 row'
      onSubmit={(e) => e.preventDefault()}
    >
      <div className={`col-12 col-md-10 col-xl-6 rounded pb-2 px-0 mt-2 mx-auto shadow ${styles['calculation-area-container']}`}>
        <div className={` p-2 d-flex justify-content-center align-items-center ${styles.header}`}>
          <h3 className='mb-0'>Avalanche method effect</h3>
        </div>
        <div className='d-flex flex-column px-4 py-2'>
          <span className='pb-2 fs-5'>
            <span>Total Debt</span>
            <p>{fieldValueSum('balance').valueFormatted}</p>
          </span>
          <span>
            <span>Current Monthly Payment</span>
            <p>{fieldValueSum('payment').valueFormatted}</p>
          </span>
          <div className='mt-3'>
            <label htmlFor='payment-input'>Amount you can pay per month</label>
            <div className='input-group'>
              <span className='input-group-text'>$</span>
              <input
                id='payment-input'
                className={`form-control ${!validation.payment.valid && 'is-invalid'}`}
                type='number'
                name='apr'
                min={0}
                step={0.01}
                value={isNaN(paymentInput) ? '' : paymentInput}
                onChange={handleInput}
              />
              <div className='invalid-feedback'>{validation.payment.message}</div>
            </div>
            {paymentTooLow && <h5 className='mt-3 text-danger text-center'>Current payment must be greater than minimum</h5>}
          </div>
          {highPriorityDebt != null && (
            <div className='mt-3'>
              <div>
                <span>Cash left over</span>
                <p>
                  ${paymentInput} - {fieldValueSum('payment').valueFormatted} = ({leftOverSum.valueFormatted})
                </p>
              </div>

              <hr></hr>

              <h4>
                <span>Target Debt: </span>
                <strong>{highPriorityDebt.name} </strong>
              </h4>

              <div>
                <span>Current Payment</span>
                <p>${highPriorityDebt.payment}</p>
              </div>

              <div>
                <span>Suggested Payment</span>
                <p>${highPriorityDebt.updatedPayment}</p>
              </div>

              <span className='fw-light mt-2'>Pay minimum payments for every other debt</span>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
