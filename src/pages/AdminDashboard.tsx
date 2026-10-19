import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Users, Eye, TrendingUp, Activity, AlertCircle, CheckCircle, Clock,
  Database, Server, Shield, FileText, ArrowUpRight, ArrowDownRight,
  Lock, Search, Bell, Settings, Download, Trash2, RefreshCw,
  AlertTriangle, Eye as EyeIcon, Fingerprint, Wifi
} from 'lucide-react';
import { loggingService, LogEntry } from '../services/LoggingService';
import { securityService, Session, SecurityEvent } from '../services/SecurityService';

const revenueData = [
  { month: 'Jan', revenue: 42000, projects: 8 },
  { month: 'Feb', revenue: 53000, projects: 12 },
  { month: 'Mar', revenue: 48000, projects: 10 },
  { month: 'Apr', revenue: 61000, projects: 15 },
  { month: 'May', revenue: 55000, projects: 11 },
  { month: 'Jun', revenue: 72000, projects: 18 },
  { month: 'Jul', revenue: 68000, projects: 14 },
  { month: 'Aug', revenue: 85000, projects: 22 },
];

const visitorData = [
  { day: 'Mon', visitors: 1200, signups: 45 },
  { day: 'Tue', visitors: 1800, signups: 62 },
  { day: 'Wed', visitors: 2200, signups: 78 },
  { day: 'Thu', visitors: 1900, signups: 55 },
  { day: 'Fri', visitors: 2500, signups: 89 },
  { day: 'Sat', visitors: 3200, signups: 120 },
  { day: 'Sun', visitors: 2800, signups: 95 },
];

const departmentData = [
  { name: 'Development', value: 45, color: '#6366f1' },
  { name: 'Interior Design', value: 30, color: '#a855f7' },
  { name: 'Data Analytics', value: 25, color: '#f59e0b' },
];

const customerData = [
  { id: 'C001', name: 'TechVentures Inc.', email: 'contact@techventures.com', plan: 'Enterprise', status: 'Active', joined: '2024-01-15', spend: '$45,000' },
  { id: 'C002', name: 'DesignCo Studio', email: 'hello@designco.com', plan: 'Professional', status: 'Active', joined: '2024-03-22', spend: '$28,000' },
  { id: 'C003', name: 'DataFlow Analytics', email: 'team@dataflow.io', plan: 'Enterprise', status: 'Active', joined: '2024-02-10', spend: '$52,000' },
  { id: 'C004', name: 'GreenBuild Corp', email: 'info@greenbuild.com', plan: 'Starter', status: 'Pending', joined: '2024-06-01', spend: '$8,500' },
  { id: 'C005', name: 'Urban Spaces Ltd', email: 'project@urbanspaces.co', plan: 'Professional', status: 'Active', joined: '2024-04-18', spend: '$35,000' },
  { id: 'C006', name: 'NexGen Solutions', email: 'admin@nexgen.dev', plan: 'Enterprise', status: 'Active', joined: '2024-05-30', spend: '$67,000' },
];

