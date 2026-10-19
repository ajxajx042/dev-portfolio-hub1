import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../components/ui/Toast';
import { Shield, Lock, Mail } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark } = useTheme();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      
      // Check if user is admin (we'll check after login completes)
      // For now, we'll navigate and let the admin layout handle the check
      addToast({
        type: 'success',
        title: 'Welcome',
        message: 'Login successful',
      });
      navigate('/admin');
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Login Failed',
        message: 'Invalid credentials. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${
      isDark ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-50'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md ${
          isDark ? 'bg-slate-800/50' : 'bg-white'
        } backdrop-blur-xl rounded-2xl shadow-2xl p-8 border ${
          isDark ? 'border-slate-700' : 'border-slate-200'
        }`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-4"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Admin Access
          </h1>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Restricted area - Admin credentials required
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Admin Email
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full pl-11 pr-4 py-3 rounded-lg border ${
                  isDark 
                    ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500' 
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition`}
                placeholder="admin@nexusteam.com"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full pl-11 pr-4 py-3 rounded-lg border ${
                  isDark 
                    ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500' 
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition`}
                placeholder="Enter admin password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </span>
            ) : (
              'Access Admin Panel'
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-slate-900/50 border border-slate-700' : 'bg-slate-50 border border-slate-200'}`}>
          <div className="flex items-start space-x-3">
            <Shield className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Security Notice
              </p>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                All admin actions are logged and monitored. Unauthorized access attempts will be reported.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Main Site */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className={`text-sm ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'} transition`}
          >
            ← Back to main site
          </button>
        </div>
      </motion.div>
    </div>
  );
}
