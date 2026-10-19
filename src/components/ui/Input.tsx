import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, iconPosition = 'left', label, error, helperText, fullWidth = true, className = '', ...props }, ref) => {
    const { isDark } = useTheme();

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full rounded-xl border transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-0
              ${icon && iconPosition === 'left' ? 'pl-11' : 'pl-4'}
              ${icon && iconPosition === 'right' ? 'pr-11' : 'pr-4'}
              py-3 text-sm
              ${error
                ? isDark
                  ? 'border-red-500/50 bg-red-500/5 text-white placeholder-red-300/50 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-red-300 bg-red-50 text-gray-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500/20'
                : isDark
                  ? 'border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20 hover:border-white/20'
                  : 'border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20 hover:border-gray-300'
              }
              ${className}
            `}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <div className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {icon}
            </div>
          )}
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
        {helperText && !error && (
          <p className={`mt-2 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
