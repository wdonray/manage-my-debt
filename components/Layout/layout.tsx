import { ReactNode } from 'react';
import { Header } from '@/components';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className='container'>
        {children}
      </div>
    </>
  );
}