import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../components/ui/Toast';
import { Button, Input, Card } from '../components/ui';
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight, Shield, User, Building2 } from 'lucide-react';
import { loggingService } from '../services/LoggingService';
import { securityService } from '../services/SecurityService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'viewer' | 'company' | 'admin'>('viewer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!securityService.checkRateLimit('login', 5, 60000)) {
      setError('Too many login attempts. Please wait 60 seconds.');
      securityService.recordSecurityEvent('failed_login', 'high', `Rate limit exceeded for ${email}`);
      loggingService.logSecurity(`Rate limit exceeded for login attempt: ${email}`, 'warning');
      setIsLoading(false);
      return;
    }

    const cleanEmail = securityService.sanitizeInput(email);
    
    if (!securityService.validateEmail(cleanEmail)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError('Please enter your password');
      setIsLoading(false);
      return;
    }

    try {
      await login(cleanEmail, password);
      
      loggingService.logAuth(`User logged in: ${cleanEmail}`, undefined, true);
      securityService.recordSecurityEvent('login', 'low', `Successful login: ${cleanEmail}`);
      
      addToast({
        type: 'success',
        title: 'Welcome back!',
        message: 'You have successfully signed in.',
      });
      
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Invalid credentials');
      loggingService.logAuth(`Failed login attempt: ${cleanEmail}`, undefined, false);
      securityService.recordSecurityEvent('failed_login', 'medium', `Failed login attempt: ${cleanEmail}`);
      
      addToast({
        type: 'error',
        title: 'Login failed',
        message: error.message || 'Invalid credentials. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const roleIcons = {
    viewer: <User className="w-4 h-4" />,
    company: <Building2 className="w-4 h-4" />,
    admin: <Shield className="w-4 h-4" />,
  };

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-500/5'}`} />
        <div className={`absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'}`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-3xl ${isDark ? 'bg-pink-500/5' : 'bg-pink-500/3'}`} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <Card className="p-8 md:p-10">
          {/* Logo */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-center mb-8"
          >
            <div className="relative inline-block">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('login.title')}</h1>
            <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('login.subtitle')}</p>
          </motion.div>

          {/* Role Selection */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {(['viewer', 'company', 'admin'] as const).map((r) => (
              <motion.button
                key={r}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRole(r)}
                className={`flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-medium transition-all ${
                  role === r
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                    : isDark ? 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10' : 'bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {roleIcons[r]}
                <span className="capitalize">{r}</span>
              </motion.button>
            ))}
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-3"
            >
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-400 text-xs">!</span>
              </div>
              <p className="text-sm text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              label={t('login.email')}
              placeholder="you@example.com"
              icon={<Mail className="w-5 h-5" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <div>
              <Input
                type={showPassword ? 'text' : 'password'}
                label={t('login.password')}
                placeholder="••••••••"
                icon={<Lock className="w-5 h-5" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 bottom-3 ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                  isDark ? 'border-white/20 group-hover:border-indigo-500' : 'border-gray-300 group-hover:border-indigo-500'
                }`}>
                  <input type="checkbox" className="sr-only" />
                </div>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('login.remember')}</span>
              </label>
              <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                {t('login.forgot')}
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              icon={!isLoading ? <ArrowRight className="w-5 h-5" /> : undefined}
              iconPosition="right"
            >
              {t('login.submit')}
            </Button>
          </form>

          {/* Security Badge */}
          <div className={`mt-6 flex items-center justify-center space-x-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <Shield className="w-4 h-4 text-green-500" />
            <span>256-bit SSL Encrypted • CSRF Protected</span>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className={`absolute inset-0 flex items-center`}>
              <div className={`w-full border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-4 ${isDark ? 'bg-[#0f172a] text-gray-500' : 'bg-white text-gray-400'}`}>or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" size="md" fullWidth icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            }>
              Google
            </Button>
            <Button variant="secondary" size="md" fullWidth icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            }>
              GitHub
            </Button>
          </div>

          {/* Register Link */}
          <p className={`text-center text-sm mt-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('login.noaccount')}{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              {t('login.signup')}
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
