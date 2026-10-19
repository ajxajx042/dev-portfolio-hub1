import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Code2, Palette, BarChart3, Users, Star, TrendingUp, Globe } from 'lucide-react';
import { useEffect } from 'react';
import { loggingService } from '../services/LoggingService';

const stats = [
  { icon: Users, label: '24+', sublabel: 'team.members' },
  { icon: Star, label: '150+', sublabel: 'team.projects' },
  { icon: TrendingUp, label: '98%', sublabel: 'team.satisfaction' },
  { icon: Globe, label: '12', sublabel: 'team.countries' },
];

const services = [
  {
    icon: Code2,
    titleKey: 'services.dev',
    descKey: 'services.dev.desc',
    color: 'from-blue-500 to-cyan-500',
    link: '/portfolio/developers',
  },
  {
    icon: Palette,
    titleKey: 'services.design',
    descKey: 'services.design.desc',
    color: 'from-purple-500 to-pink-500',
    link: '/portfolio/interior',
  },
  {
    icon: BarChart3,
    titleKey: 'services.data',
    descKey: 'services.data.desc',
    color: 'from-amber-500 to-orange-500',
    link: '/portfolio/data',
  },
];

export default function Home() {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    loggingService.logNavigation('Home', undefined);
  }, []);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-500/10'}`} />
          <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${isDark ? 'bg-purple-500/20' : 'bg-purple-500/10'}`} style={{ animationDelay: '1s' }} />
          <div className={`absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl animate-pulse ${isDark ? 'bg-pink-500/10' : 'bg-pink-500/5'}`} style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-8 ${isDark ? 'glass-light' : 'bg-white/80 border border-gray-200'}`}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('hero.available')}</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className={isDark ? 'text-white' : 'text-gray-900'}>{t('hero.title1')}</span>
              <br />
              <span className="gradient-text">{t('hero.title2')}</span>
            </h1>

            <p className={`text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/portfolio"
                className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-semibold hover:shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 flex items-center space-x-2"
              >
                <span>{t('hero.cta1')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/team"
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  isDark ? 'glass-light text-white hover:bg-white/10' : 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {t('hero.cta2')}
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {stats.map((stat, i) => (
              <div key={i} className={`rounded-xl p-6 text-center transition ${isDark ? 'glass-light hover:bg-white/10' : 'bg-white border border-gray-100 shadow-sm hover:shadow-md'}`}>
                <stat.icon className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                <div className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.label}</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.sublabel}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('services.title').split(' ')[0]} <span className="gradient-text">{t('services.title').split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('services.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <Link to={service.link} className="group block h-full">
                  <div className={`rounded-2xl p-8 h-full transition-all duration-500 hover:-translate-y-2 ${
                    isDark 
                      ? 'glass-light hover:bg-white/10 hover:shadow-2xl hover:shadow-indigo-500/10' 
                      : 'bg-white border border-gray-100 shadow-sm hover:shadow-xl'
                  }`}>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <service.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t(service.titleKey)}</h3>
                    <p className={`leading-relaxed mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t(service.descKey)}</p>
                    <span className="text-indigo-400 text-sm font-medium flex items-center space-x-1 group-hover:space-x-2 transition-all">
                      <span>{t('services.explore')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('process.title').split(' ')[0]} <span className="gradient-text-gold">{t('process.title').split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('process.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', titleKey: 'process.discover', desc: 'Deep dive into requirements, user research, and competitive analysis' },
              { step: '02', titleKey: 'process.design', desc: 'Wireframes, prototypes, and visual design with client feedback loops' },
              { step: '03', titleKey: 'process.develop', desc: 'Agile sprints with continuous integration and code reviews' },
              { step: '04', titleKey: 'process.deploy', desc: 'Launch, monitor, iterate. Continuous improvement post-launch' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className={`rounded-2xl p-6 h-full transition ${isDark ? 'glass-light hover:bg-white/10' : 'bg-white border border-gray-100 shadow-sm hover:shadow-md'}`}>
                  <span className={`text-5xl font-bold ${isDark ? 'text-indigo-500/20' : 'text-indigo-200'}`}>{item.step}</span>
                  <h3 className={`text-lg font-bold mt-2 mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t(item.titleKey)}</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-indigo-500 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`rounded-3xl p-12 relative overflow-hidden ${isDark ? 'glass' : 'bg-white border border-gray-200 shadow-xl'}`}
          >
            <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`} />
            <div className="relative">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('cta.title')}
              </h2>
              <p className={`mb-8 text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-semibold hover:shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300"
                >
                  {t('cta.start')}
                </Link>
                <Link
                  to="/company"
                  className={`px-8 py-4 rounded-xl font-semibold transition ${
                    isDark ? 'glass-light text-white hover:bg-white/10' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {t('cta.portal')}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
