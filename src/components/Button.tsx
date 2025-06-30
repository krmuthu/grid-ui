import React from 'react';

type ButtonProps = {
  variant?: 'primar' | 'secondary' | 'outline' | 'ghost';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export function Button({
  variant = 'primar',
  children,
  onClick,
  className = '',
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primar: 'bg-primar text-white hover:bg-blue-600 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-500',
    ghost: 'text-blue-500 hover:bg-blue-50 focus:ring-blue-500',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
