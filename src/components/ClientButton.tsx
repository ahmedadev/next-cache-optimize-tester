'use client';

import { ReactNode } from 'react';

interface ClientButtonProps {
  onClick: () => void;
  className?: string;
  children: ReactNode;
}

export default function ClientButton({ onClick, className, children }: ClientButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
} 