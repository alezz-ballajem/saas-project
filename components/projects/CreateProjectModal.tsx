'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { XMarkIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { createProject } from '@/lib/actions/project-actions';
import toast from 'react-hot-toast';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  name: string;
  description: string;
}

export function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      const result = await createProject({
        name: data.name,
        description: data.description,
        groupId: process.env.NEXT_PUBLIC_GITLAB_GROUP_ID || 'nextjs'
      });

      if (result.success) {
        toast.success('Project created successfully!');
        reset();
        onClose();
        onSuccess?.();
      } else {
        toast.error(result.error || 'Failed to create project');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Error creating project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md"
          >
            <Card variant="glass" className="border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500">
                      <RocketLaunchIcon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-white">Create New Project</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    disabled={isLoading}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <Input
                    label="Project Name"
                    placeholder="Enter project name (e.g., nextjs-demo14)"
                    {...register('name', {
                      required: 'Project name is required',
                      pattern: {
                        value: /^[a-z0-9-]+$/,
                        message: 'Project name must contain only lowercase letters, numbers, and hyphens'
                      },
                      minLength: {
                        value: 3,
                        message: 'Project name must be at least 3 characters'
                      }
                    })}
                    error={errors.name?.message}
                    helper="This will be used as the GitLab repository name"
                  />

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      className="input-field w-full h-24 resize-none"
                      placeholder="Describe your project..."
                      {...register('description')}
                    />
                  </div>

                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-white mb-2">What happens next?</h4>
                    <ul className="text-xs text-white/60 space-y-1">
                      <li>• GitLab repository will be created</li>
                      <li>• Next.js project will be scaffolded</li>
                      <li>• CI/CD pipeline will be configured</li>
                      <li>• Project will be deployed to test environment</li>
                    </ul>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleClose}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={isLoading}
                      className="flex-1"
                    >
                      Create Project
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
