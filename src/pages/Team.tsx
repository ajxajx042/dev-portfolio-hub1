import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail, Code2, Palette, BarChart3 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const teamMembers = [
  {
    name: 'Alex Rivera',
    role: 'Lead Full Stack Developer',
    department: 'developers',
    bio: '10+ years building scalable web applications. Passionate about clean code and user experience.',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL'],
    avatar: '👨‍💻',
    social: { github: '#', twitter: '#', linkedin: '#' },
  },
  {
    name: 'Maya Patel',
    role: 'Senior Frontend Engineer',
    department: 'developers',
    bio: 'UI/UX specialist who brings designs to life with pixel-perfect implementations.',
    skills: ['React', 'Vue.js', 'Figma', 'CSS', 'Animation'],
    avatar: '👩‍💻',
    social: { github: '#', twitter: '#', linkedin: '#' },
  },
  {
    name: 'James Chen',
    role: 'Backend Architect',
    department: 'developers',
    bio: 'Distributed systems expert. Designs microservices that handle millions of requests.',
    skills: ['Python', 'Go', 'Kubernetes', 'Docker', 'gRPC'],
    avatar: '🧑‍💻',
    social: { github: '#', twitter: '#', linkedin: '#' },
  },
  {
    name: 'Sofia Martinez',
    role: 'Principal Interior Designer',
    department: 'interior',
    bio: 'Award-winning designer with a focus on sustainable and biophilic design principles.',
    skills: ['3D Design', 'AutoCAD', 'Sustainable Design', 'Lighting'],
    avatar: '👩‍🎨',
    social: { github: '#', twitter: '#', linkedin: '#' },
  },
  {
    name: 'Daniel Kim',
    role: 'Space Planner & 3D Artist',
    department: 'interior',
    bio: 'Creates immersive 3D visualizations that help clients see their spaces before construction.',
    skills: ['SketchUp', '3ds Max', 'VR Design', 'Rendering'],
    avatar: '🧑‍🎨',
    social: { github: '#', twitter: '#', linkedin: '#' },
  },
  {
    name: 'Aisha Johnson',
    role: 'Color & Material Specialist',
    department: 'interior',
    bio: 'Expert in material sourcing and color theory. Creates harmonious palettes for any space.',
    skills: ['Color Theory', 'Materials', 'Textiles', 'Sourcing'],
    avatar: '👩‍🔬',
    social: { github: '#', twitter: '#', linkedin: '#' },
  },
  {
    name: 'Ryan O\'Brien',
    role: 'Lead Data Scientist',
    department: 'data',
    bio: 'PhD in ML with 8 years of industry experience. Specializes in NLP and predictive modeling.',
    skills: ['Python', 'TensorFlow', 'NLP', 'MLOps', 'SQL'],
    avatar: '📊',
    social: { github: '#', twitter: '#', linkedin: '#' },
  },
  {
    name: 'Priya Sharma',
    role: 'Data Engineer',
    department: 'data',
    bio: 'Builds robust data pipelines that process terabytes of data daily with 99.99% reliability.',
    skills: ['Spark', 'Kafka', 'Airflow', 'dbt', 'Snowflake'],
    avatar: '⚙️',
    social: { github: '#', twitter: '#', linkedin: '#' },
  },
  {
    name: 'Tom Wilson',
    role: 'BI Analyst & Visualization Expert',
    department: 'data',
    bio: 'Transforms complex datasets into compelling visual stories that drive business decisions.',
    skills: ['Tableau', 'D3.js', 'SQL', 'Python', 'R'],
    avatar: '📈',
    social: { github: '#', twitter: '#', linkedin: '#' },
  },
];

const departmentColors = {
  developers: { bg: 'from-blue-500/20 to-cyan-500/20', text: 'text-blue-400', badge: 'bg-blue-500/20', icon: Code2 },
  interior: { bg: 'from-purple-500/20 to-pink-500/20', text: 'text-purple-400', badge: 'bg-purple-500/20', icon: Palette },
  data: { bg: 'from-amber-500/20 to-orange-500/20', text: 'text-amber-400', badge: 'bg-amber-500/20', icon: BarChart3 },
};

export default function Team() {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('team.title').split(' ').slice(0, -1).join(' ')} <span className="gradient-text">{t('team.title').split(' ').pop()}</span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('team.subtitle')}
          </p>
        </motion.div>

        {/* Department Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {[
            { dept: 'Development', count: 3, icon: Code2, color: 'from-blue-500 to-cyan-500', desc: 'Full-stack engineers building the future' },
            { dept: 'Interior Design', count: 3, icon: Palette, color: 'from-purple-500 to-pink-500', desc: 'Creative minds shaping beautiful spaces' },
            { dept: 'Data Analytics', count: 3, icon: BarChart3, color: 'from-amber-500 to-orange-500', desc: 'Data experts driving insights' },
          ].map((d, i) => (
            <div key={i} className={`rounded-2xl p-6 text-center transition ${isDark ? 'glass-light hover:bg-white/10' : 'bg-white border border-gray-100 shadow-sm hover:shadow-md'}`}>
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${d.color} flex items-center justify-center mx-auto mb-4`}>
                <d.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{d.dept}</h3>
              <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{d.desc}</p>
              <span className="text-2xl font-bold gradient-text">{d.count} Experts</span>
            </div>
          ))}
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, i) => {
            const colors = departmentColors[member.department as keyof typeof departmentColors];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className={`rounded-2xl p-6 h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 ${isDark ? 'glass-light hover:bg-white/10' : 'bg-white border border-gray-100 shadow-sm hover:shadow-lg'}`}>
                  {/* Avatar */}
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform`}>
                    {member.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors.badge} ${colors.text}`}>
                      {member.department === 'developers' ? 'Dev' : member.department === 'interior' ? 'Design' : 'Data'}
                    </span>
                  </div>
                  <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{member.name}</h3>
                  <p className={`text-sm ${colors.text} mb-3`}>{member.role}</p>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{member.bio}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {member.skills.slice(0, 4).map((skill, j) => (
                      <span key={j} className={`text-xs px-2 py-1 rounded-md ${isDark ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Social */}
                  <div className="flex space-x-3 pt-4 border-t border-white/5">
                    <a href={member.social.github} className="text-gray-400 hover:text-white transition">
                      <Github className="w-4 h-4" />
                    </a>
                    <a href={member.social.twitter} className="text-gray-400 hover:text-white transition">
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a href={member.social.linkedin} className="text-gray-400 hover:text-white transition">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition ml-auto">
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Collaboration Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mt-20 rounded-3xl p-10 text-center relative overflow-hidden ${isDark ? 'glass' : 'bg-white border border-gray-200 shadow-lg'}`}
        >
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-indigo-500/5 to-purple-500/5' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`} />
          <div className="relative">
            <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Cross-Disciplinary Collaboration</h2>
            <p className={`max-w-2xl mx-auto mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Our team doesn't work in silos. Developers collaborate with designers to build 
              beautiful interfaces, while data analysts ensure every decision is backed by insights.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${isDark ? 'glass-light' : 'bg-gray-100'}`}>
                <Code2 className="w-4 h-4 text-blue-400" />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Dev ↔ Design Sync</span>
              </div>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${isDark ? 'glass-light' : 'bg-gray-100'}`}>
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Data-Driven Design</span>
              </div>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${isDark ? 'glass-light' : 'bg-gray-100'}`}>
                <Palette className="w-4 h-4 text-purple-400" />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Design-Informed Dev</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
