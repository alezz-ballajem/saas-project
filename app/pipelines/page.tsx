'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PipelineCard } from '@/components/pipelines/PipelineCard';
import { PipelineLogs } from '@/components/pipelines/PipelineLogs';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  FunnelIcon,
  ArrowPathIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { getRecentPipelines } from '@/lib/actions/pipeline-actions';
import toast from 'react-hot-toast';

const statusFilters = [
  { key: 'all', label: 'All', icon: FunnelIcon },
  { key: 'RUNNING', label: 'Running', icon: PlayIcon },
  { key: 'SUCCESS', label: 'Success', icon: CheckCircleIcon },
  { key: 'FAILED', label: 'Failed', icon: XCircleIcon },
  { key: 'PENDING', label: 'Pending', icon: ClockIcon },
];

export default function PipelinesPage() {
  const { data: session, status } = useSession();
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [filteredPipelines, setFilteredPipelines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPipeline, setSelectedPipeline] = useState<any>(null);
  const [isLogsOpen, setIsLogsOpen] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      loadPipelines();
    }
  }, [status]);

  useEffect(() => {
    filterPipelines();
  }, [pipelines, selectedFilter]);

  const loadPipelines = async () => {
    try {
      const data = await getRecentPipelines(50);
      setPipelines(data);
    } catch (error) {
      console.error('Error loading pipelines:', error);
      toast.error('Failed to load pipelines');
    } finally {
      setIsLoading(false);
    }
  };

  const filterPipelines = () => {
    if (selectedFilter === 'all') {
      setFilteredPipelines(pipelines);
    } else {
      setFilteredPipelines(pipelines.filter(p => p.status === selectedFilter));
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    loadPipelines();
  };

  const handleViewDetails = (pipelineId: string) => {
    const pipeline = pipelines.find(p => p.id === pipelineId);
    if (pipeline) {
      setSelectedPipeline(pipeline);
      // Navigate to pipeline details page or show modal
      console.log('View details for pipeline:', pipelineId);
    }
  };

  const handleViewLogs = (pipelineId: string) => {
    const pipeline = pipelines.find(p => p.id === pipelineId);
    if (pipeline) {
      setSelectedPipeline(pipeline);
      setIsLogsOpen(true);
    }
  };

  const getStatusCounts = () => {
    return {
      all: pipelines.length,
      RUNNING: pipelines.filter(p => p.status === 'RUNNING').length,
      SUCCESS: pipelines.filter(p => p.status === 'SUCCESS').length,
      FAILED: pipelines.filter(p => p.status === 'FAILED').length,
      PENDING: pipelines.filter(p => p.status === 'PENDING').length,
    };
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-white/60">Loading pipelines...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Card variant="glass" className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
            <p className="text-white/60 mb-6">Please sign in to view pipelines.</p>
            <Button onClick={() => window.location.href = '/api/auth/signin'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-dark-900">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Pipeline Monitor</h1>
              <p className="text-white/60 text-lg">
                Monitor and manage your deployment pipelines in real-time.
              </p>
            </div>
            
            <Button onClick={handleRefresh} loading={isLoading}>
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Status Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card variant="glass">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((filter) => {
                  const count = statusCounts[filter.key as keyof typeof statusCounts];
                  const isActive = selectedFilter === filter.key;
                  
                  return (
                    <Button
                      key={filter.key}
                      variant={isActive ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedFilter(filter.key)}
                      className="flex items-center space-x-2"
                    >
                      <filter.icon className="h-4 w-4" />
                      <span>{filter.label}</span>
                      <span className="px-2 py-1 rounded-full bg-white/10 text-xs">
                        {count}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pipelines Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filteredPipelines.length === 0 ? (
            <Card variant="glass" className="text-center py-12">
              <CardContent>
                <PlayIcon className="h-16 w-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No pipelines found</h3>
                <p className="text-white/60 mb-6">
                  {selectedFilter === 'all' 
                    ? 'No pipelines have been created yet.' 
                    : `No pipelines with status "${selectedFilter}" found.`
                  }
                </p>
                <Button onClick={() => setSelectedFilter('all')}>
                  View All Pipelines
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPipelines.map((pipeline, index) => (
                <motion.div
                  key={pipeline.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <PipelineCard
                    pipeline={pipeline}
                    onViewDetails={handleViewDetails}
                    onViewLogs={handleViewLogs}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Pipeline Logs Modal */}
        {selectedPipeline && (
          <PipelineLogs
            isOpen={isLogsOpen}
            onClose={() => {
              setIsLogsOpen(false);
              setSelectedPipeline(null);
            }}
            projectId={selectedPipeline.projectId}
            jobId={selectedPipeline.gitlabId}
            jobName={`Pipeline ${selectedPipeline.gitlabId}`}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
