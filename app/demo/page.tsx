'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  PlayIcon,
  PauseIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

export default function DemoPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Welcome to Sonod Projects Manager",
      description: "Your comprehensive DevOps platform for Next.js project management",
      icon: RocketLaunchIcon,
      color: "text-blue-400",
      bg: "bg-blue-500/10"
    },
    {
      title: "Create New Project",
      description: "Easily create new Next.js projects with automated CI/CD setup",
      icon: RocketLaunchIcon,
      color: "text-green-400",
      bg: "bg-green-500/10"
    },
    {
      title: "Monitor Pipelines",
      description: "Real-time monitoring of your deployment pipelines with live logs",
      icon: ClockIcon,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10"
    },
    {
      title: "Deploy Successfully",
      description: "Watch your projects deploy automatically to your test environment",
      icon: CheckCircleIcon,
      color: "text-green-400",
      bg: "bg-green-500/10"
    }
  ];

  const handlePlay = () => {
    setIsPlaying(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStep(step);
      if (step >= demoSteps.length) {
        clearInterval(interval);
        setIsPlaying(false);
        setCurrentStep(0);
      }
    }, 3000);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

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
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back</span>
            </Button>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2">Interactive Demo</h1>
          <p className="text-white/60 text-lg">
            Experience the power of Sonod Projects Manager with our interactive demonstration.
          </p>
        </motion.div>

        {/* Demo Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card variant="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={isPlaying ? handlePause : handlePlay}
                    variant={isPlaying ? "secondary" : "primary"}
                  >
                    {isPlaying ? (
                      <>
                        <PauseIcon className="h-5 w-5 mr-2" />
                        Pause Demo
                      </>
                    ) : (
                      <>
                        <PlayIcon className="h-5 w-5 mr-2" />
                        Start Demo
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleReset}
                    variant="ghost"
                  >
                    Reset
                  </Button>
                </div>
                
                <div className="text-white/60 text-sm">
                  Step {currentStep + 1} of {demoSteps.length}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Demo Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {demoSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card 
                variant="glass" 
                className={`transition-all duration-500 ${
                  currentStep === index 
                    ? 'ring-2 ring-primary-500 scale-105' 
                    : currentStep > index 
                    ? 'opacity-60' 
                    : ''
                }`}
              >
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-4 rounded-xl ${step.bg} mb-4`}>
                    <step.icon className={`h-8 w-8 ${step.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {step.description}
                  </p>
                  
                  {currentStep === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-4"
                    >
                      <div className="w-3 h-3 bg-primary-500 rounded-full mx-auto animate-pulse" />
                    </motion.div>
                  )}
                  
                  {currentStep > index && (
                    <div className="mt-4">
                      <CheckCircleIcon className="h-6 w-6 text-green-400 mx-auto" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Demo Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-white">Live Demo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-dark-800 rounded-xl p-8 text-center">
                {currentStep === 0 && (
                  <div>
                    <RocketLaunchIcon className="h-16 w-16 text-white/40 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Ready to Start?
                    </h3>
                    <p className="text-white/60">
                      Click "Start Demo" to begin the interactive demonstration.
                    </p>
                  </div>
                )}
                
                {currentStep === 1 && (
                  <div>
                    <div className="bg-white/5 rounded-xl p-6 mb-4">
                      <h4 className="text-white font-semibold mb-2">Creating New Project</h4>
                      <div className="space-y-2 text-sm text-white/80">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span>Initializing GitLab repository...</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                          <span>Setting up Next.js project structure...</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                          <span>Configuring CI/CD pipeline...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {currentStep === 2 && (
                  <div>
                    <div className="bg-white/5 rounded-xl p-6 mb-4">
                      <h4 className="text-white font-semibold mb-2">Pipeline Monitoring</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white/80">Build Stage</span>
                          <div className="flex items-center space-x-2">
                            <ClockIcon className="h-4 w-4 text-yellow-400" />
                            <span className="text-yellow-400 text-sm">Running</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/80">Test Stage</span>
                          <div className="flex items-center space-x-2">
                            <ClockIcon className="h-4 w-4 text-blue-400" />
                            <span className="text-blue-400 text-sm">Pending</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/80">Deploy Stage</span>
                          <div className="flex items-center space-x-2">
                            <XCircleIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-400 text-sm">Waiting</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {currentStep === 3 && (
                  <div>
                    <div className="bg-white/5 rounded-xl p-6 mb-4">
                      <h4 className="text-white font-semibold mb-2">Deployment Complete</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white/80">Project Status</span>
                          <div className="flex items-center space-x-2">
                            <CheckCircleIcon className="h-4 w-4 text-green-400" />
                            <span className="text-green-400 text-sm">Deployed</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/80">Domain</span>
                          <span className="text-white/60 text-sm">nextjs-demo.check.sonod.tech</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/80">Duration</span>
                          <span className="text-white/60 text-sm">2m 34s</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Card variant="gradient" className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-white/70 mb-6">
                Experience the full power of Sonod Projects Manager with your own projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  Start Building Today
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="secondary" size="lg">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
