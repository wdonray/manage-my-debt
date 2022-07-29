import { toast } from 'react-toastify';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function raiseError(error: any) {
  if (!error || !toast) {
    return;
  }

  toast.error(error?.message);
} 