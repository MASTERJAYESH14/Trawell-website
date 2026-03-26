import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-full font-semibold transition-all duration-200 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-trawell-orange text-white hover:bg-orange-700 shadow-md hover:shadow-lg",
    secondary: "bg-trawell-green text-white hover:bg-green-900 shadow-md",
    outline: "border-2 border-trawell-orange text-trawell-orange hover:bg-trawell-orange hover:text-white",
    ghost: "text-trawell-green hover:bg-trawell-green/10",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};