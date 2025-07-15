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
          titleClassName="text-2xl font-bold text-white"
          descriptionClassName="text-white/90 mt-2"
          actions={
            <Button
              variant="outline"
              className="bg-blue-600 text-white border-none hover:bg-blue-700 font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOutIcon className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          }
        />

        <Card className="shadow-xl bg-white rounded-xl overflow-hidden mx-auto">
          <CardHeader className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-6">
            <h2 className="text-2xl font-bold tracking-tight">Panel de Control</h2>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="usuarios" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-blue-50 p-1 rounded-lg">
                <TabsTrigger 
                  value="usuarios" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md transition-all duration-200"
                >
                  Gestión de Usuarios
                </TabsTrigger>
                <TabsTrigger 
                  value="pases" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md transition-all duration-200"
                >
                  Gestión de Pases
                </TabsTrigger>
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
