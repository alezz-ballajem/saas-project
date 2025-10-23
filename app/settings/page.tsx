'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/session';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  UserCircleIcon,
  Cog6ToothIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user: session, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-github-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-github-accent mx-auto mb-4"></div>
          <p className="text-github-text-secondary">Loading settings...</p>
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
            <p className="text-github-text-secondary mb-6">Please sign in to access settings.</p>
            <Button onClick={() => window.location.href = '/api/auth/signin'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-github-bg">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-github-text mb-2">Settings</h1>
          <p className="text-github-text-secondary text-lg">
            Manage your account and application preferences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card variant="glass">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-github-accent to-github-accent-secondary">
                    <UserCircleIcon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-github-text">Profile Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    defaultValue={session?.name || ''}
                    placeholder="Enter your full name"
                  />
                  <Input
                    label="Email"
                    defaultValue={session?.email || ''}
                    placeholder="Enter your email"
                    disabled
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="GitLab Username"
                    placeholder="Your GitLab username"
                  />
                  <Input
                    label="Role"
                    defaultValue="DevOps Lead"
                    disabled
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-github-text">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="secondary" className="w-full justify-start">
                  <KeyIcon className="h-5 w-5 mr-3" />
                  Change Password
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <BellIcon className="h-5 w-5 mr-3" />
                  Notifications
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <ShieldCheckIcon className="h-5 w-5 mr-3" />
                  Security
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <GlobeAltIcon className="h-5 w-5 mr-3" />
                  Preferences
                </Button>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-github-text">System Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-github-text-secondary">Version</span>
                  <span className="text-github-text">1.0.0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-github-text-secondary">Environment</span>
                  <span className="text-github-text">Production</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-github-text-secondary">Last Updated</span>
                  <span className="text-github-text">Today</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex justify-end"
        >
          <Button 
            onClick={handleSaveSettings}
            loading={isLoading}
            size="lg"
          >
            Save Settings
          </Button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
