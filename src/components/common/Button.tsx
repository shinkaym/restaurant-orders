import React from 'react';
import clsx from 'clsx';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

export default function Button({
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  children,
  icon,
  iconPosition = 'right',
}: ButtonProps) {
  const buttonClass = clsx('btn', `btn-${variant}`, `btn-${size}`, className);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClass}
    >
      {icon && iconPosition === 'left' && <i className={`fas fa-${icon}`}></i>}
      {children}
      {icon && iconPosition === 'right' && <i className={`fas fa-${icon}`}></i>}
    </button>
  );
}
