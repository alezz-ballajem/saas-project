'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  PlayIcon,
  EyeIcon,
  TrashIcon,
  ArrowTopRightOnSquareIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description?: string;
    gitlabUrl: string;
    status: string;
    domain?: string;
    createdAt: string;
    pipelines: Array<{
      id: string;
      status: string;
      stage?: string;
      createdAt: string;
    }>;
  };
  onDelete?: (id: string) => void;
  onTriggerPipeline?: (id: string) => void;
}

const statusConfig = {
  ACTIVE: { color: 'text-green-400', icon: CheckCircleIcon, bg: 'bg-green-500/10' },
  INACTIVE: { color: 'text-yellow-400', icon: ExclamationTriangleIcon, bg: 'bg-yellow-500/10' },
  DELETED: { color: 'text-red-400', icon: XCircleIcon, bg: 'bg-red-500/10' },
};

const pipelineStatusConfig = {
  SUCCESS: { color: 'text-green-400', icon: CheckCircleIcon },
  FAILED: { color: 'text-red-400', icon: XCircleIcon },
  RUNNING: { color: 'text-blue-400', icon: ClockIcon },
  PENDING: { color: 'text-yellow-400', icon: ClockIcon },
  CANCELED: { color: 'text-gray-400', icon: XCircleIcon },
  SKIPPED: { color: 'text-gray-400', icon: ClockIcon },
};

export function ProjectCard({ project, onDelete, onTriggerPipeline }: ProjectCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const statusInfo = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.ACTIVE;
  const latestPipeline = project.pipelines[0];
  const pipelineStatus = latestPipeline ? pipelineStatusConfig[latestPipeline.status as keyof typeof pipelineStatusConfig] : null;

  const handleTriggerPipeline = async () => {
    if (!onTriggerPipeline) return;
    
    setIsLoading(true);
    try {
      await onTriggerPipeline(project.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card variant="glass" hover className="h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-white text-xl mb-2">{project.name}</CardTitle>
              {project.description && (
                <p className="text-white/60 text-sm mb-3">{project.description}</p>
              )}
              
              <div className="flex items-center space-x-4 mb-4">
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusInfo.bg}`}>
                  <statusInfo.icon className={`h-4 w-4 ${statusInfo.color}`} />
                  <span className={`text-sm font-medium ${statusInfo.color}`}>
                    {project.status}
                  </span>
                </div>
                
                {project.domain && (
                  <div className="flex items-center space-x-1 text-white/60">
                    <span className="inline-block h-2 w-2 rounded-full bg-primary-400" />
                    <span className="text-sm">{project.domain}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Latest Pipeline Status */}
          {latestPipeline && (
            <div className="mb-4 p-3 bg-white/5 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/60">Latest Pipeline</span>
                <span className="text-xs text-white/40">
                  {formatDistanceToNow(new Date(latestPipeline.createdAt), { addSuffix: true })}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {pipelineStatus && (
                  <>
                    <pipelineStatus.icon className={`h-4 w-4 ${pipelineStatus.color}`} />
                    <span className={`text-sm font-medium ${pipelineStatus.color}`}>
                      {latestPipeline.status}
                    </span>
                    {latestPipeline.stage && (
                      <span className="text-xs text-white/40">• {latestPipeline.stage}</span>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={handleTriggerPipeline}
              loading={isLoading}
              className="flex-1 sm:flex-none"
            >
              <PlayIcon className="h-4 w-4 mr-2" />
              Deploy
            </Button>
            
            <Link href={`/projects/${project.id}`}>
              <Button variant="secondary" size="sm" className="flex-1 sm:flex-none">
                <EyeIcon className="h-4 w-4 mr-2" />
                View
              </Button>
            </Link>
            
            <a
              href={project.gitlabUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none"
            >
                <Button variant="ghost" size="sm" className="w-full">
                <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
                GitLab
              </Button>
            </a>
            
            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(project.id)}
                className="flex-1 sm:flex-none"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>

          {/* Project Stats */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex justify-between text-xs text-white/60">
              <span>Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</span>
              <span>{project.pipelines.length} pipelines</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
