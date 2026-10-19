import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import FileUpload from '../components/ui/FileUpload';
import Card from '../components/ui/Card';
import { Upload, Image, FileText, Video, Music, Folder, CheckCircle, X } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
  category: string;
}

export default function UploadCenter() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = (file: File, category: string) => {
    setUploadingFile(file.name);
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

    // Simulate file upload completion
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        uploadedAt: new Date(),
        category,
      };

      setUploadedFiles((prev) => [...prev, newFile]);
      setUploadingFile(null);
      setUploadProgress(0);

      addToast({
        type: 'success',
        title: 'Upload Complete',
        message: `${file.name} has been uploaded successfully`,
      });
    }, 2200);
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
    addToast({
      type: 'info',
      message: 'File removed successfully',
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (type.startsWith('video/')) return <Video className="w-5 h-5" />;
    if (type.startsWith('audio/')) return <Music className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const uploadCategories = [
    {
      id: 'profile',
      title: 'Profile Picture',
      description: 'Upload your profile avatar',
      icon: '👤',
      accept: 'image/*',
      maxSize: 5,
    },
    {
      id: 'portfolio',
      title: 'Portfolio Cover',
      description: 'Upload a cover image for your portfolio',
      icon: '🎨',
      accept: 'image/*',
      maxSize: 10,
    },
    {
      id: 'project',
      title: 'Project Images',
      description: 'Upload images for your projects',
      icon: '📸',
      accept: 'image/*',
      maxSize: 10,
    },
    {
      id: 'documents',
      title: 'Documents',
      description: 'Upload PDFs, Word docs, and more',
      icon: '📄',
      accept: '.pdf,.doc,.docx,.txt',
      maxSize: 20,
    },
    {
      id: 'media',
      title: 'Media Files',
      description: 'Upload videos and audio files',
      icon: '🎬',
      accept: 'video/*,audio/*',
      maxSize: 100,
    },
    {
      id: 'other',
      title: 'Other Files',
      description: 'Upload any other file types',
      icon: '📁',
      accept: '*/*',
      maxSize: 50,
    },
  ];

  return (
    <div className="pt-20 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-3 rounded-xl ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
              <Upload className={`w-6 h-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Upload Center
              </h1>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Upload and manage your files, images, and media
              </p>
            </div>
          </div>
        </motion.div>

        {/* Upload Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {uploadCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card padding="lg">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-3xl">{category.icon}</span>
                  <div>
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {category.title}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {category.description}
                    </p>
                  </div>
                </div>
                <FileUpload
                  onFileSelect={(file) => handleFileUpload(file, category.id)}
                  accept={category.accept}
                  maxSize={category.maxSize}
                  label={`Upload ${category.title}`}
                  description="Drag & drop or click to browse"
                  isUploading={uploadingFile !== null}
                  uploadProgress={uploadingFile ? uploadProgress : 0}
                />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Folder className={`w-6 h-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Uploaded Files ({uploadedFiles.length})
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uploadedFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`relative group rounded-xl overflow-hidden ${
                      isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {/* Preview */}
                    {file.type.startsWith('image/') ? (
                      <div className="aspect-video relative">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => removeFile(file.id)}
                            className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={`aspect-video flex items-center justify-center ${
                        isDark ? 'bg-white/5' : 'bg-gray-100'
                      }`}>
                        <div className={`p-4 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                          {getFileIcon(file.type)}
                        </div>
                      </div>
                    )}

                    {/* File Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {file.name}
                          </p>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {file.category}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {file.uploadedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Empty State */}
        {uploadedFiles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Folder className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-lg font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              No files uploaded yet
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Upload your first file using one of the upload zones above
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
