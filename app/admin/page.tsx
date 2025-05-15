"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { LogOutIcon } from "lucide-react"
import AppHeader from "@/components/app-header"
import UserManagement from "@/components/admin/user-management"
import PasesManagement from "@/components/admin/pases-management"
import AuthRedirect from "@/components/auth-redirect"

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("usuarios")
  const [isLoading, setIsLoading] = useState(true)

  // Load user data after authentication is confirmed
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Error loading user data:", error)
      setIsLoading(false)
    }
  }, [])

  // If still loading after authentication, show loading indicator
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="text-white text-center">
          <h2 className="text-xl font-bold mb-2">Cargando...</h2>
          <p>Cargando panel de administración</p>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  return (
    <AuthRedirect allowedRoles={["admin"]}>
      <div className="max-w-6xl mx-auto">
        <AppHeader
          title="Panel de Administración"
          description={`Bienvenido, ${user?.name || "Administrador"}. Gestione usuarios y pases de salida.`}
          actions={
            <Button
              variant="outline"
              className="bg-white/10 text-white hover:bg-white/20 flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOutIcon className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          }
        />

        <Card className="shadow-xl">
          <CardHeader className="bg-gray-900 text-white p-4">
            <h2 className="text-xl font-bold mb-4">Panel de Control</h2>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="usuarios" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-4 pt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="usuarios">Gestión de Usuarios</TabsTrigger>
                  <TabsTrigger value="pases">Gestión de Pases</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="usuarios" className="m-0">
                <UserManagement />
              </TabsContent>
              <TabsContent value="pases" className="m-0">
                <PasesManagement />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AuthRedirect>
  )
}
