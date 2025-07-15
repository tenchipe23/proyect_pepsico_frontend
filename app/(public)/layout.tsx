'use client';

import PublicNavigationBar from '@/components/public-navigation-bar';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavigationBar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}