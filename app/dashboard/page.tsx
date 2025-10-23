'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/session';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  PlusIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { getProjects, triggerProjectPipeline, deleteProject } from '@/lib/actions/project-actions';
import { getRecentPipelines } from '@/lib/actions/pipeline-actions';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user: session, loading } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [recentPipelines, setRecentPipelines] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session && !loading) {
      loadData();
    }
  }, [session, loading]);

  const loadData = async () => {
    try {
      const [projectsData, pipelinesData] = await Promise.all([
        getProjects(),
        getRecentPipelines(5)
      ]);
      
      setProjects(projectsData);
      setRecentPipelines(pipelinesData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = () => {
    setIsCreateModalOpen(true);
  };

  const handleProjectCreated = () => {
    loadData();
  };

  const handleTriggerPipeline = async (projectId: string) => {
    try {
      const result = await triggerProjectPipeline(projectId);
      if (result.success) {
        toast.success('Pipeline triggered successfully!');
        loadData();
      } else {
        toast.error(result.error || 'Failed to trigger pipeline');
      }
    } catch (error) {
      toast.error('Failed to trigger pipeline');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await deleteProject(projectId);
      if (result.success) {
        toast.success('Project deleted successfully');
        loadData();
      } else {
        toast.error(result.error || 'Failed to delete project');
      }
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-github-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-github-accent mx-auto mb-4"></div>
          <p className="text-github-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-github-bg flex items-center justify-center">
        <Card variant="glass" className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-github-text mb-4">Authentication Required</h2>
            <p className="text-github-text-secondary mb-6">Please sign in to access the dashboard.</p>
            <Button onClick={() => window.location.href = '/api/auth/signin'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Projects',
      value: projects.length,
      icon: RocketLaunchIcon,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      label: 'Active Pipelines',
      value: recentPipelines.filter(p => p.status === 'RUNNING').length,
      icon: ClockIcon,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10'
    },
    {
      label: 'Successful Deployments',
      value: recentPipelines.filter(p => p.status === 'SUCCESS').length,
      icon: CheckCircleIcon,
      color: 'text-green-400',
      bg: 'bg-green-500/10'
    },
    {
      label: 'Failed Deployments',
      value: recentPipelines.filter(p => p.status === 'FAILED').length,
      icon: XCircleIcon,
      color: 'text-red-400',
      bg: 'bg-red-500/10'
    }
  ];

  return (
    <div className="min-h-screen bg-github-bg">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-github-text mb-2">
            Welcome back, {session?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-github-text-secondary text-lg">
            Manage your projects and monitor deployments from your dashboard.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={stat.label} variant="glass" hover>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-github-text-secondary text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-github-text mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-github-text">Your Projects</h2>
            <Button onClick={handleCreateProject}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Project
            </Button>
          </div>

          {projects.length === 0 ? (
            <Card variant="glass" className="text-center py-12">
              <CardContent>
                <RocketLaunchIcon className="h-16 w-16 text-github-text-tertiary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-github-text mb-2">No projects yet</h3>
                <p className="text-github-text-secondary mb-6">
                  Create your first Next.js project to get started with automated deployments.
                </p>
                <Button onClick={handleCreateProject}>
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Your First Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ProjectCard
                    project={project}
                    onTriggerPipeline={handleTriggerPipeline}
                    onDelete={handleDeleteProject}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Activity */}
        {recentPipelines.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-github-text mb-6">Recent Activity</h2>
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-github-text">Pipeline Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPipelines.map((pipeline, index) => (
                    <div key={pipeline.id} className="flex items-center justify-between p-4 bg-github-bg-tertiary rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          pipeline.status === 'SUCCESS' ? 'bg-green-500/10' :
                          pipeline.status === 'FAILED' ? 'bg-red-500/10' :
                          pipeline.status === 'RUNNING' ? 'bg-blue-500/10' :
                          'bg-yellow-500/10'
                        }`}>
                          {pipeline.status === 'SUCCESS' ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-400" />
                          ) : pipeline.status === 'FAILED' ? (
                            <XCircleIcon className="h-5 w-5 text-red-400" />
                          ) : (
                            <ClockIcon className="h-5 w-5 text-blue-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-github-text font-medium">{pipeline.project?.name}</p>
                          <p className="text-github-text-secondary text-sm">
                            {pipeline.stage && `${pipeline.stage} • `}
                            {new Date(pipeline.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        pipeline.status === 'SUCCESS' ? 'bg-green-500/10 text-green-400' :
                        pipeline.status === 'FAILED' ? 'bg-red-500/10 text-red-400' :
                        pipeline.status === 'RUNNING' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {pipeline.status}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      <Footer />

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleProjectCreated}
      />
    </div>
  );
}
