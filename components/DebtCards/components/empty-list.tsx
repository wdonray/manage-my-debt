import Image from 'next/image';
import styles from './empty-list.module.scss';

interface EmptyListProps {
  isListEmpty: boolean
}

export default function EmptyList({
  isListEmpty,
}: EmptyListProps) {
  if (!isListEmpty) {
    return null;
  }

  return (
    <div className='d-flex flex-column justify-content-center align-items-center text-center mt-5'>
      <div>
        <Image
          src='/splash-screen.jpg'
          alt='splash-screen'
          width={750}
          height={500}
          quality={100}
          priority
        />
      </div>
      <div className='d-flex flex-column align-items-center'>
        <h1 className='display-6 fw-bold'>Start adding items!</h1>
        <span className='fs-4 fw-light'>There are no items here, lets start by adding some debt</span>
        <button 
          type='button' 
          id={styles['get-started']}
          className='btn btn-primary btn-lg rounded-pill mt-4'
          data-bs-toggle='offcanvas'
          data-bs-target='#new-debt-area'
        >
          Get Started
        </button>
      </div>
    </div>
  );
}