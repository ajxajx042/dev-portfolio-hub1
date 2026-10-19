import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle, AlertCircle, File, Image, Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  label?: string;
  description?: string;
  currentFile?: string;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string;
}

export default function FileUpload({
  onFileSelect,
  accept = 'image/*',
  maxSize = 5,
  multiple = false,
  label = 'Upload File',
  description = 'Drag and drop or click to browse',
  currentFile,
  isUploading = false,
  uploadProgress = 0,
  error,
}: FileUploadProps) {
  const { isDark } = useTheme();
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    if (file.size > maxSize * 1024 * 1024) {
      return false;
    }
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        handleFile(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        handleFile(file);
      }
    }
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    
    onFileSelect(file);
  };

  const removeFile = () => {
    setPreview(null);
    setFileName(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const isImage = preview !== null;

  return (
    <div className="w-full">
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isUploading && inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
          transition-all duration-300
          ${dragActive 
            ? isDark 
              ? 'border-indigo-500 bg-indigo-500/10' 
              : 'border-indigo-500 bg-indigo-50'
            : isDark 
              ? 'border-white/20 hover:border-indigo-500/50 hover:bg-white/5' 
              : 'border-gray-300 hover:border-indigo-500 hover:bg-gray-50'
          }
          ${isUploading ? 'cursor-not-allowed opacity-75' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          disabled={isUploading}
        />

        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="relative w-16 h-16 mx-auto">
                <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-indigo-500">{uploadProgress}%</span>
                </div>
              </div>
              <div>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Uploading...
                </p>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {fileName}
                </p>
              </div>
              {/* Progress bar */}
              <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                />
              </div>
            </motion.div>
          ) : preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-4"
            >
              <div className="relative inline-block">
                {isImage ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-48 rounded-lg mx-auto"
                  />
                ) : (
                  <div className={`w-20 h-20 mx-auto rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-white/10' : 'bg-gray-100'
                  }`}>
                    <File className="w-10 h-10 text-indigo-500" />
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center
                    ${isDark ? 'bg-red-500 hover:bg-red-600' : 'bg-red-500 hover:bg-red-600'} text-white
                    transition-colors`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {fileName}
                </p>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Click or drag to replace
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
                isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'
              }`}>
                {accept.includes('image') ? (
                  <Image className={`w-8 h-8 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                ) : (
                  <Upload className={`w-8 h-8 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                )}
              </div>
              <div>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {label}
                </p>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {description}
                </p>
                <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Max size: {maxSize}MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center space-x-2 text-red-500 text-sm"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
}
