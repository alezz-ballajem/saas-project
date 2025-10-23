'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/session';
import { Button } from '@/components/ui/Button';
import { 
  Bars3Icon, 
  XMarkIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export function Header() {
  const { user: session, loading, signIn, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-github-border bg-github-bg/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-github-accent">
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <span className="text-xl font-semibold text-github-text">GitHub Projects</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-github-text-secondary hover:text-github-text transition-colors">
              Dashboard
            </Link>
            <Link href="/projects" className="text-github-text-secondary hover:text-github-text transition-colors">
              Projects
            </Link>
            <Link href="/pipelines" className="text-github-text-secondary hover:text-github-text transition-colors">
              Pipelines
            </Link>
            <Link href="/settings" className="text-github-text-secondary hover:text-github-text transition-colors">
              Settings
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-github-bg-tertiary" />
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-github-text">{session.user?.name}</p>
                  <p className="text-xs text-github-text-tertiary">{session.user?.email}</p>
                </div>
                <div className="relative group">
                  <button className="flex h-8 w-8 items-center justify-center rounded-full bg-github-accent">
                    <UserCircleIcon className="h-5 w-5 text-white" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 rounded-lg bg-github-bg-secondary border border-github-border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-github-text-secondary hover:bg-github-bg-tertiary hover:text-github-text transition-colors"
                      >
                        <UserCircleIcon className="mr-3 h-4 w-4" />
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-github-text-secondary hover:bg-github-bg-tertiary hover:text-github-text transition-colors"
                      >
                        <Cog6ToothIcon className="mr-3 h-4 w-4" />
                        Settings
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="flex w-full items-center px-4 py-2 text-sm text-github-danger hover:bg-github-danger/10 hover:text-github-danger transition-colors"
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
                  onClick={() => signIn()}
                  className="github-button"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  onClick={() => signIn()}
                  className="github-button-primary"
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
                <XMarkIcon className="h-6 w-6 text-github-text" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-github-text" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-github-border">
              <Link
                href="/dashboard"
                className="block px-3 py-2 text-github-text-secondary hover:text-github-text hover:bg-github-bg-tertiary transition-colors rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/projects"
                className="block px-3 py-2 text-github-text-secondary hover:text-github-text hover:bg-github-bg-tertiary transition-colors rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
              <Link
                href="/pipelines"
                className="block px-3 py-2 text-github-text-secondary hover:text-github-text hover:bg-github-bg-tertiary transition-colors rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Pipelines
              </Link>
              <Link
                href="/settings"
                className="block px-3 py-2 text-github-text-secondary hover:text-github-text hover:bg-github-bg-tertiary transition-colors rounded-md"
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
