import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Palette, BarChart3, Users, Star, TrendingUp, Globe } from 'lucide-react';

const stats = [
  { icon: Users, label: 'Team Members', value: '24+' },
  { icon: Star, label: 'Projects Done', value: '150+' },
  { icon: TrendingUp, label: 'Client Satisfaction', value: '98%' },
  { icon: Globe, label: 'Countries Served', value: '12' },
];

const services = [
  {
    icon: Code2,
    title: 'Full Stack Development',
    description: 'End-to-end web & mobile solutions with cutting-edge tech stacks. React, Node.js, Python, and cloud-native architectures.',
    color: 'from-blue-500 to-cyan-500',
    link: '/portfolio/developers',
  },
  {
    icon: Palette,
    title: 'Interior Design',
    description: 'Transforming spaces into experiences. Modern aesthetics meet functionality with 3D visualization and smart design.',
    color: 'from-purple-500 to-pink-500',
    link: '/portfolio/interior',
  },
  {
    icon: BarChart3,
    title: 'Data Analytics',
    description: 'Turning raw data into actionable insights. Business intelligence, ML models, and real-time dashboards.',
    color: 'from-amber-500 to-orange-500',
    link: '/portfolio/data',
  },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'CEO, TechVentures', text: 'NexusTeam delivered beyond expectations. Their full-stack solution increased our revenue by 340%.', rating: 5 },
  { name: 'Marcus Johnson', role: 'Founder, DesignCo', text: 'The interior design team transformed our office into a productivity powerhouse. Absolutely stunning work.', rating: 5 },
  { name: 'Dr. Emily Park', role: 'CTO, DataFlow', text: 'Their data analytics platform gave us insights we never knew we needed. Game-changing for our business.', rating: 5 },
];

export default function Home() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-light mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-gray-300">Available for new projects</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="text-white">We Build</span>
              <br />
              <span className="gradient-text">Digital Futures</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              A multidisciplinary team of developers, interior designers, and data analysts 
              crafting exceptional experiences that drive growth and inspire innovation.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/portfolio"
                className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-semibold hover:shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 flex items-center space-x-2"
              >
                <span>View Our Work</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/team"
                className="px-8 py-4 glass-light rounded-xl text-white font-semibold hover:bg-white/10 transition-all duration-300"
              >
                Meet The Team
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
              <div key={i} className="glass-light rounded-xl p-6 text-center hover:bg-white/10 transition">
                <stat.icon className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span className="gradient-text">Expertise</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Three disciplines, one unified vision. We combine technical excellence with creative design and data-driven insights.
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
                  <div className="glass-light rounded-2xl p-8 h-full hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <service.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                    <p className="text-gray-400 leading-relaxed mb-4">{service.description}</p>
                    <span className="text-indigo-400 text-sm font-medium flex items-center space-x-1 group-hover:space-x-2 transition-all">
                      <span>Explore</span>
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span className="gradient-text-gold">Process</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Iterative development with continuous validation. Build, test, refine — until perfection.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Discover', desc: 'Deep dive into requirements, user research, and competitive analysis' },
              { step: '02', title: 'Design', desc: 'Wireframes, prototypes, and visual design with client feedback loops' },
              { step: '03', title: 'Develop', desc: 'Agile sprints with continuous integration and code reviews' },
              { step: '04', title: 'Deploy', desc: 'Launch, monitor, iterate. Continuous improvement post-launch' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="glass-light rounded-2xl p-6 h-full hover:bg-white/10 transition">
                  <span className="text-5xl font-bold text-indigo-500/20">{item.step}</span>
                  <h3 className="text-lg font-bold text-white mt-2 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-indigo-500 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Client <span className="gradient-text">Love</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="glass-light rounded-2xl p-8 hover:bg-white/10 transition"
              >
                <div className="flex mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{t.text}"</p>
                <div>
                  <div className="text-white font-semibold">{t.name}</div>
                  <div className="text-sm text-gray-400">{t.role}</div>
                </div>
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
            className="glass rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                Join 150+ companies that trust NexusTeam for their digital transformation.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-semibold hover:shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/company"
                  className="px-8 py-4 glass-light rounded-xl text-white font-semibold hover:bg-white/10 transition"
                >
                  Company Portal
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
