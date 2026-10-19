import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import FileUpload from '../components/ui/FileUpload';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { User, Mail, MapPin, Link as LinkIcon, Briefcase, Save, Camera, LogIn } from 'lucide-react';

export default function Profile() {
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      addToast({
        type: 'warning',
        title: 'Authentication Required',
        message: 'Please sign in to access your profile',
      });
      navigate('/login');
    }
  }, [isAuthenticated, navigate, addToast]);
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    headline: '',
    location: '',
    website: '',
    bio: '',
  });

  const handleAvatarUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      // Create object URL for preview
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      setIsUploading(false);
      setUploadProgress(0);

      addToast({
        type: 'success',
        title: 'Avatar Updated',
        message: 'Your profile picture has been updated successfully',
      });
    }, 2200);
  };

  const handleSave = () => {
    addToast({
      type: 'success',
      title: 'Profile Saved',
      message: 'Your profile has been updated successfully',
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="pt-20 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Profile Settings
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your profile information and avatar
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Avatar Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card padding="lg">
              <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Profile Picture
              </h2>
              
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                {/* Avatar Preview */}
                <div className="relative">
                  <div className={`w-32 h-32 rounded-full overflow-hidden ${
                    isDark ? 'bg-white/5 border-2 border-white/10' : 'bg-gray-100 border-2 border-gray-200'
                  }`}>
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className={`w-16 h-16 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                      </div>
                    )}
                  </div>
                  {avatarUrl && (
                    <div className="absolute bottom-0 right-0">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                        <Camera className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload Area */}
                <div className="flex-1 w-full">
                  <FileUpload
                    onFileSelect={handleAvatarUpload}
                    accept="image/*"
                    maxSize={5}
                    label="Upload Profile Picture"
                    description="JPG, PNG or GIF. Max 5MB."
                    isUploading={isUploading}
                    uploadProgress={uploadProgress}
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card padding="lg">
              <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Personal Information
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    icon={<User className="w-5 h-5" />}
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="John Doe"
                  />
                  <Input
                    label="Email Address"
                    icon={<Mail className="w-5 h-5" />}
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>

                <Input
                  label="Professional Headline"
                  icon={<Briefcase className="w-5 h-5" />}
                  value={formData.headline}
                  onChange={(e) => handleChange('headline', e.target.value)}
                  placeholder="Full Stack Developer"
                />

                <Input
                  label="Location"
                  icon={<MapPin className="w-5 h-5" />}
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="San Francisco, CA"
                />

                <Input
                  label="Website"
                  icon={<LinkIcon className="w-5 h-5" />}
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://yoursite.com"
                />

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 resize-none ${
                      isDark
                        ? 'border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20'
                    }`}
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Save className="w-5 h-5" />}
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
