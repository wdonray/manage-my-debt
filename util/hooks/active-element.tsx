import { useState, useEffect } from 'react';

export function TargetActiveElement() {
  const [active, setActive] = useState(document.activeElement);

  useEffect(() => {
    const handleFocusIn = () => {
      setActive(document.activeElement);
    };

    document.addEventListener('focusin', handleFocusIn);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, []);

  return active;
}
