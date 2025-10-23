import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'GitHub Projects Manager',
  description: 'A GitHub-inspired project management platform for modern development teams. Streamline your workflow with seamless automation, secure deployments, and powerful collaboration tools.',
  keywords: ['project management', 'github', 'devops', 'automation', 'deployment', 'collaboration'],
  authors: [{ name: 'Alezz Ballajem', url: 'https://github.com/alezz-ballajem' }],
  creator: 'Alezz Ballajem',
  openGraph: {
    title: 'GitHub Projects Manager',
    description: 'Streamline your development workflow with GitHub-inspired project management tools.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-github-bg text-github-text">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#161b22',
                color: '#f0f6fc',
                border: '1px solid #30363d',
                backdropFilter: 'blur(10px)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
