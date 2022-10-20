import { useContext, useState, useMemo, useCallback, ChangeEvent, useEffect } from 'react';
import { DebtContext, ConvertToCurrency, InputValidation, FormatFields } from '@/util';
import { orderBy, ceil } from 'lodash';

export default function CalculationArea() {
  const { debtList, localDebtList, isUserAuthenticated } = useContext(DebtContext);

  const [paymentInput, setPaymentInput] = useState(0);

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const { value } = event.target;

    setPaymentInput(parseFloat(value));
  }, []);

  const validation = useMemo(() => ({ payment: InputValidation(paymentInput) }), [paymentInput]);

  const currentDebtList = useMemo(() => isUserAuthenticated ? debtList : localDebtList, [localDebtList, debtList, isUserAuthenticated]);

  // const debtListMinPayments = useMemo(() => {
  //   if (!currentDebtList) {
  //     return [];
  //   }

  //   const payments = currentDebtList.map((item) => {
  //     const aprDecimal = parseFloat((item.apr / 100).toFixed(4));

  //     return (item.balance * aprDecimal) / 12;
  //   });

  //   return payments;
  // }, [currentDebtList]);

  // const minPaymentValueSum = useMemo(() => {
  //   const reduced = debtListMinPayments.reduce((partialSum, a) => partialSum + a, 0);

  //   return {
  //     value: reduced,
  //     valueFormatted: ConvertToCurrency(reduced),
  //   };
  // }, [debtListMinPayments]);

  const fieldValueSum = useCallback((field: string) => {
    const list = currentDebtList?.map((item) => FormatFields({ value: item[field] }, 'number').value);

    const reduced = list?.reduce((partialSum, a) => partialSum + a, 0);

    return {
      value: reduced,
      valueFormatted: ConvertToCurrency(reduced),
    };
  }, [currentDebtList]);

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
      <div className='col-12 col-md-10 col-xl-6 border rounded pb-2 px-0 mt-2 mx-auto shadow'>
        <div className='bg-light rounded-top p-2 d-flex justify-content-center align-items-center'>
          <h3 className='mb-0'>Avalanche method effect</h3>
        </div>
        <div className='d-flex flex-column px-4 py-2'>
          <span className='pb-2 fs-5'>
            <strong>Total Debt: </strong>
            {fieldValueSum('balance').valueFormatted}
          </span>
          <span>
            <strong>Current Monthly Payment: </strong>
            {fieldValueSum('payment').valueFormatted}
          </span>
          {/* <span>
            <strong>Minimum Monthly Payment: </strong>
            {minPaymentValueSum.valueFormatted}
          </span> */}
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
              <div className='invalid-feedback'>
                {validation.payment.message}
              </div>
            </div>
            {paymentTooLow && <h5 className='mt-3 text-danger text-center'>Current payment must be greater than minimum</h5>}
          </div>
          {
            highPriorityDebt != null && (
              <div>
                <div>
                  <span>Cash left over: </span>
                  <strong className='text-info'>${paymentInput} - {fieldValueSum('payment').valueFormatted} = ({leftOverSum.valueFormatted})</strong>
                </div>

                <h4 className='pt-3'>
                  <span>Target Debt: </span>
                  <strong className='text-primary'>{highPriorityDebt.name} </strong>
                  <span className='fw-light fs-6'>({highPriorityDebt.type.length ? highPriorityDebt.type : 'None'}) </span>
                </h4>

                <div>
                  <strong>Current Payment: </strong>
                  <span className='text-danger'>${highPriorityDebt.payment}</span>
                </div>

                <div>
                  <strong>Suggested Payment: </strong>
                  <span className='text-success'>${highPriorityDebt.updatedPayment}</span>
                </div>

                <span className='fw-light'>Pay minimum payments for every other debt</span>
              </div>
            )
          }
        </div>
      </div>
    </form >
  );
}
