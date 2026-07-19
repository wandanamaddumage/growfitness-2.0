import React from 'react';

interface ButtonProps {
  text?: string;
  color?: string;
  backgroundColor?: string;
  boxShadowColor?: string;
  href?: string;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  children?: React.ReactNode;
  isLoading?: boolean;
  isSubmitting?: boolean;
}

const SharedButton: React.FC<ButtonProps> = ({
  text,
  color = 'white',
  backgroundColor = 'var(--gf-green, #23b685)',
  boxShadowColor = 'var(--gf-green-deep, #1a8a5f)',
  href = '/free-session',
  className = '',
  icon,
  iconPosition = 'right',
  onClick,
  size = 'md',
  type = 'button',
  disabled = false,
  children,
  isLoading = false,
  isSubmitting = false,
}) => {
  const sizeStyles = {
    sm: { textSize: 'text-sm', padding: 'px-4 py-2', shadow: '0 4px 0' },
    md: { textSize: 'text-[17px]', padding: 'px-9 py-[18px]', shadow: '0 8px 0' },
    lg: { textSize: 'text-lg', padding: 'px-10 py-5', shadow: '0 10px 0' },
    xl: { textSize: 'text-xl', padding: 'px-12 py-6', shadow: '0 12px 0' },
    custom: { textSize: '', padding: '', shadow: 'none' },
  };

  const selectedSize = sizeStyles[size];

  const buttonStyles = {
    color: color,
    background: backgroundColor,
    boxShadow: `${selectedSize.shadow} ${boxShadowColor}`,
  };

  const content = children || (
    <>
      {icon && iconPosition === 'left' && icon}
      <span>{text}</span>
      {icon && iconPosition === 'right' && icon}
    </>
  );

  const isDisabled = disabled || isLoading || isSubmitting;
 const baseClassName = `gf-btn-pop ${selectedSize.textSize} ${selectedSize.padding} inline-flex items-center gap-2 transition-all hover:translate-y-0.5 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  // Render as button if onClick is provided OR if type is submit (for form submission)
  if (onClick || type === 'submit') {
    return (
      <button
        onClick={onClick}
        className={baseClassName}
        style={buttonStyles}
        type={type}
        disabled={isDisabled}
      >
        {content}
      </button>
    );
  }

  return (
    <a
      href={href}
      className={baseClassName}
      style={buttonStyles}
    >
      {content}
    </a>
  );
};

export default SharedButton;