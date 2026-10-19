import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight, User, Building2, Shield } from 'lucide-react';
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
  const navigate = useNavigate();

  const passwordValidation = securityService.validatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Security: Rate limiting
    if (!securityService.checkRateLimit('register', 3, 120000)) {
      setError('Too many registration attempts. Please wait.');
      securityService.recordSecurityEvent('suspicious', 'medium', 'Registration rate limit exceeded');
      setIsLoading(false);
      return;
    }

    // Security: Input sanitization
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

    await new Promise(resolve => setTimeout(resolve, 1000));

    const success = register(cleanName, cleanEmail, password, role);
    if (success) {
      loggingService.logAuth(`New user registered: ${cleanEmail} (${role})`, undefined, true);
      loggingService.logUserAction('New account created', { name: cleanName, email: cleanEmail, role });
      securityService.recordSecurityEvent('login', 'low', `New account registered: ${cleanEmail}`);
      securityService.createSession(cleanEmail);
      navigate('/');
    } else {
      setError('Registration failed');
    }
    setIsLoading(false);
  };

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'}`} />
        <div className={`absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-500/5'}`} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className={`rounded-3xl p-8 md:p-10 ${isDark ? 'glass' : 'bg-white border border-gray-200 shadow-xl'}`}>
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('register.title')}</h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('register.subtitle')}</p>
          </div>

          <div className="flex space-x-2 mb-6">
            <button onClick={() => setRole('viewer')} className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${role === 'viewer' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : isDark ? 'bg-white/5 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-700'}`}>
              <User className="w-4 h-4" /><span>Viewer</span>
            </button>
            <button onClick={() => setRole('company')} className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${role === 'company' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : isDark ? 'bg-white/5 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-700'}`}>
              <Building2 className="w-4 h-4" /><span>Company</span>
            </button>
          </div>

          {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {role === 'company' && (
              <div>
                <label className={`text-sm mb-1 block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('register.company')}</label>
                <div className="relative">
                  <Building2 className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Your Company"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl transition focus:outline-none focus:border-indigo-500 ${isDark ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'}`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className={`text-sm mb-1 block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('register.name')}</label>
              <div className="relative">
                <User className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl transition focus:outline-none focus:border-indigo-500 ${isDark ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'}`}
                />
              </div>
            </div>

            <div>
              <label className={`text-sm mb-1 block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('login.email')}</label>
              <div className="relative">
                <Mail className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl transition focus:outline-none focus:border-indigo-500 ${isDark ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'}`}
                />
              </div>
            </div>

            <div>
              <label className={`text-sm mb-1 block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('login.password')}</label>
              <div className="relative">
                <Lock className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters"
                  className={`w-full pl-11 pr-11 py-3 rounded-xl transition focus:outline-none focus:border-indigo-500 ${isDark ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {password && (
              <div className="space-y-2">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div key={level} className={`h-1.5 flex-1 rounded-full transition-all ${passwordValidation.strength >= level * 25 ? level <= 1 ? 'bg-red-400' : level <= 2 ? 'bg-amber-400' : level <= 3 ? 'bg-blue-400' : 'bg-green-400' : isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                  ))}
                </div>
                {passwordValidation.issues.length > 0 && (
                  <div className={`text-xs space-y-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {passwordValidation.issues.map((issue, i) => (
                      <div key={i}>• {issue}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>{t('register.submit')}</span><ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <div className={`mt-6 flex items-center justify-center space-x-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <Shield className="w-4 h-4 text-green-400" />
            <span>Protected by enterprise-grade security</span>
          </div>

          <p className={`text-center text-sm mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('register.hasaccount')}{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">{t('register.signin')}</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
