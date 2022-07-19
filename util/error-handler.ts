import { toast } from 'react-toastify';

export function raiseError(error: Error) {
  if (!error || !toast) {
    return;
  }

  toast.error(error.message);
} 