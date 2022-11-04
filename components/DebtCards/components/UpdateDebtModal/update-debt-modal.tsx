import { ChangeEvent, FormEvent, useCallback, useContext, useMemo, useState } from 'react';
import { DebtContext, raiseError, updateDebt, UpdateDebtValue } from '@/util';
import { find } from 'lodash';
import styles from './update-debt.module.scss';

enum Titles {
  name = 'Rename',
  type = 'Change Type',
}

enum SubmitButton {
  name = 'Rename',
  type = 'Change',
}

export default function UpdateDebtModal() {
  const { selectedDebt, debtList, localDebtList, handleUpdateLocalDebt, isUserAuthenticated, valueToUpdate, handleDebtList, handleSelectedDebt } = useContext(DebtContext);
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const title = useMemo(() => Titles[valueToUpdate], [valueToUpdate]);
  const submitButton = useMemo(() => SubmitButton[valueToUpdate], [valueToUpdate]);
  const currentDebtList = useMemo(() => (isUserAuthenticated ? debtList : localDebtList), [localDebtList, debtList, isUserAuthenticated]);
  const debtExist = useMemo(
    () =>
      find(currentDebtList, (debt) => {
        if (valueToUpdate === UpdateDebtValue.name) {
          return debt.name === value && debt.type === selectedDebt?.type;
        }

        return debt.type != '' && debt.name === selectedDebt?.name && debt.type === value;
      }),
    [currentDebtList, value, valueToUpdate, selectedDebt]
  );

  const handleHideModal = useCallback(() => {
    const closeButton = document.getElementById('update-debt-close-modal');

    setValue('');
    closeButton?.click();
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!selectedDebt || !value || debtExist) {
        return;
      }

      setIsLoading(true);

      try {
        const debt = await updateDebt({ ...selectedDebt, [valueToUpdate]: value.trim() });

        handleDebtList(debt);
      } catch (err) {
        raiseError(err);
      } finally {
        setIsLoading(false);
        handleSelectedDebt(null);
        handleHideModal();
      }
    },
    [selectedDebt, value, debtExist, valueToUpdate, handleDebtList, handleHideModal, handleSelectedDebt]
  );

  const handleLocalSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!selectedDebt || !value) {
        return;
      }

      setIsLoading(true);
      handleUpdateLocalDebt({ ...selectedDebt, [valueToUpdate]: value.trim() });
      handleHideModal();
      setIsLoading(false);
    },
    [handleHideModal, handleUpdateLocalDebt, selectedDebt, value, valueToUpdate]
  );

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setValue(value);
  }, []);

  return (
    <form
      id='update-debt-modal'
      className={`modal fade ${styles['modal-wrapper']}`}
      onSubmit={!isUserAuthenticated ? handleLocalSubmit : handleSubmit}
    >
      <div className='modal-dialog modal-dialog-centered'>
        <div className={`modal-content ${styles['modal-content-wrapper']}`}>
          <div className='modal-header border-0 pb-2'>
            <h5 className='modal-title'>{title}</h5>
            <i
              id='update-debt-close-modal'
              data-bs-dismiss='modal'
              className={`bi bi-x ${styles.close}`}
              aria-label='Close'
            ></i>
          </div>
          <div className={`modal-body text-center ${styles['modal-body-wrapper']}`}>
            {isLoading || !selectedDebt ? (
              <div
                className='spinner-border text-info'
                role='status'
              >
                <span className='visually-hidden'>Loading...</span>
              </div>
            ) : (
              <>
                <input
                  type='text'
                  className={`form-control ${debtExist && 'is-invalid'}`}
                  placeholder={selectedDebt[valueToUpdate].length ? selectedDebt[valueToUpdate] : 'Other'}
                  onChange={handleInputChange}
                  value={value}
                  maxLength={24}
                  disabled={isLoading}
                />
                <div className='invalid-feedback'>Debt already exist!</div>
              </>
            )}
          </div>
          <div className={`modal-footer border-0 ${styles['modal-footer-wrapper']}`}>
            <button
              type='button'
              className='btn btn-secondary'
              data-bs-dismiss='modal'
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='btn btn-primary'
              disabled={isLoading || debtExist != null || value.trim() === ''}
            >
              {submitButton}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
