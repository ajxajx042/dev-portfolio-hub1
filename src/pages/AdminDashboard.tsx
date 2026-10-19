import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Users, Eye, TrendingUp, Activity, AlertCircle, CheckCircle, Clock,
  Database, Server, Shield, FileText, ArrowUpRight, ArrowDownRight,
  Lock, Search, Bell, Settings
} from 'lucide-react';

// Mock data
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
  { id: 'C007', name: 'CloudFirst Inc', email: 'ops@cloudfirst.com', plan: 'Professional', status: 'Inactive', joined: '2024-01-08', spend: '$12,000' },
  { id: 'C008', name: 'Bright Interiors', email: 'studio@brightinteriors.com', plan: 'Starter', status: 'Active', joined: '2024-07-12', spend: '$5,200' },
];

const systemLogs = [
  { id: 1, time: '2026-01-15 14:32:01', type: 'info', message: 'User sarah@techventures.com logged in', source: 'Auth Service' },
  { id: 2, time: '2026-01-15 14:31:45', type: 'success', message: 'Project "E-Commerce v2" deployed successfully', source: 'CI/CD Pipeline' },
  { id: 3, time: '2026-01-15 14:30:22', type: 'warning', message: 'High memory usage detected on Server-03 (89%)', source: 'Monitoring' },
  { id: 4, time: '2026-01-15 14:29:10', type: 'info', message: 'New company registration: NexGen Solutions', source: 'Registration' },
  { id: 5, time: '2026-01-15 14:28:55', type: 'error', message: 'Failed to connect to external API: Weather Service', source: 'API Gateway' },
  { id: 6, time: '2026-01-15 14:27:30', type: 'success', message: 'Database backup completed (2.4GB)', source: 'DB Service' },
  { id: 7, time: '2026-01-15 14:26:15', type: 'info', message: 'Portfolio page viewed 847 times today', source: 'Analytics' },
  { id: 8, time: '2026-01-15 14:25:00', type: 'warning', message: 'SSL certificate expires in 15 days', source: 'Security' },
  { id: 9, time: '2026-01-15 14:24:30', type: 'success', message: 'New team member added: Tom Wilson (Data)', source: 'HR Module' },
  { id: 10, time: '2026-01-15 14:23:15', type: 'info', message: 'Scheduled maintenance window starts in 2 hours', source: 'System' },
];

