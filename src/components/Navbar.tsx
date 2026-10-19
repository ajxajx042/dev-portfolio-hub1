import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { loggingService } from '../services/LoggingService';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.portfolio'), path: '/portfolio' },
    { name: t('nav.team'), path: '/team' },
    { name: t('nav.company'), path: '/company' },
    { name: 'Upload', path: '/upload' },
    { name: 'Profile', path: '/profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = (path: string) => {
    loggingService.logNavigation(path, user?.id);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
      isDark ? 'glass' : 'bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2" onClick={() => handleNavClick('/')}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">NexusTeam</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                    : isDark ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}
                >
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{user?.name}</span>
                  <ChevronDown className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute right-0 mt-2 w-48 rounded-lg py-2 shadow-xl ${
                        isDark ? 'glass' : 'bg-white border border-gray-200'
                      }`}
                    >
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => { setShowDropdown(false); handleNavClick('/admin'); }}
                          className={`block px-4 py-2 text-sm ${isDark ? 'text-gray-300 hover:bg-white/5 hover:text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                          {t('nav.dashboard')}
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => { setShowDropdown(false); }}
                        className={`block px-4 py-2 text-sm ${isDark ? 'text-gray-300 hover:bg-white/5 hover:text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/upload"
                        onClick={() => { setShowDropdown(false); }}
                        className={`block px-4 py-2 text-sm ${isDark ? 'text-gray-300 hover:bg-white/5 hover:text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        Upload Center
                      </Link>
                      <button
                        onClick={() => { 
                          logout(); 
                          setShowDropdown(false);
                          loggingService.logAuth('User logged out', user?.id, true);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${isDark ? 'text-red-400 hover:bg-white/5' : 'text-red-500 hover:bg-red-50'}`}
                      >
                        {t('nav.signout')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 text-sm font-medium transition ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  {t('nav.signin')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
                >
                  {t('nav.getstarted')}
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-t ${isDark ? 'glass border-white/5' : 'bg-white border-gray-200'}`}
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => { setIsOpen(false); handleNavClick(link.path); }}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                    isActive(link.path)
                      ? isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                      : isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className={`pt-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'} space-y-2`}>
                {isAuthenticated ? (
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className={`w-full px-4 py-2 text-sm rounded-lg ${isDark ? 'text-red-400 hover:bg-white/5' : 'text-red-500 hover:bg-red-50'}`}
                  >
                    {t('nav.signout')}
                  </button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)} className={`block px-4 py-2 text-sm rounded-lg ${isDark ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'}`}>
                      {t('nav.signin')}
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-center">
                      {t('nav.getstarted')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
