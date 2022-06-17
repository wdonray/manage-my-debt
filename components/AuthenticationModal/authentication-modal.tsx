import './authentication-modal.module.scss';
import { Authenticator } from '@aws-amplify/ui-react';

export default function AuthenticationModal() {
  return (
    <div id='authentication-modal' className='modal'>
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          <div className='modal-header'>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
            />
          </div>
          <div className='modal-body'>
            <Authenticator>
              <div className='d-flex flex-column justify-content-center align-items-center'>
                <h1>Welcome</h1>
                <h4>Manage My Debt</h4>
                <button
                  type='button'
                  className='btn btn-primary'
                  data-bs-dismiss='modal'
                >
                  Begin!
                </button>
              </div>
            </Authenticator>
          </div>
        </div>
      </div>
    </div >
  );
}
