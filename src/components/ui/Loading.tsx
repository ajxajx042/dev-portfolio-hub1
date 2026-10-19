import { motion } from 'framer-motion';
import { Loader2, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export function Loading({ size = 'md', text, fullScreen = false }: LoadingProps) {
  const { isDark } = useTheme();

  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className={`${sizes[size]} text-indigo-500`} />
      </motion.div>
      {text && (
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${
        isDark ? 'bg-[#020617]/80' : 'bg-white/80'
      } backdrop-blur-sm`}>
        {content}
      </div>
    );
  }

  return content;
}

export function Skeleton({ className = '' }: { className?: string }) {
  const { isDark } = useTheme();
  
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={`rounded-lg ${isDark ? 'bg-white/10' : 'bg-gray-200'} ${className}`}
    />
  );
}

export function Alert({ 
  type = 'info', 
  title, 
  message, 
  onClose 
}: { 
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
}) {
  const { isDark } = useTheme();

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const colors = {
    success: isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200',
    error: isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200',
    warning: isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200',
    info: isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200',
  };

  const textColors = {
    success: isDark ? 'text-green-400' : 'text-green-800',
    error: isDark ? 'text-red-400' : 'text-red-800',
    warning: isDark ? 'text-amber-400' : 'text-amber-800',
    info: isDark ? 'text-blue-400' : 'text-blue-800',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-start space-x-3 p-4 rounded-xl border ${colors[type]}`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        {title && (
          <h4 className={`font-semibold mb-1 ${textColors[type]}`}>{title}</h4>
        )}
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
        >
          ×
        </button>
      )}
    </motion.div>
  );
}
