import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2, Users, FileText, Calendar, MessageSquare, CheckCircle,
  Clock, AlertCircle, ArrowRight, Briefcase, TrendingUp, Star, Shield
} from 'lucide-react';

const projects = [
  {
    id: 1,
    name: 'E-Commerce Platform Redesign',
    status: 'In Progress',
    progress: 72,
    team: ['Alex R.', 'Maya P.', 'Ryan O.'],
    deadline: '2026-03-15',
    category: 'Development',
  },
  {
    id: 2,
    name: 'HQ Office Interior Overhaul',
    status: 'Review',
    progress: 90,
    team: ['Sofia M.', 'Daniel K.'],
    deadline: '2026-02-28',
    category: 'Interior Design',
  },
  {
    id: 3,
    name: 'Customer Analytics Dashboard',
    status: 'In Progress',
    progress: 45,
    team: ['Tom W.', 'Priya S.', 'James C.'],
    deadline: '2026-04-01',
    category: 'Data Analytics',
  },
  {
    id: 4,
    name: 'Mobile App Development',
    status: 'Planning',
    progress: 15,
    team: ['Alex R.', 'Maya P.'],
    deadline: '2026-05-30',
    category: 'Development',
  },
];

const invoices = [
  { id: 'INV-001', date: '2026-01-10', amount: '$12,500', status: 'Paid', project: 'E-Commerce Platform' },
  { id: 'INV-002', date: '2026-01-25', amount: '$8,200', status: 'Pending', project: 'Office Interior' },
  { id: 'INV-003', date: '2026-02-05', amount: '$15,000', status: 'Upcoming', project: 'Analytics Dashboard' },
];

const messages = [
  { from: 'Alex Rivera', message: 'Sprint review completed. All tasks on track.', time: '2 hours ago', unread: true },
  { from: 'Sofia Martinez', message: 'Material samples have been selected. Ready for your review.', time: '5 hours ago', unread: true },
  { from: 'Ryan O\'Brien', message: 'Data pipeline optimization done. 40% faster processing.', time: '1 day ago', unread: false },
];

export default function CompanyPortal() {
  const { isAuthenticated, user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  if (!isAuthenticated) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <Building2 className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Company Portal</h2>
          <p className="text-gray-400 mb-6">
            Sign in with your company account to access projects, invoices, and team communications.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/login" className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-semibold">
              Sign In
            </Link>
            <Link to="/register" className="px-6 py-3 glass-light rounded-xl text-white font-semibold hover:bg-white/10 transition">
              Register Company
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-1">Company Portal</h1>
          <p className="text-gray-400">Manage your projects, team, and communications.</p>
        </motion.div>

        {/* Navigation */}
        <div className="flex space-x-1 mb-8 overflow-x-auto glass-light rounded-xl p-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Briefcase },
            { id: 'projects', label: 'Projects', icon: FileText },
            { id: 'invoices', label: 'Invoices', icon: Calendar },
            { id: 'messages', label: 'Messages', icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeSection === tab.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Active Projects', value: '4', icon: Briefcase, color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
                { label: 'Team Members', value: '9', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/20' },
                { label: 'Budget Used', value: '68%', icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/20' },
                { label: 'Satisfaction', value: '4.9/5', icon: Star, color: 'text-green-400', bg: 'bg-green-500/20' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-light rounded-xl p-6"
                >
                  <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Quick Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Projects */}
              <div className="glass-light rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Project Progress</h3>
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">{project.name}</span>
                        <span className="text-sm font-medium text-white">{project.progress}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className={`h-full rounded-full ${
                            project.progress >= 90 ? 'bg-green-500' :
                            project.progress >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Messages */}
              <div className="glass-light rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Messages</h3>
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                        {msg.from.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-white">{msg.from}</span>
                          {msg.unread && <span className="w-2 h-2 rounded-full bg-indigo-400" />}
                        </div>
                        <p className="text-sm text-gray-400 truncate">{msg.message}</p>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Projects Section */}
        {activeSection === 'projects' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="space-y-4">
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-light rounded-xl p-6 hover:bg-white/10 transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          project.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                          project.status === 'Review' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Due: {project.deadline}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {project.team.join(', ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">{project.progress}%</div>
                        <div className="text-xs text-gray-500">Complete</div>
                      </div>
                      <div className="w-32">
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              project.progress >= 90 ? 'bg-green-500' :
                              project.progress >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Invoices Section */}
        {activeSection === 'invoices' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass-light rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Invoice</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Date</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Project</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Amount</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="py-4 px-6 text-sm font-medium text-white">{inv.id}</td>
                        <td className="py-4 px-6 text-sm text-gray-400">{inv.date}</td>
                        <td className="py-4 px-6 text-sm text-gray-300">{inv.project}</td>
                        <td className="py-4 px-6 text-sm font-medium text-white">{inv.amount}</td>
                        <td className="py-4 px-6">
                          <span className={`flex items-center text-sm ${
                            inv.status === 'Paid' ? 'text-green-400' :
                            inv.status === 'Pending' ? 'text-amber-400' : 'text-blue-400'
                          }`}>
                            {inv.status === 'Paid' ? <CheckCircle className="w-4 h-4 mr-1.5" /> :
                             inv.status === 'Pending' ? <Clock className="w-4 h-4 mr-1.5" /> :
                             <AlertCircle className="w-4 h-4 mr-1.5" />}
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Messages Section */}
        {activeSection === 'messages' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass-light rounded-xl p-6">
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-start space-x-4 p-4 rounded-xl transition ${
                      msg.unread ? 'bg-indigo-500/5 border border-indigo-500/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg text-white font-bold flex-shrink-0">
                      {msg.from.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white">{msg.from}</span>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                      <p className="text-sm text-gray-300">{msg.message}</p>
                    </div>
                    {msg.unread && (
                      <span className="w-3 h-3 rounded-full bg-indigo-400 flex-shrink-0 mt-2" />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Compose */}
              <div className="mt-6 pt-6 border-t border-white/5">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="Type a message to your team..."
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition flex items-center space-x-2">
                    <span>Send</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 glass rounded-xl p-6 flex items-center space-x-4"
        >
          <Shield className="w-10 h-10 text-green-400 flex-shrink-0" />
          <div>
            <h4 className="text-white font-semibold">Enterprise Security</h4>
            <p className="text-sm text-gray-400">
              Your data is protected with end-to-end encryption, SOC 2 compliance, and regular security audits.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
