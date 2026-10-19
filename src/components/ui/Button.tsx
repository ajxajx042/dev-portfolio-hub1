import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className = '',
  disabled,
  onClick,
  type = 'button',
}: ButtonProps) {
  const { isDark } = useTheme();

  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:shadow-indigo-500/25 focus:ring-indigo-500',
    secondary: isDark 
      ? 'bg-white/10 hover:bg-white/15 text-white border border-white/10 focus:ring-gray-500' 
      : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200 focus:ring-gray-500',
    outline: isDark 
      ? 'border-2 border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 focus:ring-indigo-500' 
      : 'border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
    ghost: isDark 
      ? 'text-gray-300 hover:bg-white/5 hover:text-white focus:ring-gray-500' 
      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500',
    danger: isDark 
      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 focus:ring-red-500' 
      : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm space-x-2',
    md: 'px-6 py-3 text-base space-x-2',
    lg: 'px-8 py-4 text-lg space-x-3',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <motion.button
      whileHover={{ scale: isLoading || disabled ? 1 : 1.02 }}
      whileTap={{ scale: isLoading || disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className={iconSizes[size]}>{icon}</span>
          )}
          <span>{children}</span>
          {icon && iconPosition === 'right' && (
            <span className={iconSizes[size]}>{icon}</span>
          )}
        </>
      )}
    </motion.button>
  );
}
