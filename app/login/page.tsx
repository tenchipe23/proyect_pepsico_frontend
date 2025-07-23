'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Este archivo es un fallback para asegurar que /login funcione en producción
// Redirige a la implementación real en (public)/login
export default function LoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir inmediatamente a la ruta correcta
    router.replace('/login');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>Redirigiendo...</p>
      </div>
    </div>
  );
}