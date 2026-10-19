import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Palette, BarChart3, ExternalLink, Github, Eye, Filter } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const categories = [
  { id: 'all', nameKey: 'portfolio.all', icon: Eye },
  { id: 'developers', nameKey: 'portfolio.development', icon: Code2 },
  { id: 'interior', nameKey: 'portfolio.interior', icon: Palette },
  { id: 'data', nameKey: 'portfolio.data', icon: BarChart3 },
];

const projects = [
  // Developer Projects
  {
    id: 1,
    title: 'E-Commerce Platform',
    category: 'developers',
    description: 'Full-stack e-commerce solution with React, Node.js, and PostgreSQL. Features real-time inventory, AI recommendations, and seamless checkout.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
    image: '🛒',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    stats: { users: '50K+', uptime: '99.9%' },
  },
  {
    id: 2,
    title: 'Healthcare Dashboard',
    category: 'developers',
    description: 'HIPAA-compliant patient management system with real-time monitoring, telemedicine integration, and automated reporting.',
    tech: ['Next.js', 'TypeScript', 'MongoDB', 'WebRTC'],
    image: '🏥',
    gradient: 'from-green-500/20 to-emerald-500/20',
    stats: { patients: '10K+', hospitals: '25' },
  },
  {
    id: 3,
    title: 'FinTech Mobile App',
    category: 'developers',
    description: 'Cross-platform banking application with biometric auth, real-time transactions, and investment portfolio tracking.',
    tech: ['React Native', 'Firebase', 'Stripe', 'AWS'],
    image: '💳',
    gradient: 'from-purple-500/20 to-pink-500/20',
    stats: { transactions: '$2M+', downloads: '100K+' },
  },
  {
    id: 4,
    title: 'AI Content Generator',
    category: 'developers',
    description: 'GPT-powered content creation platform with multi-language support, brand voice training, and SEO optimization.',
    tech: ['Python', 'FastAPI', 'OpenAI', 'React'],
    image: '🤖',
    gradient: 'from-indigo-500/20 to-violet-500/20',
    stats: { articles: '500K+', languages: '12' },
  },
  // Interior Design Projects
  {
    id: 5,
    title: 'Modern Office Space',
    category: 'interior',
    description: '20,000 sq ft tech office redesign with collaborative zones, biophilic elements, and smart lighting systems.',
    tech: ['3D Modeling', 'Smart Lighting', 'Sustainable Materials'],
    image: '🏢',
    gradient: 'from-amber-500/20 to-orange-500/20',
    stats: { sqft: '20K', satisfaction: '98%' },
  },
  {
    id: 6,
    title: 'Luxury Residential',
    category: 'interior',
    description: 'Penthouse interior design featuring custom furniture, ambient lighting, and integrated smart home technology.',
    tech: ['AutoCAD', 'VR Preview', 'Custom Furniture'],
    image: '🏠',
    gradient: 'from-rose-500/20 to-pink-500/20',
    stats: { rooms: '12', budget: '$500K' },
  },
  {
    id: 7,
    title: 'Restaurant & Bar',
    category: 'interior',
    description: 'Award-winning restaurant design blending industrial chic with warm hospitality. Custom acoustic treatment included.',
    tech: ['Acoustic Design', 'Custom Lighting', 'Material Sourcing'],
    image: '🍽️',
    gradient: 'from-red-500/20 to-orange-500/20',
    stats: { seats: '120', awards: '3' },
  },
  {
    id: 8,
    title: 'Co-working Space',
    category: 'interior',
    description: 'Flexible workspace design with modular furniture, phone booths, meditation rooms, and community areas.',
    tech: ['Modular Design', 'Ergonomics', 'Wayfinding'],
    image: '💼',
    gradient: 'from-teal-500/20 to-cyan-500/20',
    stats: { desks: '200', members: '500+' },
  },
  // Data Analytics Projects
  {
    id: 9,
    title: 'Predictive Sales Model',
    category: 'data',
    description: 'Machine learning pipeline predicting quarterly sales with 94% accuracy. Real-time dashboard with anomaly detection.',
    tech: ['Python', 'TensorFlow', 'Tableau', 'SQL'],
    image: '📊',
    gradient: 'from-yellow-500/20 to-amber-500/20',
    stats: { accuracy: '94%', savings: '$2M' },
  },
  {
    id: 10,
    title: 'Customer Analytics Platform',
    category: 'data',
    description: 'End-to-end customer journey analytics with sentiment analysis, churn prediction, and personalized recommendations.',
    tech: ['Spark', 'Kafka', 'Elasticsearch', 'D3.js'],
    image: '📈',
    gradient: 'from-blue-500/20 to-indigo-500/20',
    stats: { dataPoints: '1B+', insights: '500+' },
  },
  {
    id: 11,
    title: 'Supply Chain Optimization',
    category: 'data',
    description: 'Logistics optimization using graph algorithms and real-time tracking. Reduced delivery times by 35%.',
    tech: ['R', 'Optimization', 'GIS', 'Python'],
    image: '🚚',
    gradient: 'from-emerald-500/20 to-green-500/20',
    stats: { routes: '10K+', savings: '35%' },
  },
  {
    id: 12,
    title: 'Financial Risk Dashboard',
    category: 'data',
    description: 'Real-time risk monitoring system for a Fortune 500 company with automated alerts and scenario modeling.',
    tech: ['Python', 'React', 'PostgreSQL', 'Docker'],
    image: '⚡',
    gradient: 'from-violet-500/20 to-purple-500/20',
    stats: { risks: '1M+', alerts: 'Real-time' },
  },
];

export default function Portfolio() {
  const { category } = useParams();
  const [activeCategory, setActiveCategory] = useState(category || 'all');
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('portfolio.title').split(' ')[0]} <span className="gradient-text">{t('portfolio.title').split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('portfolio.subtitle')}
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                  : isDark ? 'glass-light text-gray-300 hover:text-white hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              <span>{t(cat.nameKey)}</span>
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                className="group"
              >
                <div className={`rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 ${isDark ? 'glass-light' : 'bg-white border border-gray-100 shadow-sm'}`}>
                  {/* Project Image Area */}
                  <div className={`relative h-48 bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
                    <span className="text-6xl">{project.image}</span>
                    <div className={`absolute inset-0 bg-black/50 flex items-center justify-center gap-4 transition-opacity duration-300 ${
                      hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition">
                        <ExternalLink className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition">
                        <Github className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                        project.category === 'developers' ? 'bg-blue-500/20 text-blue-400' :
                        project.category === 'interior' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {project.category === 'developers' ? 'Development' :
                         project.category === 'interior' ? 'Interior Design' : 'Data Analytics'}
                      </span>
                    </div>
                    <h3 className={`text-lg font-bold mb-2 group-hover:text-indigo-400 transition ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {project.title}
                    </h3>
                    <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{project.description}</p>
                    
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.slice(0, 3).map((tech, i) => (
                        <span key={i} className={`text-xs px-2 py-1 rounded-md ${isDark ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className={`text-xs px-2 py-1 rounded-md ${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                          +{project.tech.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className={`flex justify-between pt-4 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                      {Object.entries(project.stats).map(([key, value], i) => (
                        <div key={i} className="text-center">
                          <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</div>
                          <div className={`text-xs capitalize ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{key}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <Filter className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No projects found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
