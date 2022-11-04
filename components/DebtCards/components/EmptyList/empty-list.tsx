interface EmptyListProps {
  isListEmpty: boolean;
}

export default function EmptyList({ isListEmpty }: EmptyListProps) {
  if (!isListEmpty) {
    return null;
  }

  return (
    <div className='d-flex flex-column justify-content-center align-items-center text-center mt-5'>
      <div className='d-flex flex-column align-items-center'>
        <h1 className='display-6 fw-bold'>Start adding items!</h1>
        <span className='fs-4 fw-light'>There are no items here, lets start by adding some debt</span>
      </div>
    </div>
  );
}
