import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../components/ui/Toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Users, Search, Filter, Edit, Trash2, Eye, Shield } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'moderator';
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  lastLogin: string;
}

export default function UserManagement() {
  const { isDark } = useTheme();
  const { addToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    // Load users from localStorage
    const loadUsers = () => {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      setUsers(storedUsers);
    };
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      addToast({
        type: 'success',
        title: 'User Deleted',
        message: 'User has been removed successfully',
      });
    }
  };

  const handleToggleStatus = (userId: string) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return { ...u, status: (u.status === 'active' ? 'suspended' : 'active') as User['status'] };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    addToast({
      type: 'success',
      title: 'Status Updated',
      message: 'User status has been updated',
    });
  };

  const handleMakeAdmin = (userId: string) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return { ...u, role: (u.role === 'admin' ? 'user' : 'admin') as User['role'] };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    addToast({
      type: 'success',
      title: 'Role Updated',
      message: 'User role has been updated',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          User Management
        </h1>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          Manage all registered users and their permissions
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
              <option value="moderator">Moderators</option>
            </select>
          </div>
        </Card>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                  <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    User
                  </th>
                  <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Role
                  </th>
                  <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Status
                  </th>
                  <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Joined
                  </th>
                  <th className={`text-left py-3 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Last Login
                  </th>
                  <th className={`text-right py-3 px-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'} hover:${
                      isDark ? 'bg-slate-800/50' : 'bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {user.name}
                          </p>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-400'
                          : user.role === 'moderator'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : user.status === 'suspended'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className={`p-2 rounded-lg transition ${
                            isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                          }`}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMakeAdmin(user.id)}
                          className={`p-2 rounded-lg transition ${
                            isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                          }`}
                          title={user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`p-2 rounded-lg transition ${
                            isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                          }`}
                          title={user.status === 'active' ? 'Suspend User' : 'Activate User'}
                        >
                          {user.status === 'active' ? (
                            <Trash2 className="w-4 h-4 text-red-500" />
                          ) : (
                            <Edit className="w-4 h-4 text-green-500" />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>No users found</p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`max-w-2xl w-full rounded-2xl p-6 ${
              isDark ? 'bg-slate-800' : 'bg-white'
            }`}
          >
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              User Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Name
                </label>
                <p className={isDark ? 'text-white' : 'text-slate-900'}>{selectedUser.name}</p>
              </div>
              <div>
                <label className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Email
                </label>
                <p className={isDark ? 'text-white' : 'text-slate-900'}>{selectedUser.email}</p>
              </div>
              <div>
                <label className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Role
                </label>
                <p className={isDark ? 'text-white' : 'text-slate-900'}>{selectedUser.role}</p>
              </div>
              <div>
                <label className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Status
                </label>
                <p className={isDark ? 'text-white' : 'text-slate-900'}>{selectedUser.status}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setSelectedUser(null)}>Close</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
