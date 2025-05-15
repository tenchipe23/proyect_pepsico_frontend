"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon, Loader2Icon } from "lucide-react"

interface AuthRedirectProps {
  allowedRoles: string[]
  redirectTo?: string
  children: React.ReactNode
}

export default function AuthRedirect({ allowedRoles, redirectTo = "/login", children }: AuthRedirectProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        console.log("Verificando autenticación...")
        const storedUser = localStorage.getItem("user")

        if (!storedUser) {
          console.log("No se encontró usuario, redirigiendo a login")
          setError("No se ha iniciado sesión. Redirigiendo...")
          setTimeout(() => {
            const currentPath = encodeURIComponent(window.location.pathname)
            window.location.href = `${redirectTo}?redirect=${currentPath}`
          }, 1500)
          return
        }

        const userData = JSON.parse(storedUser)
        console.log("Usuario encontrado:", userData.role)
        console.log("Roles permitidos:", allowedRoles)

        const hasAccess = allowedRoles.includes(userData.role)
        console.log("¿Tiene acceso?:", hasAccess)

        if (!hasAccess) {
          console.log("Usuario no autorizado, redirigiendo")
          setError("No tiene permisos para acceder a esta página. Redirigiendo...")
          setTimeout(() => {
            const currentPath = encodeURIComponent(window.location.pathname)
            window.location.href = `/unauthorized?from=${currentPath}`
          }, 1500)
          return
        }

        setIsAuthorized(true)
        setIsLoading(false)
        console.log("Usuario autorizado correctamente")
      } catch (error) {
        console.error("Error al verificar autenticación:", error)
        setError("Error al verificar la autenticación. Redirigiendo...")
        setTimeout(() => {
          window.location.href = redirectTo
        }, 1500)
      }
    }

    checkAuth()
  }, [allowedRoles, redirectTo])

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

  if (isLoading) {
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

  return <>{children}</>
}
