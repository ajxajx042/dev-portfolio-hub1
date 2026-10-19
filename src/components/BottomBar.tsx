import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Sun, Moon, Globe, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { Language } from '../context/LanguageContext';

const languages: { code: Language; name: string; flag: string; native: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧', native: 'English' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', native: '中文' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', native: 'Español' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', native: 'العربية' },
];

export default function BottomBar() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { language, setLanguage, languageName, t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-2xl p-6 ${
                isDark ? 'bg-[#1e293b] border border-white/10' : 'bg-white border border-gray-200'
              } shadow-2xl`}
            >
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('lang.title')} / {t('lang.title')}
              </h3>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setShowLangPicker(false); }}
                    className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all ${
                      language === lang.code
                        ? isDark ? 'bg-indigo-500/20 border border-indigo-500/30' : 'bg-indigo-50 border border-indigo-200'
                        : isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <div className="text-left flex-1">
                      <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {lang.native}
                      </div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {lang.name}
                      </div>
                    </div>
                    {language === lang.code && (
                      <div className="w-3 h-3 rounded-full bg-indigo-500" />
                    )}
                  </button>
                ))}
              </div>
              <p className={`text-xs mt-4 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Top 5 most spoken languages worldwide
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isDark 
          ? 'bg-[#0f172a]/95 border-t border-white/5' 
          : 'bg-white/95 border-t border-gray-200'
      } backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Collapsed view */}
          <div className="flex items-center justify-between h-14">
            {/* Left: Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isDark ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <motion.div
                animate={{ rotate: isDark ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {isDark ? (
                  <Moon className="w-5 h-5 text-indigo-400" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-500" />
                )}
              </motion.div>
              <span className="text-sm font-medium hidden sm:inline">
                {isDark ? t('theme.dark') : t('theme.light')}
              </span>
            </button>

            {/* Center: Status */}
            <div className={`hidden md:flex items-center space-x-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>All systems operational</span>
            </div>

            {/* Right: Language Selector */}
            <button
              onClick={() => setShowLangPicker(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isDark ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Globe className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium hidden sm:inline">
                {currentLang?.flag} {currentLang?.native}
              </span>
              <span className="text-sm font-medium sm:hidden">
                {currentLang?.flag}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
