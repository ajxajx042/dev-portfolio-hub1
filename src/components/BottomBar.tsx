import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Sun, Moon, Globe, Check, X } from 'lucide-react';
import { useState } from 'react';
import type { Language } from '../context/LanguageContext';

const languages: { code: Language; name: string; flag: string; native: string; speakers: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧', native: 'English', speakers: '1.5B speakers' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', native: '中文', speakers: '1.1B speakers' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', native: 'Español', speakers: '559M speakers' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', native: 'हिन्दी', speakers: '602M speakers' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', native: 'العربية', speakers: '422M speakers' },
];

export default function BottomBar() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [showLangPicker, setShowLangPicker] = useState(false);

  const currentLang = languages.find(l => l.code === language);

  return (
    <>
      {/* Language Picker Modal */}
      <AnimatePresence>
        {showLangPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLangPicker(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-2xl overflow-hidden shadow-2xl ${
                isDark ? 'bg-[#1e293b] border border-white/10' : 'bg-white border border-gray-200'
              }`}
            >
              {/* Header */}
              <div className={`px-6 py-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'} flex items-center justify-between`}>
                <div className="flex items-center space-x-3">
                  <Globe className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t('lang.title')}
                  </h3>
                </div>
                <button 
                  onClick={() => setShowLangPicker(false)}
                  className={`p-1 rounded-lg transition ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Language List */}
              <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => { setLanguage(lang.code); setShowLangPicker(false); }}
                    className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all ${
                      language === lang.code
                        ? isDark 
                          ? 'bg-indigo-500/20 border-2 border-indigo-500/50 shadow-lg shadow-indigo-500/10' 
                          : 'bg-indigo-50 border-2 border-indigo-300 shadow-md shadow-indigo-100'
                        : isDark 
                          ? 'hover:bg-white/5 border-2 border-transparent' 
                          : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <span className="text-3xl">{lang.flag}</span>
                    <div className="text-left flex-1">
                      <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {lang.native}
                      </div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {lang.name}
                      </div>
                      <div className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {lang.speakers}
                      </div>
                    </div>
                    {language === lang.code && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <div className={`px-6 py-3 border-t ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                <p className={`text-xs text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  🌍 Top 5 most spoken languages worldwide
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDark 
          ? 'bg-[#0f172a]/95 border-t border-white/10' 
          : 'bg-white border-t border-gray-200 shadow-md'
      } backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`flex items-center space-x-3 px-5 py-2.5 rounded-xl transition-all ${
                isDark 
                  ? 'hover:bg-white/10 text-gray-300 bg-white/5' 
                  : 'hover:bg-gray-100 text-gray-700 bg-gray-50'
              }`}
            >
              <motion.div
                animate={{ rotate: isDark ? 0 : 180 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  isDark ? 'bg-indigo-500/20' : 'bg-amber-100'
                }`}
              >
                {isDark ? (
                  <Moon className="w-5 h-5 text-indigo-400" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-500" />
                )}
              </motion.div>
              <div className="text-left hidden sm:block">
                <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {isDark ? t('theme.dark') : t('theme.light')}
                </div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {isDark ? 'Moon' : 'Sun'} mode
                </div>
              </div>
            </motion.button>

            {/* Center: Status Indicator */}
            <div className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isDark ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                All systems operational
              </span>
            </div>

            {/* Right: Language Selector */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLangPicker(true)}
              className={`flex items-center space-x-3 px-5 py-2.5 rounded-xl transition-all ${
                isDark 
                  ? 'hover:bg-white/10 text-gray-300 bg-white/5' 
                  : 'hover:bg-gray-100 text-gray-700 bg-gray-50'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xl ${
                isDark ? 'bg-purple-500/20' : 'bg-purple-100'
              }`}>
                {currentLang?.flag}
              </div>
              <div className="text-left hidden sm:block">
                <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {currentLang?.native}
                </div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {currentLang?.name}
                </div>
              </div>
              <span className="sm:hidden text-xl">{currentLang?.flag}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
}