export default function AdminDashboard() {
  const { isAuthenticated, user } = useAuth();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [logFilter, setLogFilter] = useState<string>('all');
  const [logSearch, setLogSearch] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logStats, setLogStats] = useState(loggingService.getStats());

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
      loggingService.logUserAction('Admin dashboard accessed', { userId: user?.id });
    }
  }, [isAuthenticated]);

  const refreshData = () => {
    setSessions(securityService.getActiveSessions());
    setSecurityEvents(securityService.getSecurityEvents().reverse());
    setLogs(loggingService.getAllLogs());
    setLogStats(loggingService.getStats());
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Access Restricted</h2>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Please sign in to access the admin dashboard.</p>
          <Link to="/login" className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-semibold">
            {t('nav.signin')}
          </Link>
        </div>
      </div>
    );
  }

  const filteredCustomers = customerData.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLogs = logFilter === 'all' 
    ? logs 
    : logs.filter(l => l.type === logFilter);

  const searchedLogs = logSearch 
    ? filteredLogs.filter(l => l.message.toLowerCase().includes(logSearch.toLowerCase()) || l.source.toLowerCase().includes(logSearch.toLowerCase()))
    : filteredLogs;

  const tabs = [
    { id: 'overview', label: t('admin.overview'), icon: TrendingUp },
    { id: 'customers', label: t('admin.customers'), icon: Users },
    { id: 'logs', label: t('admin.logs'), icon: FileText },
    { id: 'security', label: t('admin.security'), icon: Shield },
    { id: 'system', label: t('admin.system'), icon: Server },
  ];

  const cardClass = isDark ? 'glass-light rounded-xl p-6' : 'bg-white border border-gray-100 rounded-xl p-6 shadow-sm';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-400';

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-1 ${textPrimary}`}>{t('admin.title')}</h1>
            <p className={textSecondary}>{t('admin.welcome')}, {user?.name}.</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button className={`relative p-2 rounded-lg transition ${isDark ? 'glass-light hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}>
              <Bell className={`w-5 h-5 ${textSecondary}`} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">3</span>
            </button>
            <button className={`p-2 rounded-lg transition ${isDark ? 'glass-light hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}>
              <Settings className={`w-5 h-5 ${textSecondary}`} />
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className={`flex space-x-1 mb-8 overflow-x-auto rounded-xl p-1 ${isDark ? 'glass-light' : 'bg-gray-100'}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); refreshData(); }}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: t('admin.revenue'), value: '$484K', change: '+12.5%', up: true, icon: TrendingUp, color: 'text-green-400' },
                { label: t('admin.users'), value: '2,847', change: '+8.2%', up: true, icon: Users, color: 'text-blue-400' },
                { label: t('admin.views'), value: '45.2K', change: '+23.1%', up: true, icon: Eye, color: 'text-purple-400' },
                { label: t('admin.projects'), value: '34', change: '-2.4%', up: false, icon: Activity, color: 'text-amber-400' },
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={cardClass}>
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <span className={`flex items-center text-sm ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.change}{stat.up ? <ArrowUpRight className="w-4 h-4 ml-1" /> : <ArrowDownRight className="w-4 h-4 ml-1" />}
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${textPrimary}`}>{stat.value}</div>
                  <div className={`text-sm ${textSecondary}`}>{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className={cardClass}>
                <h3 className={`text-lg font-semibold mb-4 ${textPrimary}`}>Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={revenueData}>
                    <defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                    <XAxis dataKey="month" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={12} />
                    <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={12} />
                    <Tooltip contentStyle={{ background: isDark ? '#1e293b' : '#fff', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#colorRev)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className={cardClass}>
                <h3 className={`text-lg font-semibold mb-4 ${textPrimary}`}>Weekly Visitors</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={visitorData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                    <XAxis dataKey="day" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={12} />
                    <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={12} />
                    <Tooltip contentStyle={{ background: isDark ? '#1e293b' : '#fff', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, borderRadius: '8px' }} />
                    <Bar dataKey="visitors" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="signups" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={cardClass}>
              <h3 className={`text-lg font-semibold mb-4 ${textPrimary}`}>Department Distribution</h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={departmentData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                      {departmentData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                    </Pie>
                    <Tooltip contentStyle={{ background: isDark ? '#1e293b' : '#fff', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-6 mt-2">
                {departmentData.map((d, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className={`text-sm ${textSecondary}`}>{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className={cardClass}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h3 className={`text-lg font-semibold mb-4 md:mb-0 ${textPrimary}`}>Customer Data Records</h3>
                <div className="relative">
                  <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
                  <input type="text" placeholder="Search customers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-indigo-500 w-full md:w-64 ${
                      isDark ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                      {['Company', 'Plan', 'Status', 'Joined', 'Spend'].map(h => (
                        <th key={h} className={`text-left py-3 px-4 text-sm font-medium ${textSecondary}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((c) => (
                      <tr key={c.id} className={`border-b transition ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50'}`}>
                        <td className="py-3 px-4"><div className={`text-sm font-medium ${textPrimary}`}>{c.name}</div><div className={`text-xs ${textMuted}`}>{c.email}</div></td>
                        <td className="py-3 px-4"><span className={`text-xs px-2 py-1 rounded-full ${c.plan === 'Enterprise' ? 'bg-indigo-500/20 text-indigo-400' : c.plan === 'Professional' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'}`}>{c.plan}</span></td>
                        <td className="py-3 px-4"><span className={`flex items-center text-xs ${c.status === 'Active' ? 'text-green-400' : c.status === 'Pending' ? 'text-amber-400' : 'text-red-400'}`}><span className={`w-1.5 h-1.5 rounded-full mr-2 ${c.status === 'Active' ? 'bg-green-400' : c.status === 'Pending' ? 'bg-amber-400' : 'bg-red-400'}`} />{c.status}</span></td>
                        <td className={`py-3 px-4 text-sm ${textSecondary}`}>{c.joined}</td>
                        <td className={`py-3 px-4 text-sm font-medium ${textPrimary}`}>{c.spend}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* LOGS TAB */}
        {activeTab === 'logs' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Log Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Logs', value: logStats.total, color: 'text-indigo-400' },
                { label: 'Last 24h', value: logStats.last24h, color: 'text-green-400' },
                { label: 'Warnings', value: logStats.byLevel.warning, color: 'text-amber-400' },
                { label: 'Errors', value: logStats.byLevel.error, color: 'text-red-400' },
              ].map((s, i) => (
                <div key={i} className={cardClass}>
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className={`text-sm ${textSecondary}`}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className={cardClass}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h3 className={`text-lg font-semibold mb-4 md:mb-0 ${textPrimary}`}>{t('logs.title')}</h3>
                <div className="flex items-center space-x-3">
                  <button onClick={() => {
                    const blob = new Blob([loggingService.exportLogs()], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = `nexus-logs-${Date.now()}.json`; a.click();
                    loggingService.logUserAction('Logs exported');
                  }} className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition ${isDark ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    <Download className="w-4 h-4" /><span>{t('logs.export')}</span>
                  </button>
                  <button onClick={refreshData} className={`p-2 rounded-lg transition ${isDark ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: t('logs.all') },
                    { id: 'auth', label: t('logs.auth') },
                    { id: 'data', label: t('logs.data') },
                    { id: 'system', label: t('logs.system') },
                    { id: 'security', label: 'Security' },
                    { id: 'navigation', label: 'Navigation' },
                    { id: 'user_action', label: 'User Actions' },
                  ].map(f => (
                    <button key={f.id} onClick={() => setLogFilter(f.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        logFilter === f.id ? 'bg-indigo-500 text-white' : isDark ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >{f.label}</button>
                  ))}
                </div>
                <div className="relative flex-1">
                  <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
                  <input type="text" placeholder={t('logs.search')} value={logSearch} onChange={(e) => setLogSearch(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-indigo-500 ${
                      isDark ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                </div>
              </div>

              {/* Log Entries */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {searchedLogs.length === 0 ? (
                  <div className={`text-center py-12 ${textSecondary}`}>
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No logs found. Interact with the app to generate logs.</p>
                  </div>
                ) : (
                  searchedLogs.slice(0, 50).map((log) => (
                    <div key={log.id} className={`flex items-start space-x-3 p-3 rounded-lg transition ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        log.level === 'success' ? 'bg-green-500/20' : log.level === 'warning' ? 'bg-amber-500/20' : log.level === 'error' ? 'bg-red-500/20' : 'bg-blue-500/20'
                      }`}>
                        {log.level === 'success' ? <CheckCircle className="w-4 h-4 text-green-400" /> :
                         log.level === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-400" /> :
                         log.level === 'error' ? <AlertCircle className="w-4 h-4 text-red-400" /> :
                         <FileText className="w-4 h-4 text-blue-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} truncate`}>{log.message}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className={`text-xs ${textMuted} flex items-center`}><Clock className="w-3 h-3 mr-1" />{new Date(log.timestamp).toLocaleString()}</span>
                          <span className={`text-xs ${textMuted} flex items-center`}><Server className="w-3 h-3 mr-1" />{log.source}</span>
                          {log.ipAddress && <span className={`text-xs ${textMuted}`}>IP: {log.ipAddress}</span>}
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full capitalize flex-shrink-0 ${
                        log.level === 'success' ? 'bg-green-500/20 text-green-400' : log.level === 'warning' ? 'bg-amber-500/20 text-amber-400' : log.level === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>{log.level}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Security Score */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className={`${cardClass} text-center`}>
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke={securityService.getSecurityScore() > 80 ? '#22c55e' : securityService.getSecurityScore() > 50 ? '#f59e0b' : '#ef4444'} strokeWidth="8" strokeDasharray={`${securityService.getSecurityScore() * 2.51} 251`} strokeLinecap="round" />
                  </svg>
                  <div className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${textPrimary}`}>
                    {securityService.getSecurityScore()}
                  </div>
                </div>
                <h4 className={`font-semibold ${textPrimary}`}>Security Score</h4>
                <p className={`text-sm ${textSecondary}`}>Overall system health</p>
              </div>

              <div className={cardClass}>
                <h4 className={`font-semibold mb-4 ${textPrimary}`}>Security Status</h4>
                <div className="space-y-3">
                  {[
                    { label: t('security.2fa'), status: true, icon: Fingerprint },
                    { label: t('security.encryption'), status: true, icon: Lock },
                    { label: t('security.firewall'), status: true, icon: Shield },
                    { label: 'CSRF Protection', status: true, icon: Wifi },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <item.icon className="w-4 h-4 text-indigo-400" />
                        <span className={`text-sm ${textSecondary}`}>{item.label}</span>
                      </div>
                      <span className="text-xs text-green-400 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />{t('security.enabled')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={cardClass}>
                <h4 className={`font-semibold mb-4 ${textPrimary}`}>{t('security.sessions')} ({sessions.length})</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {sessions.length === 0 ? (
                    <p className={`text-sm ${textMuted}`}>No active sessions</p>
                  ) : sessions.map((s) => (
                    <div key={s.id} className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium ${textPrimary}`}>{s.device}</span>
                        <span className="text-xs text-green-400">Active</span>
                      </div>
                      <div className={`text-xs ${textMuted}`}>{s.location} • {s.ip}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Security Events */}
            <div className={cardClass}>
              <h3 className={`text-lg font-semibold mb-4 ${textPrimary}`}>{t('security.audit')}</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {securityEvents.length === 0 ? (
                  <div className={`text-center py-12 ${textSecondary}`}>
                    <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No security events recorded yet.</p>
                  </div>
                ) : securityEvents.slice(0, 30).map((event) => (
                  <div key={event.id} className={`flex items-start space-x-3 p-3 rounded-lg ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      event.severity === 'critical' ? 'bg-red-500/20' : event.severity === 'high' ? 'bg-orange-500/20' : event.severity === 'medium' ? 'bg-amber-500/20' : 'bg-blue-500/20'
                    }`}>
                      {event.severity === 'critical' || event.severity === 'high' ? <AlertTriangle className="w-4 h-4 text-red-400" /> : <Shield className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{event.description}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`text-xs ${textMuted}`}>{new Date(event.timestamp).toLocaleString()}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                          event.severity === 'critical' ? 'bg-red-500/20 text-red-400' : event.severity === 'high' ? 'bg-orange-500/20 text-orange-400' : event.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>{event.severity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* SYSTEM TAB */}
        {activeTab === 'system' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'API Server', status: 'healthy', uptime: '99.98%', cpu: '23%', memory: '4.2GB / 8GB', icon: Server },
                { name: 'Database', status: 'healthy', uptime: '99.99%', cpu: '45%', memory: '12GB / 32GB', icon: Database },
                { name: 'Auth Service', status: 'healthy', uptime: '99.95%', cpu: '12%', memory: '1.8GB / 4GB', icon: Shield },
                { name: 'CDN', status: 'healthy', uptime: '100%', cpu: '8%', memory: '2GB / 4GB', icon: Wifi },
                { name: 'ML Pipeline', status: 'warning', uptime: '98.5%', cpu: '78%', memory: '28GB / 32GB', icon: Activity },
                { name: 'Storage', status: 'healthy', uptime: '99.99%', cpu: '5%', memory: '450GB / 1TB', icon: Database },
              ].map((service, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={cardClass}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <service.icon className="w-6 h-6 text-indigo-400" />
                      <h4 className={`font-semibold ${textPrimary}`}>{service.name}</h4>
                    </div>
                    <span className={`flex items-center text-xs ${service.status === 'healthy' ? 'text-green-400' : 'text-amber-400'}`}>
                      <span className={`w-2 h-2 rounded-full mr-1.5 ${service.status === 'healthy' ? 'bg-green-400' : 'bg-amber-400'}`} />{service.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {[['Uptime', service.uptime], ['CPU', service.cpu], ['Memory', service.memory]].map(([label, val], j) => (
                      <div key={j} className="flex justify-between text-sm">
                        <span className={textSecondary}>{label}</span>
                        <span className={`font-medium ${textPrimary}`}>{val}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
