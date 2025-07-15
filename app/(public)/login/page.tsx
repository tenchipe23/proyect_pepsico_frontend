"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LockIcon, UserIcon, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/context/auth-context"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

// Role-based redirect paths
const ROLE_PATHS: Record<string, string> = {
  admin: '/admin',
  autorizador: '/autorizar/dashboard',
  seguridad: '/seguridad',
  guest: '/',
};

export default function LoginPage() {
  const { login } = useAuth()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  
  // Verificar si el usuario fue redirigido por sesión expirada
  const sessionExpired = searchParams.get('session_expired') === 'true'

  const getDefaultRedirectPath = (role: string = '') => {
    return ROLE_PATHS[role.toLowerCase()] || '/';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result?.success) {
        toast({
          title: 'Inicio de sesión exitoso',
          description: `Bienvenido de vuelta!`,
        });
        
        // The AuthWrapper will handle the redirection
        return;
      } else {
        throw new Error(result?.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
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
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {sessionExpired && (
            <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-800">
              <AlertDescription>
                Su sesión ha expirado o no tiene autorización. Por favor, inicie sesión nuevamente.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
              </div>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-700 hover:bg-blue-800 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>

          <div className="mt-6 text-sm text-gray-600">
            <p className="font-medium">Credenciales de prueba:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
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
        
        <CardFooter className="flex justify-center">
          <Link href="/solicitar" className="text-sm text-blue-600 hover:underline">
            Ir a solicitud de pase (no requiere inicio de sesión)
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}