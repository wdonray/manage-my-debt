import { useContext, useState, useMemo, useCallback, ChangeEvent, useEffect } from 'react';
import { DebtContext, ConvertToCurrency, InputValidation } from '@/util';
import { orderBy, ceil } from 'lodash';

export default function CalculationArea() {
  const { debtList } = useContext(DebtContext);

  const [paymentInput, setPaymentInput] = useState(0);

  const validation = useMemo(() => ({
    payment: InputValidation(paymentInput),
  }), [paymentInput]);

  const debtListMinPayments = useMemo(() => {
    if (!debtList) {
      return [];
    }

    const payments = debtList.map((item) => {
      const aprDecimal = parseFloat((item.apr / 100).toFixed(4));

      return (item.balance * aprDecimal) / 12;
    });

    return payments;
  }, [debtList]);

  const totalMinPayment = useMemo(() => debtListMinPayments.reduce((partialSum, a) => partialSum + a, 0), [debtListMinPayments]);
  const formattedTotalMinPayment = useMemo(() => ConvertToCurrency(totalMinPayment), [totalMinPayment]);

  const totalCurrentPayment = useMemo(() => debtList?.map((item) => item.payment).reduce((partialSum, a) => partialSum + a, 0), [debtList]);
  const formattedTotalCurrentPayment = useMemo(() => totalCurrentPayment ? ConvertToCurrency(totalCurrentPayment) : '0', [totalCurrentPayment]);

  const totalDebt = useMemo(() => ConvertToCurrency(debtList?.map((item) => item.balance).reduce((partialSum, a) => partialSum + a, 0) ?? 0), [debtList]);

  const leftOver = useMemo(() => {
    const value = paymentInput - totalMinPayment;

    return value <= 0 || Number.isNaN(value) ? 0 : value;
  }, [paymentInput, totalMinPayment]);

  const leftOverFormatted = useMemo(() => {
    const value = ConvertToCurrency(paymentInput - totalMinPayment);

    return value.includes('-') ? 0 : value;
  }, [paymentInput, totalMinPayment]);

  const paymentTooLow = useMemo(() => {
    if (paymentInput) {
      return paymentInput < totalMinPayment;
    }

    return false;
  }, [paymentInput, totalMinPayment]);

  const highPriorityDebt = useMemo(() => {
    if (!debtList || leftOver <= 0) {
      return null;
    }

    const topDebt = orderBy([...debtList], ['apr'], ['desc'])[0];

    return {
      ...topDebt,
      updatedPayment: ceil(topDebt.payment + leftOver, 2),
    };
  }, [debtList, leftOver]);

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setPaymentInput(parseFloat(value));
  }, []);

  useEffect(() => {
    if (paymentInput <= 0 && totalCurrentPayment) {
      setPaymentInput(totalCurrentPayment);
    }
  }, [paymentInput, totalCurrentPayment]);

  // Total APR (%)
  // Payoff term (Date)
  // Total interest ($)

  return (
    <form className='mb-4 px-2 row'>
      <div className="col-12 col-md-10 col-xl-6 border rounded pb-2 px-0 mt-2 mx-auto shadow">
        <div className='bg-light rounded-top p-2 d-flex justify-content-center align-items-center'>
          <h3 className='mb-0'>Avalanche method effect</h3>
        </div>
        <div className='d-flex flex-column px-4 py-2'>
          <span className='pb-2 fs-5'>
            <strong>Total Debt: </strong>
            ${totalDebt}
          </span>
          <span>
            <strong>Current Monthly Payment: </strong>
            ${formattedTotalCurrentPayment}
          </span>
          <span>
            <strong>Minimum Monthly Payment: </strong>
            ${formattedTotalMinPayment}
          </span>
          <hr></hr>
          <div>
            <label htmlFor="payment-input">Amount you can pay per month</label>
            <div className='input-group'>
              <span className='input-group-text'>$</span>
              <input
                id='payment-input'
                className={`form-control ${!validation.payment.valid && 'is-invalid'}`}
                type='number'
                name='apr'
                min={0}
                step={0.01}
                value={paymentInput}
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
                  <strong className='text-info'>${paymentInput} - ${formattedTotalMinPayment} = (${leftOverFormatted})</strong>
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