export default function AdminDashboard() {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-gray-400 mb-6">Please sign in to access the admin dashboard.</p>
          <Link to="/login" className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const filteredCustomers = customerData.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user?.name}. Here's your overview.</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button className="relative p-2 glass-light rounded-lg hover:bg-white/10 transition">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">3</span>
            </button>
            <button className="p-2 glass-light rounded-lg hover:bg-white/10 transition">
              <Settings className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 overflow-x-auto glass-light rounded-xl p-1">
          {['overview', 'customers', 'logs', 'system'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Revenue', value: '$484K', change: '+12.5%', up: true, icon: TrendingUp, color: 'text-green-400' },
                { label: 'Active Users', value: '2,847', change: '+8.2%', up: true, icon: Users, color: 'text-blue-400' },
                { label: 'Page Views', value: '45.2K', change: '+23.1%', up: true, icon: Eye, color: 'text-purple-400' },
                { label: 'Active Projects', value: '34', change: '-2.4%', up: false, icon: Activity, color: 'text-amber-400' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-light rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <span className={`flex items-center text-sm ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.change}
                      {stat.up ? <ArrowUpRight className="w-4 h-4 ml-1" /> : <ArrowDownRight className="w-4 h-4 ml-1" />}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Chart */}
              <div className="glass-light rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#colorRevenue)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Visitor Chart */}
              <div className="glass-light rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Weekly Visitors</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={visitorData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Bar dataKey="visitors" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="signups" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="glass-light rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Department Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-4 mt-2">
                  {departmentData.map((d, i) => (
                    <div key={i} className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-xs text-gray-400">{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="glass-light rounded-xl p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {systemLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        log.type === 'success' ? 'bg-green-400' :
                        log.type === 'warning' ? 'bg-amber-400' :
                        log.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-300">{log.message}</p>
                        <p className="text-xs text-gray-500">{log.time} • {log.source}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass-light rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 md:mb-0">Customer Data</h3>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 w-full md:w-64"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Company</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Plan</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Joined</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Spend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="py-3 px-4">
                          <div>
                            <div className="text-sm font-medium text-white">{customer.name}</div>
                            <div className="text-xs text-gray-500">{customer.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            customer.plan === 'Enterprise' ? 'bg-indigo-500/20 text-indigo-400' :
                            customer.plan === 'Professional' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {customer.plan}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`flex items-center text-xs ${
                            customer.status === 'Active' ? 'text-green-400' :
                            customer.status === 'Pending' ? 'text-amber-400' : 'text-red-400'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                              customer.status === 'Active' ? 'bg-green-400' :
                              customer.status === 'Pending' ? 'bg-amber-400' : 'bg-red-400'
                            }`} />
                            {customer.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-400">{customer.joined}</td>
                        <td className="py-3 px-4 text-sm font-medium text-white">{customer.spend}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass-light rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">System Logs</h3>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-xs text-green-400">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-2" />
                    Live
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {systemLogs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: log.id * 0.05 }}
                    className="flex items-start space-x-4 p-3 rounded-lg hover:bg-white/5 transition"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      log.type === 'success' ? 'bg-green-500/20' :
                      log.type === 'warning' ? 'bg-amber-500/20' :
                      log.type === 'error' ? 'bg-red-500/20' : 'bg-blue-500/20'
                    }`}>
                      {log.type === 'success' ? <CheckCircle className="w-4 h-4 text-green-400" /> :
                       log.type === 'warning' ? <AlertCircle className="w-4 h-4 text-amber-400" /> :
                       log.type === 'error' ? <AlertCircle className="w-4 h-4 text-red-400" /> :
                       <FileText className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300 truncate">{log.message}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />{log.time}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Server className="w-3 h-3 mr-1" />{log.source}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                      log.type === 'success' ? 'bg-green-500/20 text-green-400' :
                      log.type === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                      log.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {log.type}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'API Server', status: 'healthy', uptime: '99.98%', cpu: '23%', memory: '4.2GB / 8GB', icon: Server },
                { name: 'Database', status: 'healthy', uptime: '99.99%', cpu: '45%', memory: '12GB / 32GB', icon: Database },
                { name: 'Auth Service', status: 'healthy', uptime: '99.95%', cpu: '12%', memory: '1.8GB / 4GB', icon: Shield },
                { name: 'CDN', status: 'healthy', uptime: '100%', cpu: '8%', memory: '2GB / 4GB', icon: Globe },
                { name: 'ML Pipeline', status: 'warning', uptime: '98.5%', cpu: '78%', memory: '28GB / 32GB', icon: Activity },
                { name: 'Storage', status: 'healthy', uptime: '99.99%', cpu: '5%', memory: '450GB / 1TB', icon: Database },
              ].map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-light rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <service.icon className="w-6 h-6 text-indigo-400" />
                      <h4 className="font-semibold text-white">{service.name}</h4>
                    </div>
                    <span className={`flex items-center text-xs ${
                      service.status === 'healthy' ? 'text-green-400' : 'text-amber-400'
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-1.5 ${
                        service.status === 'healthy' ? 'bg-green-400' : 'bg-amber-400'
                      }`} />
                      {service.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Uptime</span>
                      <span className="text-white font-medium">{service.uptime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">CPU</span>
                      <span className="text-white font-medium">{service.cpu}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Memory</span>
                      <span className="text-white font-medium">{service.memory}</span>
                    </div>
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

function Globe(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
    </svg>
  );
}
