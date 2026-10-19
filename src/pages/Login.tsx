import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight, Shield } from 'lucide-react';
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
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Security: Rate limiting
    if (!securityService.checkRateLimit('login', 5, 60000)) {
      setError('Too many login attempts. Please wait 60 seconds.');
      securityService.recordSecurityEvent('failed_login', 'high', `Rate limit exceeded for ${email}`);
      loggingService.logSecurity(`Rate limit exceeded for login attempt: ${email}`, 'warning');
      setIsLoading(false);
      return;
    }

    // Security: Input sanitization
    const cleanEmail = securityService.sanitizeInput(email);
    
    // Security: Email validation
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
      
      // Log successful authentication
      loggingService.logAuth(`User logged in: ${cleanEmail}`, undefined, true);
      securityService.recordSecurityEvent('login', 'low', `Successful login: ${cleanEmail}`);
      
      // Navigate based on user role (will be determined after login)
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Invalid credentials');
      loggingService.logAuth(`Failed login attempt: ${cleanEmail}`, undefined, false);
      securityService.recordSecurityEvent('failed_login', 'medium', `Failed login attempt: ${cleanEmail}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-500/5'}`} />
        <div className={`absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'}`} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className={`rounded-3xl p-8 md:p-10 ${isDark ? 'glass' : 'bg-white border border-gray-200 shadow-xl'}`}>
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('login.title')}</h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('login.subtitle')}</p>
          </div>

          {/* Role Selection */}
          <div className="flex space-x-2 mb-6">
            {(['viewer', 'company', 'admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  role === r
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : isDark ? 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10' : 'bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`text-sm mb-1 block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('login.email')}</label>
              <div className="relative">
                <Mail className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl transition focus:outline-none focus:border-indigo-500 ${
                    isDark ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`text-sm mb-1 block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('login.password')}</label>
              <div className="relative">
                <Lock className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-11 py-3 rounded-xl transition focus:outline-none focus:border-indigo-500 ${
                    isDark ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 text-indigo-500" />
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('login.remember')}</span>
              </label>
              <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300">{t('login.forgot')}</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><span>{t('login.submit')}</span><ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          {/* Security Badge */}
          <div className={`mt-6 flex items-center justify-center space-x-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <Shield className="w-4 h-4 text-green-400" />
            <span>256-bit SSL Encrypted • CSRF Protected</span>
          </div>

          <div className={`flex items-center my-6`}>
            <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
            <span className={`px-4 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>or</span>
            <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className={`flex items-center justify-center space-x-2 py-3 rounded-xl text-sm transition ${
              isDark ? 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10' : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/></svg>
              <span>Google</span>
            </button>
            <button className={`flex items-center justify-center space-x-2 py-3 rounded-xl text-sm transition ${
              isDark ? 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10' : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              <span>GitHub</span>
            </button>
          </div>

          <p className={`text-center text-sm mt-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('login.noaccount')}{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">{t('login.signup')}</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
