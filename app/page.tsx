'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  RocketLaunchIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  ChartBarIcon,
  ArrowRightIcon,
  PlayIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: RocketLaunchIcon,
    title: 'Automated Deployments',
    description: 'Seamlessly deploy your Next.js projects with our advanced CI/CD pipeline automation.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Enhanced Security',
    description: 'Secure project management with enterprise-grade authentication and access controls.',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: CpuChipIcon,
    title: 'Real-time Monitoring',
    description: 'Monitor your pipelines and deployments with live status updates and detailed logs.',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: ChartBarIcon,
    title: 'Analytics Dashboard',
    description: 'Track project performance and deployment metrics with comprehensive analytics.',
    gradient: 'from-orange-500 to-red-500'
  }
];

const stats = [
  { label: 'Projects Created', value: '50+' },
  { label: 'Successful Deployments', value: '200+' },
  { label: 'Active Pipelines', value: '15+' },
  { label: 'Uptime', value: '99.9%' }
];

export default function HomePage() {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-github-bg">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-github-bg-secondary/50 via-transparent to-github-bg-tertiary/30" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-github-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-github-accent-secondary/5 rounded-full blur-3xl animate-pulse" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.h1 
                  className="text-5xl lg:text-6xl font-bold text-github-text leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Build, Deploy, and{' '}
                  <span className="text-github-accent">Collaborate</span>{' '}
                  Like Never Before
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-github-text-secondary leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  A GitHub-inspired project management platform that brings your team together. 
                  Streamline workflows, automate deployments, and ship faster with confidence.
                </motion.p>
              </div>

              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full bg-github-accent border-2 border-github-bg"
                    />
                  ))}
                </div>
                <div className="text-github-text-secondary">
                  <span className="font-semibold text-github-text">15K+</span> developers building together
                </div>
              </motion.div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {session ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="w-full sm:w-auto">
                      Go to Dashboard
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/api/auth/signin">
                      <Button size="lg" className="w-full sm:w-auto">
                        Get Started
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/demo">
                      <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                        <PlayIcon className="mr-2 h-5 w-5" />
                        Watch Demo
                      </Button>
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.div>

            {/* Right Content - Interactive Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="github-card p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-github-text">Project Dashboard</h3>
                  <SparklesIcon className="h-6 w-6 text-github-accent" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-3 w-3 rounded-full bg-github-success animate-pulse" />
                    <span className="text-github-text-secondary">nextjs-demo11</span>
                    <span className="text-github-success text-sm">Deployed</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="h-3 w-3 rounded-full bg-github-warning animate-pulse" />
                    <span className="text-github-text-secondary">nextjs-demo12</span>
                    <span className="text-github-warning text-sm">Building</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="h-3 w-3 rounded-full bg-github-accent animate-pulse" />
                    <span className="text-github-text-secondary">nextjs-demo13</span>
                    <span className="text-github-accent text-sm">Queued</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-github-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-github-text-tertiary">Active Projects</span>
                    <span className="text-github-text font-semibold">3</span>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-20 h-20 bg-github-accent rounded-2xl opacity-20"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-github-accent-secondary rounded-xl opacity-20"
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-github-text mb-4">
              Powerful Features for Modern Development
            </h2>
            <p className="text-xl text-github-text-secondary max-w-3xl mx-auto">
              From seamless project creation to real-time monitoring, 
              experience the future of DevOps automation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card variant="glass" hover className="h-full">
                  <CardHeader>
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-github-bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-github-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-github-text-secondary">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Card variant="glass" className="max-w-4xl mx-auto">
              <CardContent className="p-12 text-center">
                <h2 className="text-4xl font-bold text-github-text mb-4">
                  Ready to Transform Your Workflow?
                </h2>
                <p className="text-xl text-github-text-secondary mb-8 max-w-2xl mx-auto">
                  Join thousands of developers who have revolutionized their deployment process 
                  with our cutting-edge project management platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {session ? (
                    <Link href="/dashboard">
                      <Button size="lg">
                        Go to Dashboard
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/api/auth/signin">
                      <Button size="lg">
                        Start Building Today
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
