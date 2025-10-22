import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Sonod Projects Manager',
  description: 'Explore the dynamic world of project management through our meticulously designed platform, where form meets function. Transform your development workflow with seamless automation, secure deployments, and versatile features.',
  keywords: ['project management', 'gitlab', 'devops', 'automation', 'deployment'],
  authors: [{ name: 'Alezz Ballajem', url: 'https://sonod.tech' }],
  creator: 'Alezz Ballajem',
  openGraph: {
    title: 'Sonod Projects Manager',
    description: 'Transform your development workflow with seamless automation and secure deployments.',
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
      <body>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(15, 23, 42, 0.9)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
