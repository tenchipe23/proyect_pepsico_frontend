'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import LoadingIndicator from '@/components/loading-indicator'
import { User } from 'lucide-react'

// Rutas públicas (incluye tanto las rutas directas como las que están en el grupo (public))
const publicPaths = ['/', '/login', '/unauthorized', '/solicitar']

// Función para verificar si una ruta es pública
const isPublicRoute = (path: string) => {
  // Verifica si la ruta está en la lista de rutas públicas
  if (publicPaths.includes(path)) return true;
  
  // Verifica si la ruta pertenece al grupo (public)
  if (path.startsWith('/(public)')) return true;
  
  return false;
}

const roleRedirectPaths: Record<string, string> = {
  admin: '/admin',
  autorizador: '/autorizar/dashboard',
  seguridad: '/seguridad',
  guest: '/',
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [initialCheckComplete, setInitialCheckComplete] = useState(true) // Set to true by default
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const isPublicPath = isPublicRoute(pathname)
  const userRole = user?.role || 'user'
  console.log('AuthWrapper user:', user)
  console.log('AuthWrapper user role:', userRole)
  console.log('AuthWrapper user type:', typeof user)
  console.log('AuthWrapper user keys:', user ? Object.keys(user) : 'No user')
  console.log('AuthWrapper user.role:', user?.role)

  // Handle client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    let isMounted = true;
    
    // Skip all auth logic during SSR and initial hydration
    if (!isClient) return () => { isMounted = false; };
    
    const handleAuth = async () => {
      if (loading || isRedirecting || !isMounted) return;
      
      try {
        console.log('AuthWrapper: Handling auth', { 
          isAuthenticated, 
          pathname, 
          isPublicPath, 
          userRole 
        });
        
        // NUNCA redirigir desde rutas públicas excepto login cuando está autenticado
        if (isPublicPath && pathname !== '/login') {
          if (isMounted) {
            setInitialCheckComplete(true);
          }
          return;
        }
        
        // Solo redirigir usuarios autenticados desde la página de login a su dashboard
        if (isAuthenticated && pathname === '/login') {
          setIsRedirecting(true);
          const redirect = searchParams.get('redirect');
          // Asegurarse de que userRole esté definido y normalizado correctamente
          const normalizedRole = userRole || 'user';
          const redirectPath = redirect || roleRedirectPaths[normalizedRole] || '/';
          console.log('AuthWrapper: Redirecting from login to', redirectPath, 'for role:', normalizedRole);
          await router.replace(redirectPath);
          if (isMounted) {
            setIsRedirecting(false);
            setInitialCheckComplete(true);
          }
          return;
        }
        
        // Redirigir usuarios no autenticados desde rutas protegidas a login
        if (!isAuthenticated && !isPublicPath) {
          setIsRedirecting(true);
          const currentPath = encodeURIComponent(pathname);
          console.log('AuthWrapper: Redirecting to login from', currentPath);
          await router.replace(`/login?redirect=${currentPath}`);
          if (isMounted) {
            setIsRedirecting(false);
            setInitialCheckComplete(true);
          }
          return;
        }
        
        // Asegurar que los usuarios autenticados estén en su ruta correcta basada en su rol
        if (isAuthenticated && !isPublicPath) {
          const allowedPath = roleRedirectPaths[userRole || ''];
          
          // Verificar si el usuario está intentando acceder a una ruta que corresponde a su rol
          const isUserAccessingOwnPath = pathname === allowedPath || pathname.startsWith(allowedPath + '/');
          
          // Verificar si el usuario está intentando acceder a una ruta específica de otro rol
          const isAccessingSeguridad = pathname === '/seguridad' || pathname.startsWith('/seguridad/');
          const isAccessingAutorizar = pathname === '/autorizar' || pathname.startsWith('/autorizar/');
          const isAccessingAdmin = pathname === '/admin' || pathname.startsWith('/admin/');
          
          // Permitir que los administradores accedan a cualquier ruta
          if (userRole === 'admin') {
            console.log('AuthWrapper: Permitiendo acceso a admin en cualquier ruta:', pathname);
            // No redireccionar, permitir acceso
          } 
          // Permitir que seguridad acceda a su propia ruta Y a rutas de autorizar (para ver detalles de pases)
          else if (userRole === 'seguridad' && (isAccessingSeguridad || isAccessingAutorizar)) {
            console.log('AuthWrapper: Permitiendo acceso a seguridad en ruta:', pathname);
            // No redireccionar, permitir acceso
          }
          // Permitir que autorizador acceda a su propia ruta
          else if (userRole === 'autorizador' && isAccessingAutorizar) {
            console.log('AuthWrapper: Permitiendo acceso a autorizador en su ruta:', pathname);
            // No redireccionar, permitir acceso
          }
          // Redirigir si el usuario está intentando acceder a una ruta que no le corresponde
          else if (!isUserAccessingOwnPath) {
            setIsRedirecting(true);
            console.log('AuthWrapper: Redirecting to role path', allowedPath);
            await router.replace(allowedPath);
            if (isMounted) {
              setIsRedirecting(false);
              setInitialCheckComplete(true);
            }
            return;
          }
        }
        
        if (isMounted) {
          setInitialCheckComplete(true);
        }
      } catch (error) {
        console.error('Error durante verificación de autenticación:', error);
        if (isMounted) {
          setIsRedirecting(false);
          setInitialCheckComplete(true);
        }
      }
    };
    
    // Agregar un pequeño retraso para asegurar que el contexto de autenticación esté completamente actualizado
    const timeoutId = setTimeout(handleAuth, 500);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [isAuthenticated, loading, pathname, router, userRole, isPublicPath, isRedirecting, searchParams, isClient])

  // Renderizado condicional con suppressHydrationWarning para evitar errores de hidratación
  if (!isClient) {
    // Durante SSR, renderizamos un div vacío con suppressHydrationWarning
    return <div suppressHydrationWarning></div>;
  }

  if (loading || !initialCheckComplete || isRedirecting) {
    return (
      <div className="flex justify-center items-center h-screen" suppressHydrationWarning>
        <LoadingIndicator text="Verificando autenticación..." size="lg" />
      </div>
    )
  }

  return <div suppressHydrationWarning>{children}</div>
}

export { AuthWrapper }
export default AuthWrapper