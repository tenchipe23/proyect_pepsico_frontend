"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangleIcon } from "lucide-react"

// Lista de rutas públicas que no requieren autenticación
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/solicitar',
  '/api/solicitar',
  '/_next',
  '/favicon.ico',
  '/api/auth',
];

interface NavigationGuardProps {
  when?: boolean
  message?: string
  children: React.ReactNode
  requireAuth?: boolean
}

export default function NavigationGuard({
  when = false,
  message = "¿Está seguro que desea abandonar esta página? Los cambios no guardados se perderán.",
  children,
  requireAuth = true,
}: NavigationGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [showDialog, setShowDialog] = useState(false)
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [isPublicPath, setIsPublicPath] = useState(false)

  // Determinar si la ruta actual es pública o protegida
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const currentPath = window.location.pathname;
    
    // Verificar si es una ruta pública
    const isPublic = PUBLIC_PATHS.some(path => {
      // Manejar rutas exactas
      if (currentPath === path) return true;
      // Manejar rutas que comienzan con el path (incluyendo la barra final)
      if (currentPath.startsWith(`${path}/`)) return true;
      // Manejar el caso especial de la ruta raíz
      if (path === '/' && currentPath === '') return true;
      return false;
    });
    
    console.log('[NavigationGuard] Ruta actual:', currentPath);
    console.log('[NavigationGuard] Es ruta pública:', isPublic);
    
    setIsPublicPath(isPublic);
  }, [pathname]);

  // Marcar que estamos en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Manejar la navegación del usuario
  useEffect(() => {
    if (!isClient || !when || isPublicPath) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Solo mostrar advertencia en rutas protegidas
      if (pathname?.startsWith('/dashboard') || 
          pathname?.startsWith('/admin') || 
          pathname?.startsWith('/autorizador') || 
          pathname?.startsWith('/seguridad')) {
        e.preventDefault()
        e.returnValue = message
        return message
      }
    }

    // Agregar listener para navegación fuera del sitio
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [when, message, isClient, isPublicPath, pathname])

  // Función para interceptar la navegación
  const handleNavigation = (url: string) => {
    console.log('Interceptando navegación a:', url);
    console.log('Mostrar diálogo de confirmación?', when && !isPublicPath);
    
    if (when && !isPublicPath) {
      // Mostrar diálogo de confirmación solo si no es una ruta pública
      setPendingUrl(url);
      setShowDialog(true);
      return false;
    }
    return true;
  }

  // Función para continuar con la navegación
  const handleContinue = () => {
    setShowDialog(false)
    if (pendingUrl) {
      router.push(pendingUrl)
    }
  }

  // Función para cancelar la navegación
  const handleCancel = () => {
    setShowDialog(false)
    setPendingUrl(null)
  }

  // Si no estamos en el cliente, renderizar solo los hijos
  if (!isClient) {
    return <>{children}</>
  }

  // Si es una ruta pública, no mostrar el diálogo de confirmación
  if (isPublicPath && !requireAuth) {
    return <>{children}</>;
  }

  return (
    <>
      {children}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 mb-4">
              <AlertTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <DialogTitle className="text-center">¿Abandonar página?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center">{message}</p>
          </div>
          <DialogFooter className="flex flex-row justify-center gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleContinue}>
              Abandonar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
