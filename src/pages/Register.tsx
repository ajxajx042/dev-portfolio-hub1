import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../components/ui/Toast';
import { Button, Input, Card } from '../components/ui';
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight, User, Building2, Shield, CheckCircle2 } from 'lucide-react';
import { loggingService } from '../services/LoggingService';
import { securityService } from '../services/SecurityService';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'viewer' | 'company'>('viewer');
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const passwordValidation = securityService.validatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!securityService.checkRateLimit('register', 3, 120000)) {
      setError('Too many registration attempts. Please wait.');
      securityService.recordSecurityEvent('suspicious', 'medium', 'Registration rate limit exceeded');
      setIsLoading(false);
      return;
    }

    const cleanName = securityService.sanitizeInput(name);
    const cleanEmail = securityService.sanitizeInput(email);

    if (!cleanName || !cleanEmail || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (!securityService.validateEmail(cleanEmail)) {
      setError('Please enter a valid email');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    try {
      await register(cleanEmail, password, cleanName);
      
      loggingService.logAuth(`New user registered: ${cleanEmail}`, undefined, true);
      loggingService.logUserAction('New account created', { name: cleanName, email: cleanEmail });
      securityService.recordSecurityEvent('login', 'low', `New account registered: ${cleanEmail}`);
      
      addToast({
        type: 'success',
        title: 'Welcome!',
        message: 'Your account has been created successfully.',
      });
      
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      addToast({
        type: 'error',
        title: 'Registration failed',
        message: err.message || 'Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'}`} />
        <div className={`absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-500/5'}`} />
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('register.title')}</h1>
            <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('register.subtitle')}</p>
          </motion.div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRole('viewer')}
              className={`flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-medium transition-all ${
                role === 'viewer'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                  : isDark ? 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10' : 'bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Viewer</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRole('company')}
              className={`flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-medium transition-all ${
                role === 'company'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                  : isDark ? 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10' : 'bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Company</span>
            </motion.button>
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
            {role === 'company' && (
              <Input
                type="text"
                label={t('register.company')}
                placeholder="Your Company"
                icon={<Building2 className="w-5 h-5" />}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            )}

            <Input
              type="text"
              label={t('register.name')}
              placeholder="John Doe"
              icon={<User className="w-5 h-5" />}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              type="email"
              label={t('login.email')}
              placeholder="you@example.com"
              icon={<Mail className="w-5 h-5" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                label={t('login.password')}
                placeholder="Min. 8 characters"
                icon={<Lock className="w-5 h-5" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 bottom-3 ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Strength */}
            {password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <div className="flex space-x-1">
                  {[1, 2, 3, 4].map((level) => (
                    <motion.div
                      key={level}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className={`h-1.5 flex-1 rounded-full origin-left transition-all ${
                        passwordValidation.strength >= level * 25
                          ? level <= 1 ? 'bg-red-400' : level <= 2 ? 'bg-amber-400' : level <= 3 ? 'bg-blue-400' : 'bg-green-400'
                          : isDark ? 'bg-white/10' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                {passwordValidation.issues.length > 0 && (
                  <div className={`text-xs space-y-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {passwordValidation.issues.map((issue, i) => (
                      <div key={i} className="flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              icon={!isLoading ? <ArrowRight className="w-5 h-5" /> : undefined}
              iconPosition="right"
            >
              {t('register.submit')}
            </Button>
          </form>

          {/* Security Badge */}
          <div className={`mt-6 flex items-center justify-center space-x-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <Shield className="w-4 h-4 text-green-500" />
            <span>Protected by enterprise-grade security</span>
          </div>

          {/* Login Link */}
          <p className={`text-center text-sm mt-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('register.hasaccount')}{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              {t('register.signin')}
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
