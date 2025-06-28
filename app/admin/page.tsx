"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { LogOutIcon } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import AppHeader from "@/components/app-header"
import UserManagement from "@/components/admin/user-management"
import PasesManagement from "@/components/admin/pases-management"
import AuthRedirect from "@/components/auth-redirect"
import LoadingIndicator from "@/components/loading-indicator"

export default function AdminPage() {
  const { user, logout, loading } = useAuth()
  const [activeTab, setActiveTab] = useState("usuarios")

  const handleLogout = () => {
    logout()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <LoadingIndicator text="Cargando panel de administración" size="lg" />
      </div>
    )
  }

  return (
    <AuthRedirect allowedRoles={["admin"]}>
      <div className="max-w-7xl mx-auto">
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
          <CardContent className="p-6">
            <Tabs defaultValue="usuarios" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="usuarios">Gestión de Usuarios</TabsTrigger>
                <TabsTrigger value="pases">Gestión de Pases</TabsTrigger>
              </TabsList>
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
