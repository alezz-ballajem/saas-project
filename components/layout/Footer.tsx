import Link from 'next/link';
import { GithubIcon, TwitterIcon, LinkedinIcon } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-github-bg border-t border-github-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-github-accent">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <span className="text-xl font-semibold text-github-text">GitHub Projects</span>
            </Link>
            <p className="text-github-text-secondary mb-6 max-w-md">
              A GitHub-inspired project management platform for modern development teams. 
              Streamline your workflow with seamless automation and powerful collaboration tools.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/alezz-ballajem"
                className="text-github-text-secondary hover:text-github-text transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/alezz-ballajem-3b7979298"
                className="text-github-text-secondary hover:text-github-text transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-github-text font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-github-text-secondary hover:text-github-text transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-github-text-secondary hover:text-github-text transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/pipelines" className="text-github-text-secondary hover:text-github-text transition-colors">
                  Pipelines
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-github-text-secondary hover:text-github-text transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-github-text font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-github-text-secondary hover:text-github-text transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-github-text-secondary hover:text-github-text transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-github-text-secondary hover:text-github-text transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-github-text-secondary hover:text-github-text transition-colors">
                  Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-github-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-github-text-secondary text-sm">
              © 2025 GitHub Projects Manager. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-github-text-secondary hover:text-github-text text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-github-text-secondary hover:text-github-text text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
          
          {/* Crafted by Alezz Ballajem */}
          <div className="mt-4 pt-4 border-t border-github-border-secondary">
            <p className="text-github-text-tertiary text-sm text-center">
              Crafted with ❤️ by{' '}
              <span className="text-github-accent font-medium">Alezz Ballajem</span>
              {' '}• DevOps Lead
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
