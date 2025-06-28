"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LockIcon, UserIcon, AlertCircleIcon, Loader2Icon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/context/auth-context"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
  const { login, isAuthenticated, user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = searchParams.get("redirect") || getDefaultRedirectPath(user.role)
      router.push(redirectPath)
    }
  }, [isAuthenticated, user, router, searchParams])

  const getDefaultRedirectPath = (role: string) => {
    switch (role) {
      case "admin":
        return "/admin"
      case "autorizador":
        return "/autorizar/dashboard"
      case "seguridad":
        return "/seguridad"
      default:
        return "/solicitar"
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      setError("Por favor ingrese su correo electrónico y contraseña")
      return
    }

    try {
      setIsLoggingIn(true)
      setError(null)

      const result = await login(formData.email, formData.password)

      if (result.success) {
        // Redirect will be handled by useEffect
      } else {
        setError(result.error || "Error de inicio de sesión")
      }
    } catch (error) {
      setError("Error de conexión. Intente nuevamente.")
    } finally {
      setIsLoggingIn(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <Loader2Icon className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-3 rounded-full">
              <h2 className="text-gray-900 font-bold text-xl">PEPSICO</h2>
            </div>
          </div>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>Ingrese sus credenciales para acceder al sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form id="login-form" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="correo@pepsico.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                    disabled={isLoggingIn}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
                    required
                    disabled={isLoggingIn}
                  />
                </div>
              </div>
            </div>
          </form>

          <div className="text-sm text-gray-500">
            <p>Credenciales de prueba:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>
                <strong>Admin:</strong> admin@pepsico.com / password123
              </li>
              <li>
                <strong>Autorizador:</strong> autorizador@pepsico.com / password123
              </li>
              <li>
                <strong>Seguridad:</strong> seguridad@pepsico.com / password123
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            form="login-form"
            className="w-full bg-blue-700 hover:bg-blue-800 flex items-center justify-center gap-2"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2Icon className="h-4 w-4 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </Button>
        </CardFooter>
        <div className="p-4 pt-0 text-center">
          <a href="/solicitar" className="text-sm text-blue-600 hover:underline">
            Ir a solicitud de pase (no requiere inicio de sesión)
          </a>
        </div>
      </Card>
    </div>
  )
}
