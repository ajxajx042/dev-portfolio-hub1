import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Card, Button } from '../components/ui';
import { 
  ArrowRight, Code2, Palette, BarChart3, Users, Star, TrendingUp, Globe, 
  Sparkles, Rocket, Target, Zap, CheckCircle2, Play
} from 'lucide-react';
import { useEffect } from 'react';
import { loggingService } from '../services/LoggingService';

const stats = [
  { icon: Users, label: '24+', sublabel: 'Team Members', color: 'from-blue-500 to-cyan-500' },
  { icon: Star, label: '150+', sublabel: 'Projects Done', color: 'from-purple-500 to-pink-500' },
  { icon: TrendingUp, label: '98%', sublabel: 'Satisfaction', color: 'from-green-500 to-emerald-500' },
  { icon: Globe, label: '12', sublabel: 'Countries', color: 'from-amber-500 to-orange-500' },
];

const services = [
  {
    icon: Code2,
    titleKey: 'services.dev',
    descKey: 'services.dev.desc',
    color: 'from-blue-500 to-cyan-500',
    link: '/portfolio/developers',
    features: ['React & Next.js', 'Node.js & Python', 'Cloud Architecture'],
  },
  {
    icon: Palette,
    titleKey: 'services.design',
    descKey: 'services.design.desc',
    color: 'from-purple-500 to-pink-500',
    link: '/portfolio/interior',
    features: ['3D Visualization', 'Space Planning', 'Material Selection'],
  },
  {
    icon: BarChart3,
    titleKey: 'services.data',
    descKey: 'services.data.desc',
    color: 'from-amber-500 to-orange-500',
    link: '/portfolio/data',
    features: ['Machine Learning', 'Data Pipelines', 'Real-time Dashboards'],
  },
];

const processSteps = [
  { icon: Target, title: 'Discover', desc: 'Deep dive into requirements and research' },
  { icon: Sparkles, title: 'Design', desc: 'Wireframes, prototypes, and visual design' },
  { icon: Rocket, title: 'Develop', desc: 'Agile sprints with continuous integration' },
  { icon: Zap, title: 'Deploy', desc: 'Launch, monitor, and iterate continuously' },
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
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className={`absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100/50'}`} />
          <div className={`absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse ${isDark ? 'bg-purple-500/20' : 'bg-purple-100/50'}`} style={{ animationDelay: '1s' }} />
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-3xl animate-pulse ${isDark ? 'bg-pink-500/10' : 'bg-pink-100/30'}`} style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-full mb-8 ${
                isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200 shadow-sm'
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('hero.available')}</span>
            </motion.div>

            {/* Title */}
            <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {t('hero.title1')}
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="gradient-text"
              >
                {t('hero.title2')}
              </motion.span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/portfolio">
                <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                  {t('hero.cta1')}
                </Button>
              </Link>
              <Link to="/team">
                <Button variant="outline" size="lg" icon={<Play className="w-5 h-5" />}>
                  {t('hero.cta2')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
              >
                <Card hover className="text-center">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.label}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.sublabel}</div>
                </Card>
              </motion.div>
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
                <Link to={service.link} className="block h-full">
                  <Card hover className="h-full">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t(service.titleKey)}</h3>
                    <p className={`leading-relaxed mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t(service.descKey)}</p>
                    
                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, j) => (
                        <li key={j} className="flex items-center space-x-2">
                          <CheckCircle2 className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
                          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center space-x-2 text-indigo-400 font-medium group">
                      <span>{t('services.explore')}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className={`py-24 relative ${isDark ? 'bg-white/[0.02]' : 'bg-gray-50'}`}>
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
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <Card className="text-center h-full">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25`}>
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className={`text-4xl font-bold mb-2 ${isDark ? 'text-white/10' : 'text-gray-200'}`}>0{i + 1}</div>
                  <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{step.title}</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{step.desc}</p>
                </Card>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-indigo-500 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card className="p-12 relative overflow-hidden">
              <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`} />
              <div className="relative">
                <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t('cta.title')}
                </h2>
                <p className={`mb-8 text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('cta.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/register">
                    <Button variant="primary" size="lg" icon={<Rocket className="w-5 h-5" />}>
                      {t('cta.start')}
                    </Button>
                  </Link>
                  <Link to="/company">
                    <Button variant="outline" size="lg">
                      {t('cta.portal')}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
