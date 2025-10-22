'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow, format } from 'date-fns';

interface PipelineCardProps {
  pipeline: {
    id: string;
    gitlabId: string;
    status: string;
    stage?: string;
    startedAt?: string;
    finishedAt?: string;
    duration?: number;
    createdAt: string;
    project: {
      id: string;
      name: string;
      gitlabUrl: string;
    };
  };
  onViewDetails?: (pipelineId: string) => void;
  onViewLogs?: (pipelineId: string) => void;
}

const statusConfig = {
  SUCCESS: { 
    color: 'text-green-400', 
    icon: CheckCircleIcon, 
    bg: 'bg-green-500/10',
    border: 'border-green-500/20'
  },
  FAILED: { 
    color: 'text-red-400', 
    icon: XCircleIcon, 
    bg: 'bg-red-500/10',
    border: 'border-red-500/20'
  },
  RUNNING: { 
    color: 'text-blue-400', 
    icon: PlayIcon, 
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  },
  PENDING: { 
    color: 'text-yellow-400', 
    icon: ClockIcon, 
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20'
  },
  CANCELED: { 
    color: 'text-gray-400', 
    icon: ExclamationTriangleIcon, 
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/20'
  },
  SKIPPED: { 
    color: 'text-gray-400', 
    icon: ClockIcon, 
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/20'
  },
};

export function PipelineCard({ pipeline, onViewDetails, onViewLogs }: PipelineCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusInfo = statusConfig[pipeline.status as keyof typeof statusConfig] || statusConfig.PENDING;

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getProgressPercentage = () => {
    if (pipeline.status === 'SUCCESS' || pipeline.status === 'FAILED') return 100;
    if (pipeline.status === 'RUNNING' && pipeline.duration) {
      const elapsed = Date.now() - new Date(pipeline.startedAt || pipeline.createdAt).getTime();
      const total = pipeline.duration * 1000;
      return Math.min((elapsed / total) * 100, 90);
    }
    return 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        variant="glass" 
        hover 
        className={`border ${statusInfo.border} ${isExpanded ? 'ring-2 ring-primary-500/20' : ''}`}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${statusInfo.bg}`}>
                <statusInfo.icon className={`h-5 w-5 ${statusInfo.color}`} />
              </div>
              <div>
                <CardTitle className="text-white text-lg">{pipeline.project.name}</CardTitle>
                <p className="text-white/60 text-sm">
                  Pipeline #{pipeline.gitlabId}
                  {pipeline.stage && ` • ${pipeline.stage}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                {pipeline.status}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <EyeIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Progress Bar */}
          {pipeline.status === 'RUNNING' && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-white/60 mb-2">
                <span>Progress</span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}

          {/* Pipeline Details */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Created</span>
              <span className="text-white">
                {formatDistanceToNow(new Date(pipeline.createdAt), { addSuffix: true })}
              </span>
            </div>

            {pipeline.startedAt && (
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Started</span>
                <span className="text-white">
                  {format(new Date(pipeline.startedAt), 'MMM dd, HH:mm')}
                </span>
              </div>
            )}

            {pipeline.finishedAt && (
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Finished</span>
                <span className="text-white">
                  {format(new Date(pipeline.finishedAt), 'MMM dd, HH:mm')}
                </span>
              </div>
            )}

            {pipeline.duration && (
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Duration</span>
                <span className="text-white">{formatDuration(pipeline.duration)}</span>
              </div>
            )}
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-white/10"
            >
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => onViewDetails?.(pipeline.id)}
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onViewLogs?.(pipeline.id)}
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  View Logs
                </Button>
                
                <a
                  href={`${pipeline.project.gitlabUrl}/-/pipelines/${pipeline.gitlabId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="sm">
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
                    GitLab
                  </Button>
                </a>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
