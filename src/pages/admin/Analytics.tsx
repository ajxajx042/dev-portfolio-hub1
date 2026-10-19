import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import Card from '../../components/ui/Card';
import { BarChart3, TrendingUp, Users, Briefcase, Eye, Calendar } from 'lucide-react';

export default function Analytics() {
  const { isDark } = useTheme();
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    weeklyViews: [] as number[],
    topPortfolios: [] as { title: string; views: number }[],
    userGrowth: [] as { month: string; users: number }[],
  });

  useEffect(() => {
    // Generate sample analytics data
    const portfolios = JSON.parse(localStorage.getItem('portfolios') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const totalViews = portfolios.reduce((sum: number, p: any) => sum + (p.views || 0), 0);
    
    // Generate weekly views (last 7 days)
    const weeklyViews = Array.from({ length: 7 }, () => Math.floor(Math.random() * 1000) + 500);
    
    // Top portfolios
    const topPortfolios = portfolios
      .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
      .slice(0, 5)
      .map((p: any) => ({ title: p.title, views: p.views || 0 }));
    
    // User growth (last 6 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const userGrowth = months.map((month, index) => ({
      month,
      users: Math.floor(users.length * (index + 1) / 6),
    }));
    
    setAnalytics({
      totalViews,
      weeklyViews,
      topPortfolios,
      userGrowth,
    });
  }, []);

  const maxWeeklyView = Math.max(...analytics.weeklyViews);
  const maxUsers = Math.max(...analytics.userGrowth.map(g => g.users));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Analytics
        </h1>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          Platform performance and user engagement metrics
        </p>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <Eye className="w-8 h-8 text-blue-500" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {analytics.totalViews.toLocaleString()}
            </h3>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Total Views</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-purple-500" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {analytics.userGrowth[analytics.userGrowth.length - 1]?.users || 0}
            </h3>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Total Users</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <Briefcase className="w-8 h-8 text-amber-500" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {analytics.topPortfolios.length}
            </h3>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Active Portfolios</p>
          </Card>
        </motion.div>
      </div>

      {/* Weekly Views Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Weekly Views
              </h2>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Portfolio views over the last 7 days
              </p>
            </div>
            <BarChart3 className={`w-6 h-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>
          <div className="flex items-end justify-between space-x-2 h-64">
            {analytics.weeklyViews.map((views, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center justify-end h-56">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(views / maxWeeklyView) * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className="w-full bg-gradient-to-t from-indigo-500 to-purple-600 rounded-t-lg relative group"
                  >
                    <div className={`absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition ${
                      isDark ? 'bg-slate-700 text-white' : 'bg-slate-900 text-white'
                    }`}>
                      {views}
                    </div>
                  </motion.div>
                </div>
                <span className={`text-xs mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Day {index + 1}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Portfolios */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Top Portfolios
              </h2>
              <Briefcase className={`w-6 h-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            </div>
            <div className="space-y-4">
              {analytics.topPortfolios.map((portfolio, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isDark ? 'bg-slate-900/50' : 'bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-amber-500/20 text-amber-500' :
                      index === 1 ? 'bg-slate-500/20 text-slate-400' :
                      index === 2 ? 'bg-orange-500/20 text-orange-500' :
                      'bg-slate-500/20 text-slate-500'
                    }`}>
                      #{index + 1}
                    </div>
                    <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {portfolio.title}
                    </span>
                  </div>
                  <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {portfolio.views.toLocaleString()} views
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* User Growth */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                User Growth
              </h2>
              <Calendar className={`w-6 h-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            </div>
            <div className="space-y-4">
              {analytics.userGrowth.map((growth, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {growth.month}
                    </span>
                    <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {growth.users} users
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(growth.users / maxUsers) * 100}%` }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
