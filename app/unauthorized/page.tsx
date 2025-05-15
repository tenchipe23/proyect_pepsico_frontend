"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ShieldAlertIcon } from "lucide-react"
import { useEffect, useState } from "react"

export default function UnauthorizedPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [referrer, setReferrer] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Get user data
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }

      // Get referrer from URL if available
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search)
        const from = urlParams.get("from")
        if (from) {
          setReferrer(decodeURIComponent(from))
        }
      }
    } catch (error) {
      console.error("Error al obtener datos de usuario:", error)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <ShieldAlertIcon className="h-10 w-10 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Acceso Denegado</CardTitle>
          <CardDescription>No tiene permisos para acceder a esta página</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            {user ? (
              <>
                Su cuenta <strong>({user.email})</strong> con rol <strong>{user.role}</strong> no tiene los permisos
                necesarios para acceder a {referrer ? <strong>{referrer}</strong> : "esta sección del sistema"}.
              </>
            ) : (
              "Su cuenta no tiene los permisos necesarios para acceder a esta sección del sistema."
            )}
          </p>
          <p className="text-gray-600">Por favor, contacte al administrador si cree que esto es un error.</p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
          {user && (
            <Button variant="outline" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          )}
          <Button variant="outline" onClick={() => router.push("/login")}>
            Volver al inicio de sesión
          </Button>
          <Button className="bg-blue-700 hover:bg-blue-800" onClick={() => router.push("/solicitar")}>
            Ir a solicitudes
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
