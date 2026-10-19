import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Zap, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  return (
    <footer className={`border-t ${isDark ? 'border-white/5 bg-[#020617]' : 'border-gray-200 bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">NexusTeam</span>
            </Link>
            <p className={`text-sm max-w-md mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('footer.desc')}
            </p>
            <div className="flex space-x-4">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className={`w-9 h-9 rounded-lg flex items-center justify-center transition ${
                  isDark ? 'bg-white/5 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10' : 'bg-gray-100 text-gray-500 hover:text-indigo-500 hover:bg-indigo-50'
                }`}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('footer.quicklinks')}</h4>
            <ul className="space-y-2">
              <li><Link to="/portfolio" className={`text-sm transition ${isDark ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-500'}`}>{t('nav.portfolio')}</Link></li>
              <li><Link to="/team" className={`text-sm transition ${isDark ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-500'}`}>{t('nav.team')}</Link></li>
              <li><Link to="/company" className={`text-sm transition ${isDark ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-500'}`}>{t('nav.company')}</Link></li>
              <li><Link to="/login" className={`text-sm transition ${isDark ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-500'}`}>{t('nav.signin')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('footer.services')}</h4>
            <ul className="space-y-2">
              <li><span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Full Stack Development</span></li>
              <li><span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Interior Design</span></li>
              <li><span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Data Analytics</span></li>
              <li><span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>UI/UX Design</span></li>
            </ul>
          </div>
        </div>

        <div className={`mt-12 pt-8 border-t ${isDark ? 'border-white/5' : 'border-gray-200'} flex flex-col md:flex-row justify-between items-center`}>
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>© 2026 NexusTeam. {t('footer.rights')}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className={`text-sm transition ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>{t('footer.privacy')}</a>
            <a href="#" className={`text-sm transition ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
