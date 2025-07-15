'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, FileText, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PublicNavigationBar() {
  const pathname = usePathname();

  // Define las rutas públicas
  const publicRoutes = [
    { name: 'Inicio', path: '/', icon: <Home className="h-4 w-4" /> },
    { name: 'Solicitar', path: '/solicitar', icon: <FileText className="h-4 w-4" /> },
    { name: 'Iniciar Sesión', path: '/login', icon: <LogIn className="h-4 w-4" /> },
  ];

  return (
    <div className="bg-blue-900 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center">
            <div className="bg-white p-1 rounded mr-3">
              <h2 className="text-gray-900 font-bold text-sm">PEPSICO</h2>
            </div>
            <h2 className="text-white font-semibold text-lg">Sistema de Pases</h2>
          </div>
          <nav className="flex space-x-1">
            {publicRoutes.map((route) => {
              const isActive = pathname === route.path;
              return (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-800 text-white'
                      : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                  )}
                >
                  {route.icon}
                  <span className="ml-2">{route.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}