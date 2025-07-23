"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { usePase, type PaseData } from "@/context/pase-context"
import { useAuth } from "@/context/auth-context"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileTextIcon,
  SearchIcon,
  LogOutIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  RefreshCwIcon,
  TrashIcon,
} from "lucide-react"
import AppHeader from "@/components/app-header"
import AuthRedirect from "@/components/auth-redirect"
import NotificationBadge from "@/components/notification-badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useRouter } from "next/navigation"
import LoadingIndicator from "@/components/loading-indicator"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

export default function AutorizadorDashboardPage() {
  const { pases, loading, authorizePase, rejectPase, deletePase, refreshPases, searchPases } = usePase()
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("pendientes")
  const [showNotifications, setShowNotifications] = useState(false)
  const router = useRouter()

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const status = activeTab === "todos" ? undefined : activeTab.toUpperCase();
      if (searchQuery.trim()) {
        searchPases(searchQuery.trim(), 0, 50, status)
      } else {
        refreshPases(0, 50, status, undefined)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, activeTab, searchPases, refreshPases])

  // Filter passes based on search query and tab
  const getFilteredPases = useCallback(() => {
    return pases
      .filter((pase) => {
        // Filter by tab (status)
        if (activeTab === "pendientes") {
          return pase.estado === "PENDIENTE"
        } else if (activeTab === "firmados") {
          return pase.estado === "FIRMADO"
        } else if (activeTab === "rechazados") {
          return pase.estado === "RECHAZADO"
        } else if (activeTab === "todos") {
          return true
        }
        return false
      })
      .sort((a, b) => {
        // Sort by creation date (newest first)
        return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
      })
  }, [pases, activeTab])

  const filteredPases = getFilteredPases()

  // Get new notifications (passes created in the last 24 hours)
  const getNewNotifications = useCallback(() => {
    if (typeof window === "undefined") return []

    const lastChecked = localStorage.getItem("lastNotificationCheck")
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    return pases
      .filter((pase) => {
        const isRecent = new Date(pase.fechaCreacion) > oneDayAgo
        const isAfterLastCheck = !lastChecked || new Date(pase.fechaCreacion) > new Date(lastChecked)
        return pase.estado === "PENDIENTE" && isRecent && isAfterLastCheck
      })
      .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
  }, [pases])

  const newNotifications = getNewNotifications()

  const handleVerDetalle = (id: string) => {
    router.push(`/autorizar/${id}`)
  }

  const handleQuickAction = async (id: string, action: "autorizar" | "rechazar" | "eliminar") => {
    const pase = pases.find((p) => p.id === id)

    if (!pase) {
      return
    }

    if (action === "eliminar" && pase.estado === "AUTORIZADO") {
      // Mostrar mensaje de error
      // Asumiendo que useToast está disponible, de lo contrario ajustar
      // Por ahora, usar console.error o alert
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se puede eliminar un pase autorizado.",
        action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
      });

      return;
    }

    // Eliminamos la validación de firma y sello para permitir autorizar pases ya firmados y sellados
    // if (!pase.firma || !pase.sello) {
    //   return
    // }

    try {
      if (action === "autorizar") {
        await authorizePase(id)
      } else if (action === "rechazar") {
        await rejectPase(id)
      } else if (action === "eliminar") {
        await deletePase(id)
      }
    } catch (error) {
      console.error(`Error al ${action} pase:`, error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo procesar la acción. Intente nuevamente.",
        action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
      });
    }
  }

  const getEstadoBadge = (estado: PaseData["estado"]) => {
    switch (estado) {
      case "PENDIENTE":
        return (
          <Badge variant="outline" className="bg-yellow-500 text-white border-none text-sm font-medium px-4 py-1.5 rounded-full shadow-md">
            Pendiente
          </Badge>
        )
      case "FIRMADO":
        return (
          <Badge variant="outline" className="bg-blue-500 text-white border-none text-sm font-medium px-4 py-1.5 rounded-full shadow-md">
            Firmado
          </Badge>
        )
      case "AUTORIZADO":
        return (
          <Badge variant="default" className="bg-green-500 text-white border-none text-sm font-medium px-4 py-1.5 rounded-full shadow-md">
            Autorizado
          </Badge>
        )
      case "RECHAZADO":
        return <Badge variant="destructive" className="border-none text-sm font-medium px-4 py-1.5 rounded-full shadow-md">Rechazado</Badge>
      default:
        return <Badge variant="outline" className="bg-gray-500 text-white border-none text-sm font-medium px-4 py-1.5 rounded-full shadow-md">Desconocido</Badge>
    }
  }

  const handleLogout = () => {
    logout()
    // La redirección se maneja dentro de la función logout del contexto de autenticación
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
    if (!showNotifications) {
      localStorage.setItem("lastNotificationCheck", new Date().toISOString())
    }
  }

  if (loading && pases.length === 0) {
    return (
      <AuthRedirect allowedRoles={["admin", "autorizador"]}>
        <div className="flex justify-center items-center h-[50vh]">
          <LoadingIndicator text="Cargando panel de autorización" size="lg" />
        </div>
      </AuthRedirect>
    )
  }

  return (
    <AuthRedirect allowedRoles={["admin", "autorizador"]}>
      <div className="max-w-7xl mx-auto py-6">
        <AppHeader
          title="Panel de Autorización"
          description={`Bienvenido, ${user?.name || "Usuario"}. Aquí puede autorizar los pases de salida.`}
          titleClassName="text-2xl font-bold text-white"
          descriptionClassName="text-white/90 mt-2"
          actions={
            <div className="flex items-center gap-3">
              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-blue-600 text-white border-none hover:bg-blue-700 rounded-lg shadow-md transition-all duration-200 relative"
                  onClick={handleNotificationClick}
                >
                  <BellIcon className="h-5 w-5" />
                  {newNotifications.length > 0 && <NotificationBadge className="absolute -top-1 -right-1" />}
                </Button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl z-50 overflow-hidden border border-blue-100">
                    <div className="p-3 bg-gradient-to-r from-blue-800 to-blue-600 text-white font-medium flex justify-between items-center">
                      <span className="text-white font-bold">Notificaciones</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-white hover:bg-blue-700/50"
                        onClick={() => setShowNotifications(false)}
                      >
                        <XCircleIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {newNotifications.length > 0 ? (
                        <div className="divide-y divide-blue-100">
                          {newNotifications.map((pase) => (
                            <div key={pase.id} className="p-4 hover:bg-blue-50 transition-colors duration-150">
                              <div className="flex justify-between">
                                <span className="font-medium text-blue-800">{pase.folio}</span>
                                <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full">
                                  {format(new Date(pase.fechaCreacion), "dd MMM, HH:mm", { locale: es })}
                                </span>
                              </div>
                              <p className="text-sm text-blue-700 mt-2 font-medium">
                                Nuevo pase de {pase.operadorNombre} {pase.operadorApellidoPaterno}
                              </p>
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 h-auto mt-2 text-blue-600 hover:text-blue-800"
                                onClick={() => {
                                  handleVerDetalle(pase.id!)
                                  setShowNotifications(false)
                                }}
                              >
                                Ver detalles →
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center">
                          <div className="bg-blue-50 rounded-xl p-4 shadow-sm border border-blue-100">
                            <p className="text-blue-800 font-medium">No hay notificaciones nuevas</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                className="bg-blue-600 text-white border-none hover:bg-blue-700 font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOutIcon className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          }
        />

        <Card className="shadow-xl bg-white rounded-xl overflow-hidden mx-auto mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-6">
            <h2 className="text-xl font-bold tracking-tight">Buscar Pases</h2>
          </CardHeader>
          <CardContent className="p-5">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por folio, operador, placa, razón social..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleClearSearch} 
                title="Limpiar búsqueda"
                className="bg-blue-600 text-white border-none hover:bg-blue-700 rounded-lg shadow-md transition-all duration-200"
              >
                <RefreshCwIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-white rounded-xl overflow-hidden mx-auto">
          <CardHeader className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold tracking-tight">Pases de Salida</h2>
              <Badge className="bg-green-500 text-white border-none text-sm font-medium px-4 py-1.5 rounded-full shadow-md">
                {pases.length} pases en total
              </Badge>
            </div>
          </CardHeader>
          <Tabs defaultValue="pendientes" value={activeTab} onValueChange={setActiveTab}>
            <div className="px-4 pt-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="pendientes" className="relative">
                  Pendientes
                  {pases.filter((p) => p.estado === "PENDIENTE").length > 0 && (
                    <Badge className="ml-2 bg-yellow-500">{pases.filter((p) => p.estado === "PENDIENTE").length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="firmados">
                  Firmados
                  {pases.filter((p) => p.estado === "FIRMADO").length > 0 && (
                    <Badge className="ml-2 bg-blue-500">{pases.filter((p) => p.estado === "FIRMADO").length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="rechazados">
                  Rechazados
                  {pases.filter((p) => p.estado === "RECHAZADO").length > 0 && (
                    <Badge className="ml-2 bg-red-500">{pases.filter((p) => p.estado === "RECHAZADO").length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="todos">Todos</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="m-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-blue-50">
                  <TableRow>
                    <TableHead className="font-semibold text-blue-800">Folio</TableHead>
                    <TableHead className="font-semibold text-blue-800">Fecha</TableHead>
                    <TableHead className="font-semibold text-blue-800">Operador</TableHead>
                    <TableHead className="font-semibold text-blue-800">Placa</TableHead>
                    <TableHead className="font-semibold text-blue-800">Razón Social</TableHead>
                    <TableHead className="font-semibold text-blue-800">Estado</TableHead>
                    <TableHead className="text-right font-semibold text-blue-800">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                  <TableBody>
                    {filteredPases.length > 0 ? (
                      filteredPases.map((pase) => (
                        <TableRow
                          key={pase.id}
                          className={newNotifications.some((n) => n.id === pase.id) ? "bg-yellow-50" : 
                            filteredPases.indexOf(pase) % 2 === 0 ? "bg-white" : "bg-blue-50/50 hover:bg-blue-50"}
                        >
                          <TableCell className="font-medium text-blue-800">{pase.folio}</TableCell>
                          <TableCell>{new Date(pase.fecha).toLocaleDateString()}</TableCell>
                          <TableCell>{`${pase.operadorNombre} ${pase.operadorApellidoPaterno}`}</TableCell>
                          <TableCell>{pase.tractorPlaca}</TableCell>
                          <TableCell>{pase.razonSocial}</TableCell>
                          <TableCell>{getEstadoBadge(pase.estado)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerDetalle(pase.id!)}
                                className="bg-blue-600 text-white border-none hover:bg-blue-700 font-medium py-1 px-3 rounded-lg shadow-md transition-all duration-200 flex items-center gap-1"
                              >
                                <FileTextIcon className="h-3 w-3" />
                                {pase.estado === "PENDIENTE" ? "Autorizar" : "Ver Detalle"}
                              </Button>
                              
                              {pase.estado !== "FIRMADO" && pase.estado !== "AUTORIZADO" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuickAction(pase.id!, "eliminar")}
                                  className="bg-red-600 text-white border-none hover:bg-red-700 font-medium py-1 px-3 rounded-lg shadow-md transition-all duration-200 flex items-center gap-1"
                                >
                                  <TrashIcon className="h-3 w-3" />
                                  Eliminar
                                </Button>
                              )}

                              {pase.estado === "FIRMADO" && (
                                <>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleQuickAction(pase.id!, "autorizar")}
                                    className="bg-green-600 text-white border-none hover:bg-green-700 font-medium py-1 px-3 rounded-lg shadow-md transition-all duration-200 flex items-center gap-1"
                                  >
                                    <CheckCircleIcon className="h-3 w-3" />
                                    Aprobar
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleQuickAction(pase.id!, "rechazar")}
                                    className="bg-red-600 text-white border-none hover:bg-red-700 font-medium py-1 px-3 rounded-lg shadow-md transition-all duration-200 flex items-center gap-1"
                                  >
                                    <XCircleIcon className="h-3 w-3" />
                                    Rechazar
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleQuickAction(pase.id!, "eliminar")}
                                    className="bg-red-600 text-white border-none hover:bg-red-700 font-medium py-1 px-3 rounded-lg shadow-md transition-all duration-200 flex items-center gap-1"
                                  >
                                    <TrashIcon className="h-3 w-3" />
                                    Eliminar
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="bg-blue-50 rounded-xl p-8 shadow-sm border border-blue-100 max-w-lg mx-auto">
                            <p className="mb-3 font-medium text-blue-800 text-lg">No se encontraron pases de salida</p>
                            <p className="text-blue-600">
                              {searchQuery
                                ? "No hay pases que coincidan con la búsqueda"
                                : activeTab === "pendientes"
                                  ? "No hay pases pendientes de autorización"
                                  : activeTab === "firmados"
                                    ? "No hay pases firmados"
                                    : activeTab === "rechazados"
                                      ? "No hay pases rechazados"
                                      : "No hay pases registrados"}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </AuthRedirect>
  )
}
