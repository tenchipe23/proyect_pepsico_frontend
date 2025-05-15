"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { LockIcon, UserIcon, AlertCircleIcon, Loader2Icon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Usuarios de prueba
const MOCK_USERS = [
  {
    id: "1",
    name: "Administrador",
    email: "admin@pepsico.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: "2",
    name: "Autorizador",
    email: "autorizador@pepsico.com",
    password: "auth123",
    role: "autorizador",
  },
  {
    id: "3",
    name: "Seguridad",
    email: "seguridad@pepsico.com",
    password: "seg123",
    role: "seguridad",
  },
]

export default function LoginPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [redirecting, setRedirecting] = useState(false)

  // Verificar si ya hay una sesión activa al cargar la página
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        console.log("Sesión activa detectada:", userData.role)

        // Redirigir según el rol
        redirectUserByRole(userData.role)
      }
    } catch (error) {
      console.error("Error al verificar sesión:", error)
      // Limpiar localStorage si hay un error al parsear
      localStorage.removeItem("user")
    }
  }, [])

  const redirectUserByRole = (role: string) => {
    let redirectUrl = "/solicitar" // Default fallback

    if (role === "admin") {
      redirectUrl = "/admin"
    } else if (role === "autorizador") {
      redirectUrl = "/autorizar/dashboard"
    } else if (role === "seguridad") {
      redirectUrl = "/seguridad"
    }

    console.log("Redirigiendo a:", redirectUrl)
    window.location.href = redirectUrl
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Limpiar error al cambiar los datos del formulario
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate that credentials were entered
      if (!formData.email || !formData.password) {
        setError("Por favor ingrese su correo electrónico y contraseña")
        setIsLoading(false)
        return
      }

      console.log("Intentando iniciar sesión con:", formData.email)

      // Find user
      const foundUser = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === formData.email.toLowerCase() && u.password === formData.password,
      )

      if (foundUser) {
        // Create user object without password
        const userToStore = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
        }

        console.log("Usuario encontrado:", userToStore)

        // Save to localStorage
        try {
          localStorage.setItem("user", JSON.stringify(userToStore))
          console.log("Usuario guardado en localStorage")
        } catch (storageError) {
          console.error("Error al guardar en localStorage:", storageError)
          setError("Error al guardar la sesión. Verifique la configuración de su navegador.")
          setIsLoading(false)
          return
        }

        toast({
          variant: "success",
          title: "Inicio de sesión exitoso",
          description: `Bienvenido, ${userToStore.name}. Redirigiendo...`,
        })

        // Indicate we're redirecting
        setRedirecting(true)

        // Redirect based on role
        setTimeout(() => {
          redirectUserByRole(foundUser.role)
        }, 1000)
      } else {
        console.log("Credenciales inválidas")
        setError("Correo electrónico o contraseña incorrectos")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error en el proceso de login:", error)
      setError("Ocurrió un error inesperado. Por favor intente nuevamente.")
      setIsLoading(false)
    }
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
                    disabled={isLoading || redirecting}
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
                    disabled={isLoading || redirecting}
                  />
                </div>
              </div>
            </div>
          </form>

          <div className="text-sm text-gray-500">
            <p>Credenciales de prueba:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>
                <strong>Autorizador:</strong> autorizador@pepsico.com / auth123
              </li>
              <li>
                <strong>Admin:</strong> admin@pepsico.com / admin123
              </li>
              <li>
                <strong>Seguridad:</strong> seguridad@pepsico.com / seg123
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            form="login-form"
            className="w-full bg-blue-700 hover:bg-blue-800 flex items-center justify-center gap-2"
            disabled={isLoading || redirecting}
          >
            {redirecting ? (
              <>
                <Loader2Icon className="h-4 w-4 animate-spin" />
                Redirigiendo...
              </>
            ) : isLoading ? (
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
