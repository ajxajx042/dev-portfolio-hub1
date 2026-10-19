import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import {
  Users,
  Briefcase,
  Eye,
  TrendingUp,
  Activity,
  Shield,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export default function AdminDashboard() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activePortfolios: 0,
    totalViews: 0,
    recentSignups: 0,
  });

  useEffect(() => {
    // Load stats from localStorage or API
    const loadStats = () => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const portfolios = JSON.parse(localStorage.getItem('portfolios') || '[]');
      
      setStats({
        totalUsers: users.length,
        activePortfolios: portfolios.filter((p: any) => p.status === 'published').length,
        totalViews: portfolios.reduce((sum: number, p: any) => sum + (p.views || 0), 0),
        recentSignups: users.filter((u: any) => {
          const signupDate = new Date(u.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return signupDate > weekAgo;
        }).length,
      });
    };

    loadStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      change: '+12%',
    },
    {
      title: 'Active Portfolios',
      value: stats.activePortfolios,
      icon: Briefcase,
      color: 'from-purple-500 to-pink-500',
      change: '+8%',
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'from-amber-500 to-orange-500',
      change: '+23%',
    },
    {
      title: 'Recent Signups',
      value: stats.recentSignups,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      change: '+15%',
    },
  ];

  const recentActivities = [
    { type: 'user', message: 'New user registered: john@example.com', time: '2 minutes ago' },
    { type: 'portfolio', message: 'Portfolio published: Web Development Portfolio', time: '15 minutes ago' },
    { type: 'moderation', message: 'Content flagged for review', time: '1 hour ago' },
    { type: 'system', message: 'System backup completed', time: '3 hours ago' },
    { type: 'user', message: 'User profile updated: jane@example.com', time: '5 hours ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Dashboard
        </h1>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          Welcome back, {user?.name || 'Admin'}. Here's what's happening today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-green-500 text-sm font-medium flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.change}
                  </span>
                </div>
                <h3 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {stat.value}
                </h3>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>{stat.title}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Recent Activity
              </h2>
              <Activity className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-lg ${
                    isDark ? 'bg-slate-900/50' : 'bg-slate-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'user' ? 'bg-blue-500/20' :
                    activity.type === 'portfolio' ? 'bg-purple-500/20' :
                    activity.type === 'moderation' ? 'bg-amber-500/20' :
                    'bg-green-500/20'
                  }`}>
                    {activity.type === 'user' && <Users className="w-4 h-4 text-blue-500" />}
                    {activity.type === 'portfolio' && <Briefcase className="w-4 h-4 text-purple-500" />}
                    {activity.type === 'moderation' && <Shield className="w-4 h-4 text-amber-500" />}
                    {activity.type === 'system' && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {activity.message}
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                System Status
              </h2>
              <Shield className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            </div>
            <div className="space-y-4">
              {[
                { name: 'API Server', status: 'Operational', health: 99.9 },
                { name: 'Database', status: 'Operational', health: 100 },
                { name: 'File Storage', status: 'Operational', health: 98.5 },
                { name: 'Email Service', status: 'Operational', health: 97.2 },
                { name: 'CDN', status: 'Operational', health: 100 },
              ].map((service, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {service.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-500">{service.status}</span>
                    </div>
                  </div>
                  <div className={`w-full h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                      style={{ width: `${service.health}%` }}
                    />
                  </div>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Uptime: {service.health}%
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className={`p-4 rounded-lg border-2 border-dashed transition ${
              isDark 
                ? 'border-slate-700 hover:border-indigo-500 hover:bg-indigo-500/5' 
                : 'border-slate-300 hover:border-indigo-500 hover:bg-indigo-50'
            }`}>
              <Users className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Manage Users
              </p>
            </button>
            <button className={`p-4 rounded-lg border-2 border-dashed transition ${
              isDark 
                ? 'border-slate-700 hover:border-purple-500 hover:bg-purple-500/5' 
                : 'border-slate-300 hover:border-purple-500 hover:bg-purple-50'
            }`}>
              <Shield className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Review Content
              </p>
            </button>
            <button className={`p-4 rounded-lg border-2 border-dashed transition ${
              isDark 
                ? 'border-slate-700 hover:border-amber-500 hover:bg-amber-500/5' 
                : 'border-slate-300 hover:border-amber-500 hover:bg-amber-50'
            }`}>
              <AlertCircle className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
              <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                View Reports
              </p>
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
