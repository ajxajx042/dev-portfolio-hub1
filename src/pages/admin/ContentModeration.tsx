import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../components/ui/Toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Shield, CheckCircle, XCircle, Eye, AlertTriangle } from 'lucide-react';

interface Content {
  id: string;
  userId: string;
  userName: string;
  type: 'portfolio' | 'project';
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  flagged: boolean;
  flagReason?: string;
  createdAt: string;
}

export default function ContentModeration() {
  const { isDark } = useTheme();
  const { addToast } = useToast();
  const [content, setContent] = useState<Content[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'flagged'>('all');

  useEffect(() => {
    // Load content from localStorage
    const loadContent = () => {
      const storedContent = JSON.parse(localStorage.getItem('content') || '[]');
      setContent(storedContent);
    };
    loadContent();
  }, []);

  const filteredContent = content.filter((item) => {
    if (filter === 'pending') return item.status === 'pending';
    if (filter === 'flagged') return item.flagged;
    return true;
  });

  const handleApprove = (contentId: string) => {
    const updatedContent = content.map(c => 
      c.id === contentId ? { ...c, status: 'approved' as const, flagged: false } : c
    );
    setContent(updatedContent);
    localStorage.setItem('content', JSON.stringify(updatedContent));
    addToast({
      type: 'success',
      title: 'Content Approved',
      message: 'Content has been approved and is now live',
    });
  };

  const handleReject = (contentId: string) => {
    const updatedContent = content.map(c => 
      c.id === contentId ? { ...c, status: 'rejected' as const } : c
    );
    setContent(updatedContent);
    localStorage.setItem('content', JSON.stringify(updatedContent));
    addToast({
      type: 'warning',
      title: 'Content Rejected',
      message: 'Content has been rejected',
    });
  };

  const handleUnflag = (contentId: string) => {
    const updatedContent = content.map(c => 
      c.id === contentId ? { ...c, flagged: false, flagReason: undefined } : c
    );
    setContent(updatedContent);
    localStorage.setItem('content', JSON.stringify(updatedContent));
    addToast({
      type: 'info',
      title: 'Flag Removed',
      message: 'Content flag has been removed',
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
          Content Moderation
        </h1>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          Review and moderate user-submitted content
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'secondary'}
              onClick={() => setFilter('all')}
            >
              All Content
            </Button>
            <Button
              variant={filter === 'pending' ? 'primary' : 'secondary'}
              onClick={() => setFilter('pending')}
            >
              Pending Review
            </Button>
            <Button
              variant={filter === 'flagged' ? 'primary' : 'secondary'}
              onClick={() => setFilter('flagged')}
            >
              Flagged
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Content List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="space-y-4">
          {filteredContent.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.type === 'portfolio'
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {item.type}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === 'approved'
                          ? 'bg-green-500/20 text-green-400'
                          : item.status === 'rejected'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {item.status}
                      </span>
                      {item.flagged && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Flagged
                        </span>
                      )}
                    </div>
                    <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {item.title}
                    </h3>
                    <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      by {item.userName} • {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                    {item.flagged && item.flagReason && (
                      <div className={`p-3 rounded-lg mt-3 ${isDark ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
                        <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                          <strong>Flag Reason:</strong> {item.flagReason}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<Eye className="w-4 h-4" />}
                    >
                      View
                    </Button>
                    {item.status !== 'approved' && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<CheckCircle className="w-4 h-4" />}
                        onClick={() => handleApprove(item.id)}
                      >
                        Approve
                      </Button>
                    )}
                    {item.status !== 'rejected' && (
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<XCircle className="w-4 h-4" />}
                        onClick={() => handleReject(item.id)}
                      >
                        Reject
                      </Button>
                    )}
                    {item.flagged && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleUnflag(item.id)}
                      >
                        Unflag
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <Shield className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>No content to moderate</p>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
