import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../components/ui/Toast';
import {
  LayoutDashboard,
  Users,
  Shield,
  FileText,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Zap,
} from 'lucide-react';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const { addToast } = useToast();

  // Check if user is admin
  if (user && user.role !== 'admin') {
    addToast({
      type: 'error',
      title: 'Access Denied',
      message: 'You do not have permission to access the admin panel',
    });
    navigate('/');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    addToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been logged out successfully',
    });
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Content Moderation', path: '/admin/moderation', icon: Shield },
    { name: 'System Logs', path: '/admin/logs', icon: FileText },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg ${
          isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900 shadow-lg'
        }`}
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 20 }}
            className={`fixed lg:static inset-y-0 left-0 z-40 w-64 ${
              isDark ? 'bg-slate-800 border-r border-slate-700' : 'bg-white border-r border-slate-200'
            } flex flex-col`}
          >
            {/* Logo */}
            <div className={`p-6 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <Link to="/admin" className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Admin Panel
                  </h1>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    NexusTeam
                  </p>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      active
                        ? isDark
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                        : isDark
                        ? 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="flex-1">{item.name}</span>
                    {active && <ChevronRight className="w-4 h-4" />}
                  </Link>
                );
              })}
            </nav>

            {/* User Info & Logout */}
            <div className={`p-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className={`p-3 rounded-lg mb-3 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {user?.name || 'Admin'}
                    </p>
                    <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {user?.email || 'admin@nexusteam.com'}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition ${
                  isDark
                    ? 'text-slate-400 hover:bg-red-500/10 hover:text-red-400'
                    : 'text-slate-600 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-0">
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
