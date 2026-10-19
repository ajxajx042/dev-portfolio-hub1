import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../components/ui/Toast';
import FileUpload from '../components/ui/FileUpload';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Briefcase, Plus, Image, Save, Trash2 } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
}

export default function PortfolioManager() {
  const { isDark } = useTheme();
  const { addToast } = useToast();
  
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverProgress, setCoverProgress] = useState(0);
  
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', title: 'Project 1', description: 'Description 1', imageUrl: null },
    { id: '2', title: 'Project 2', description: 'Description 2', imageUrl: null },
  ]);
  
  const [uploadingProject, setUploadingProject] = useState<string | null>(null);
  const [projectProgress, setProjectProgress] = useState(0);

  const handleCoverUpload = (file: File) => {
    setIsUploadingCover(true);
    setCoverProgress(0);

    const interval = setInterval(() => {
      setCoverProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      const url = URL.createObjectURL(file);
      setCoverImage(url);
      setIsUploadingCover(false);
      setCoverProgress(0);

      addToast({
        type: 'success',
        title: 'Cover Updated',
        message: 'Portfolio cover image has been updated',
      });
    }, 2200);
  };

  const handleProjectImageUpload = (projectId: string, file: File) => {
    setUploadingProject(projectId);
    setProjectProgress(0);

    const interval = setInterval(() => {
      setProjectProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      const url = URL.createObjectURL(file);
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, imageUrl: url } : p))
      );
      setUploadingProject(null);
      setProjectProgress(0);

      addToast({
        type: 'success',
        message: 'Project image uploaded successfully',
      });
    }, 2200);
  };

  const addProject = () => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      title: `Project ${projects.length + 1}`,
      description: '',
      imageUrl: null,
    };
    setProjects([...projects, newProject]);
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    addToast({
      type: 'info',
      message: 'Project removed',
    });
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSave = () => {
    addToast({
      type: 'success',
      title: 'Portfolio Saved',
      message: 'Your portfolio has been updated successfully',
    });
  };

  return (
    <div className="pt-20 pb-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Portfolio Manager
              </h1>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Create and manage your portfolio with images and projects
              </p>
            </div>
            <Button variant="primary" icon={<Save className="w-5 h-5" />} onClick={handleSave}>
              Save Portfolio
            </Button>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Portfolio Cover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card padding="lg">
              <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Portfolio Cover Image
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cover Preview */}
                <div className={`aspect-video rounded-xl overflow-hidden ${
                  isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-100 border border-gray-200'
                }`}>
                  {coverImage ? (
                    <img src={coverImage} alt="Portfolio Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className={`w-16 h-16 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                    </div>
                  )}
                </div>

                {/* Upload Area */}
                <div>
                  <FileUpload
                    onFileSelect={handleCoverUpload}
                    accept="image/*"
                    maxSize={10}
                    label="Upload Cover Image"
                    description="Recommended: 1200x630px. Max 10MB."
                    isUploading={isUploadingCover}
                    uploadProgress={coverProgress}
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Projects ({projects.length})
                </h2>
                <Button variant="secondary" icon={<Plus className="w-5 h-5" />} onClick={addProject}>
                  Add Project
                </Button>
              </div>

              <div className="space-y-6">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-6 rounded-xl ${
                      isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Project {index + 1}
                      </h3>
                      <button
                        onClick={() => removeProject(project.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-500'
                        }`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Project Info */}
                      <div className="space-y-4">
                        <Input
                          label="Project Title"
                          value={project.title}
                          onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                          placeholder="Enter project title"
                        />
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Description
                          </label>
                          <textarea
                            value={project.description}
                            onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                            placeholder="Describe your project..."
                            rows={3}
                            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 resize-none ${
                              isDark
                                ? 'border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Project Image */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Project Image
                        </label>
                        <FileUpload
                          onFileSelect={(file) => handleProjectImageUpload(project.id, file)}
                          accept="image/*"
                          maxSize={10}
                          label="Upload Project Image"
                          description="Max 10MB"
                          isUploading={uploadingProject === project.id}
                          uploadProgress={uploadingProject === project.id ? projectProgress : 0}
                          currentFile={project.imageUrl || undefined}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
