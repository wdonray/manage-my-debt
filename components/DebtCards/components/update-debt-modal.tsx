import { ChangeEvent, FormEvent, useCallback, useContext, useMemo, useState } from 'react';
import { DebtContext, raiseError, updateDebt } from '@/util';

enum Titles {
  name = 'Rename',
  type = 'Change Type',
}

enum SubmitButton {
  name = 'Rename',
  type = 'Change',
}

export default function UpdateDebtModal() {
  const { selectedDebt, handleUpdateLocalDebt, isUserAuthenticated, valueToUpdate, handleDebtList } = useContext(DebtContext);
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const title = useMemo(() => Titles[valueToUpdate], [valueToUpdate]);
  const submitButton = useMemo(() => SubmitButton[valueToUpdate], [valueToUpdate]);

  const handleHideModal = useCallback(() => {
    const closeButton = document.getElementById('update-debt-close-modal');

    setValue('');
    closeButton?.click();
  }, []);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedDebt || !value) {
      return;
    }

    setIsLoading(true);

    try {
      const debt = await updateDebt({ ...selectedDebt, [valueToUpdate]: value.trim() });

      handleDebtList(debt);
      handleHideModal();
    } catch (err) {
      raiseError(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDebt, value, valueToUpdate, handleHideModal, handleDebtList]);

  const handleLocalSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedDebt || !value) {
      return;
    }

    setIsLoading(true);
    handleUpdateLocalDebt({ ...selectedDebt, [valueToUpdate]: value.trim() });
    handleHideModal();
    setIsLoading(false);
  }, [handleHideModal, handleUpdateLocalDebt, selectedDebt, value, valueToUpdate]);

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setValue(value);
  }, []);

  if (!selectedDebt) {
    return null;
  }

  return (
    <form
      id='update-debt-modal'
      className='modal'
      onSubmit={!isUserAuthenticated ? handleLocalSubmit : handleSubmit}
    >
      <div className='modal-dialog modal-dialog-centered'>
        <div className='modal-content'>
          <div className='modal-header border-0 pb-2'>
            <h5 className='modal-title'>{title}</h5>
            <button
              type='button'
              id='update-debt-close-modal'
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
            />
          </div>
          <div className='modal-body text-center'>
            {
              isLoading ? (
                <div className='spinner-border text-info' role='status'>
                  <span className='visually-hidden'>Loading...</span>
                </div>
              ) : (
                <input
                  type='text'
                  className='form-control'
                  placeholder={selectedDebt[valueToUpdate].length ? selectedDebt[valueToUpdate] : 'Other'}
                  onChange={handleInputChange}
                  value={value}
                  maxLength={24}
                  disabled={isLoading}
                />
              )
            }

          </div>
          <div className='modal-footer border-0'>
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
              disabled={isLoading}
            >
              {submitButton}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}