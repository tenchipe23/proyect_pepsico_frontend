"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon, Loader2Icon } from "lucide-react"
import { useRouter } from "next/navigation"

import type { UserRole } from "@/context/auth-context";

interface AuthRedirectProps {
  allowedRoles: UserRole[];
  redirectTo?: string;
  children: React.ReactNode;
}

export default function AuthRedirect({ allowedRoles, redirectTo = "/login", children }: AuthRedirectProps) {
  const { user, loading, isAuthenticated, hasRole } = useAuth()
  const [isChecking, setIsChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (loading) {
      return;
    }

    const checkAccess = async () => {
      setIsChecking(true);

      if (!isAuthenticated) {
        setError("No se ha iniciado sesión. Redirigiendo...");
        const currentPath = encodeURIComponent(window.location.pathname);
        await router.push(`${redirectTo}?redirect=${currentPath}`);
        return;
      }

      if (!hasRole(allowedRoles)) {
        setError("No tiene permisos para acceder a esta página. Redirigiendo...");
        // Obtener la ruta actual para mostrarla en la página de unauthorized
        const currentPath = encodeURIComponent(window.location.pathname);
        // Guardar la ruta original que el usuario intentó acceder
        localStorage.setItem('originalAccessPath', window.location.pathname);
        await router.push(`/unauthorized?from=${currentPath}`);
        return;
      }

      setError(null);
      setIsChecking(false);
    };

    checkAccess();
  }, [user, loading, isAuthenticated, hasRole, allowedRoles, redirectTo, router]);

  if (loading || isChecking) {
    return (
      <div className="flex justify-center items-center h-[50vh] flex-col gap-4">
        <Loader2Icon className="h-8 w-8 text-white animate-spin" />
        <div className="text-white text-center">
          <h2 className="text-xl font-bold mb-2">Verificando acceso...</h2>
          <p>Por favor espere mientras verificamos sus credenciales</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="w-full max-w-md">
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Error de autenticación</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
