'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { 
  Bars3Icon, 
  XMarkIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-dark-900/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-white">Sonod Projects</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-white/80 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/projects" className="text-white/80 hover:text-white transition-colors">
              Projects
            </Link>
            <Link href="/pipelines" className="text-white/80 hover:text-white transition-colors">
              Pipelines
            </Link>
            <Link href="/settings" className="text-white/80 hover:text-white transition-colors">
              Settings
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-white/20" />
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-white">{session.user?.name}</p>
                  <p className="text-xs text-white/60">{session.user?.email}</p>
                </div>
                <div className="relative group">
                  <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-secondary-500">
                    <UserCircleIcon className="h-5 w-5 text-white" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-dark-800 border border-white/10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <UserCircleIcon className="mr-3 h-4 w-4" />
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <Cog6ToothIcon className="mr-3 h-4 w-4" />
                        Settings
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => signIn('gitlab')}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  onClick={() => signIn('gitlab')}
                >
                  Get Started
                  <ArrowRightOnRectangleIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6 text-white" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-white/10">
              <Link
                href="/dashboard"
                className="block px-3 py-2 text-white/80 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/projects"
                className="block px-3 py-2 text-white/80 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
              <Link
                href="/pipelines"
                className="block px-3 py-2 text-white/80 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pipelines
              </Link>
              <Link
                href="/settings"
                className="block px-3 py-2 text-white/80 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Settings
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
