'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  XMarkIcon,
  PlayIcon,
  PauseIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { getJobLogs } from '@/lib/actions/pipeline-actions';
import toast from 'react-hot-toast';

interface PipelineLogsProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  jobId: string;
  jobName: string;
}

export function PipelineLogs({ isOpen, onClose, projectId, jobId, jobName }: PipelineLogsProps) {
  const [logs, setLogs] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (isOpen && jobId) {
      loadLogs();
    }
  }, [isOpen, jobId]);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const logData = await getJobLogs(projectId, jobId);
      setLogs(logData || 'No logs available');
    } catch (error) {
      console.error('Error loading logs:', error);
      toast.error('Failed to load logs');
      setLogs('Failed to load logs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadLogs();
  };

  const handleDownload = () => {
    const blob = new Blob([logs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${jobName}-logs.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleLiveMode = () => {
    setIsLive(!isLive);
    if (!isLive) {
      // Start polling for live logs
      const interval = setInterval(() => {
        if (isLive) {
          loadLogs();
        } else {
          clearInterval(interval);
        }
      }, 5000);
    }
  };

  const scrollToBottom = () => {
    const logContainer = document.getElementById('log-container');
    if (logContainer) {
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  };

  useEffect(() => {
    if (isAutoScroll) {
      scrollToBottom();
    }
  }, [logs, isAutoScroll]);

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
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-6xl h-[80vh]"
          >
            <Card variant="glass" className="border-white/20 h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <PlayIcon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-white">Pipeline Logs</CardTitle>
                      <p className="text-white/60 text-sm">{jobName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleLiveMode}
                      className={isLive ? 'bg-green-500/10 text-green-400' : ''}
                    >
                      {isLive ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                      {isLive ? 'Live' : 'Static'}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRefresh}
                      loading={isLoading}
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDownload}
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {/* Log Controls */}
                <div className="flex items-center justify-between mb-4 p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={isAutoScroll}
                        onChange={(e) => setIsAutoScroll(e.target.checked)}
                        className="rounded border-white/20 bg-white/5"
                      />
                      <span className="text-white/80">Auto-scroll</span>
                    </label>
                    
                    <div className="flex items-center space-x-2 text-sm text-white/60">
                      <span>Lines: {logs.split('\n').length}</span>
                      <span>•</span>
                      <span>Size: {new Blob([logs]).size} bytes</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={scrollToBottom}
                    className="text-white/60 hover:text-white"
                  >
                    Scroll to Bottom
                  </Button>
                </div>

                {/* Log Content */}
                <div className="flex-1 bg-dark-800 rounded-xl border border-white/10 overflow-hidden">
                  <div
                    id="log-container"
                    className="h-full overflow-auto p-4 font-mono text-sm"
                    style={{ maxHeight: 'calc(80vh - 200px)' }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                        <span className="ml-3 text-white/60">Loading logs...</span>
                      </div>
                    ) : (
                      <pre className="text-white/90 whitespace-pre-wrap break-words">
                        {logs || 'No logs available'}
                      </pre>
                    )}
                  </div>
                </div>

                {/* Status Bar */}
                <div className="mt-4 flex items-center justify-between text-sm text-white/60">
                  <div className="flex items-center space-x-4">
                    <span>Job ID: {jobId}</span>
                    <span>•</span>
                    <span>Project: {projectId}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isLive && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Live</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
