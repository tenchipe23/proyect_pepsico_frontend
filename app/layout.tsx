'use client';

import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen" suppressHydrationWarning>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-2" suppressHydrationWarning></div>
      <p className="text-white" suppressHydrationWarning>Cargando aplicación...</p>
    </div>
  );
}

type AuthWrapperProps = {
  children: React.ReactNode;
};

const AuthProvider = dynamic(
  () => import('@/context/auth-context').then((mod) => mod.AuthProvider),
  { ssr: false }
);

const PaseProvider = dynamic(
  () => import('@/context/pase-context').then((mod) => mod.PaseProvider),
  { ssr: false }
);

const AuthWrapper = dynamic<AuthWrapperProps>(
  () => import('./AuthWrapper'),
  { 
    ssr: false,
    loading: () => <div className="flex flex-col items-center justify-center min-h-screen" suppressHydrationWarning>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-2" suppressHydrationWarning></div>
      <p className="text-white" suppressHydrationWarning>Cargando aplicación...</p>
    </div>
  }
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div suppressHydrationWarning>
            <div suppressHydrationWarning>
              {mounted ? (
                <AuthProvider>
                  <PaseProvider>
                    <AuthWrapper>
                      <Toaster />
                      {children}
                    </AuthWrapper>
                  </PaseProvider>
                </AuthProvider>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-screen" suppressHydrationWarning>
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-2" suppressHydrationWarning></div>
                  <p className="text-white" suppressHydrationWarning>Cargando aplicación...</p>
                </div>
              )}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}