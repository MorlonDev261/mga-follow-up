'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import "./styles.css";

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function RippleButton({ children, className, ...props }: RippleButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const createRipple = (e: React.MouseEvent) => {
    const button = btnRef.current;
    if (!button) return;

    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const rect = button.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.className = 'ripple';

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) ripple.remove();

    button.appendChild(circle);
  };

  return (
    <button
      {...props}
      ref={btnRef}
      onClick={(e) => {
        createRipple(e);
        props.onClick?.(e);
      }}
      className={cn('relative overflow-hidden', className)}
    >
      {children}
    </button>
  );
}
