import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function Card({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md',
  onClick 
}: CardProps) {
  const { isDark } = useTheme();

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const baseStyles = `
    rounded-2xl transition-all duration-300
    ${isDark 
      ? 'bg-white/5 border border-white/10 backdrop-blur-sm' 
      : 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
    }
    ${paddings[padding]}
    ${className}
  `;

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className={`${baseStyles} cursor-pointer ${
          isDark 
            ? 'hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-indigo-500/10' 
            : 'hover:shadow-lg hover:border-gray-300'
        }`}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseStyles} onClick={onClick}>
      {children}
    </div>
  );
}
