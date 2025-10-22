import Link from 'next/link';
import { GithubIcon, TwitterIcon, LinkedinIcon } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-white">Sonod Projects</span>
            </Link>
            <p className="text-white/60 mb-6 max-w-md">
              Explore the dynamic world of project management through our meticulously designed platform, 
              where form meets function. Transform your development workflow with seamless automation.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/alezz-ballajem"
                className="text-white/60 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/alezz-ballajem-3b7979298"
                className="text-white/60 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-white/60 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-white/60 hover:text-white transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/pipelines" className="text-white/60 hover:text-white transition-colors">
                  Pipelines
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-white/60 hover:text-white transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-white/60 hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-white/60 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/60 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-white/60 hover:text-white transition-colors">
                  Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">
              © 2025 Sonod Projects Manager. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-white/60 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/60 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
          
          {/* Crafted by Alezz Ballajem */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-white/40 text-sm text-center">
              Crafted with ❤️ by{' '}
              <span className="text-primary-400 font-medium">Alezz Ballajem</span>
              {' '}• DevOps Lead
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
