"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { usePase, type PaseData } from "@/context/pase-context"
import { useAuth } from "@/context/auth-context"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileTextIcon,
  SearchIcon,
  LogOutIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  RefreshCwIcon,
} from "lucide-react"
import AppHeader from "@/components/app-header"
import AuthRedirect from "@/components/auth-redirect"
import NotificationBadge from "@/components/notification-badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useRouter } from "next/navigation"
import LoadingIndicator from "@/components/loading-indicator"

export default function AutorizadorDashboardPage() {
  const { pases, loading, authorizePase, rejectPase, refreshPases } = usePase()
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchField, setSearchField] = useState<keyof PaseData>("folio")
  const [activeTab, setActiveTab] = useState("pendientes")
  const [dateFilter, setDateFilter] = useState<string | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const router = useRouter()

  // Refresh data on mount
  useEffect(() => {
    refreshPases()
  }, [refreshPases])

  // Filter passes based on search query, tab, and date filter
  const getFilteredPases = useCallback(() => {
    return pases
      .filter((pase) => {
        // Filter by tab (status)
        if (activeTab === "pendientes") {
          return pase.estado === "pendiente"
        } else if (activeTab === "firmados") {
          return pase.estado === "firmado"
        } else if (activeTab === "rechazados") {
          return pase.estado === "rechazado"
        } else if (activeTab === "todos") {
          return true
        }
        return false
      })
      .filter((pase) => {
        // Filter by search query
        if (!searchQuery) return true

        const value = pase[searchField]
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchQuery.toLowerCase())
        }
        return false
      })
      .filter((pase) => {
        // Filter by date
        if (!dateFilter) return true

        const paseDate = new Date(pase.fecha).toISOString().split("T")[0]
        return paseDate === dateFilter
      })
      .sort((a, b) => {
        // Sort by creation date (newest first)
        return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
      })
  }, [pases, activeTab, searchQuery, searchField, dateFilter])

  const filteredPases = getFilteredPases()

  // Get new notifications (passes created in the last 24 hours)
  const getNewNotifications = useCallback(() => {
    if (typeof window === "undefined") return []

    const lastChecked = localStorage.getItem("lastNotificationCheck")
    if (!lastChecked) return []

    return pases
      .filter((pase) => pase.estado === "pendiente" && new Date(pase.fechaCreacion) > new Date(lastChecked))
      .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
  }, [pases])

  const newNotifications = getNewNotifications()

  const handleVerDetalle = (id: string) => {
    router.push(`/autorizar/${id}`)
  }

  const handleQuickAction = async (id: string, action: "autorizar" | "rechazar") => {
    const pase = pases.find((p) => p.id === id)

    if (!pase) {
      return
    }

    if (!pase.firma || !pase.sello) {
      return
    }

    try {
      if (action === "autorizar") {
        await authorizePase(id)
      } else {
        await rejectPase(id)
      }
    } catch (error) {
      console.error(`Error al ${action} pase:`, error)
    }
  }

  const getEstadoBadge = (estado: PaseData["estado"]) => {
    switch (estado) {
      case "pendiente":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Pendiente
          </Badge>
        )
      case "firmado":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            Firmado
          </Badge>
        )
      case "autorizado":
        return (
          <Badge variant="default" className="bg-green-600">
            Autorizado
          </Badge>
        )
      case "rechazado":
        return <Badge variant="destructive">Rechazado</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setDateFilter(null)
  }

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
    if (!showNotifications) {
      localStorage.setItem("lastNotificationCheck", new Date().toISOString())
    }
  }

  if (loading) {
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
      <div className="max-w-6xl mx-auto">
        <AppHeader
          title="Panel de Autorización"
          description={`Bienvenido, ${user?.name || "Usuario"}. Aquí puede autorizar los pases de salida.`}
          actions={
            <div className="flex items-center gap-3">
              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/10 text-white hover:bg-white/20 relative"
                  onClick={handleNotificationClick}
                >
                  <BellIcon className="h-5 w-5" />
                  <NotificationBadge className="absolute -top-1 -right-1" />
                </Button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden">
                    <div className="p-3 bg-gray-100 border-b font-medium flex justify-between items-center">
                      <span>Notificaciones</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setShowNotifications(false)}
                      >
                        <XCircleIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {newNotifications.length > 0 ? (
                        <div className="divide-y">
                          {newNotifications.map((pase) => (
                            <div key={pase.id} className="p-3 hover:bg-gray-50">
                              <div className="flex justify-between">
                                <span className="font-medium">{pase.folio}</span>
                                <span className="text-xs text-gray-500">
                                  {format(new Date(pase.fechaCreacion), "dd MMM, HH:mm", { locale: es })}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                Nuevo pase de {pase.operadorNombre} {pase.operadorApellidoPaterno}
                              </p>
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 h-auto mt-1"
                                onClick={() => {
                                  handleVerDetalle(pase.id!)
                                  setShowNotifications(false)
                                }}
                              >
                                Ver detalles
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500">No hay notificaciones nuevas</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20 flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOutIcon className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          }
        />

        <Card className="shadow-xl mb-6">
          <CardHeader className="bg-gray-900 text-white p-4">
            <h2 className="text-xl font-bold">Buscar Pases</h2>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/4">
                <Select value={searchField} onValueChange={(value) => setSearchField(value as keyof PaseData)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Campo de búsqueda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="folio">Folio</SelectItem>
                    <SelectItem value="operadorNombre">Nombre Operador</SelectItem>
                    <SelectItem value="operadorApellidoPaterno">Apellido Operador</SelectItem>
                    <SelectItem value="tractorPlaca">Placa Tractor</SelectItem>
                    <SelectItem value="razonSocial">Razón Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={`Buscar por ${searchField}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="w-full md:w-1/4 flex gap-2">
                <div className="relative flex-1">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="date"
                    value={dateFilter || ""}
                    onChange={(e) => setDateFilter(e.target.value || null)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="icon" onClick={handleClearFilters} title="Limpiar filtros">
                  <RefreshCwIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <Tabs defaultValue="pendientes" value={activeTab} onValueChange={setActiveTab}>
            <div className="px-4 pt-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="pendientes" className="relative">
                  Pendientes
                  {pases.filter((p) => p.estado === "pendiente").length > 0 && (
                    <Badge className="ml-2 bg-yellow-500">{pases.filter((p) => p.estado === "pendiente").length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="firmados">
                  Firmados
                  {pases.filter((p) => p.estado === "firmado").length > 0 && (
                    <Badge className="ml-2 bg-blue-500">{pases.filter((p) => p.estado === "firmado").length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="rechazados">
                  Rechazados
                  {pases.filter((p) => p.estado === "rechazado").length > 0 && (
                    <Badge className="ml-2 bg-red-500">{pases.filter((p) => p.estado === "rechazado").length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="todos">Todos</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="m-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Folio</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Operador</TableHead>
                      <TableHead>Placa</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPases.length > 0 ? (
                      filteredPases.map((pase) => (
                        <TableRow
                          key={pase.id}
                          className={newNotifications.some((n) => n.id === pase.id) ? "bg-yellow-50" : ""}
                        >
                          <TableCell className="font-medium">{pase.folio}</TableCell>
                          <TableCell>{new Date(pase.fecha).toLocaleDateString()}</TableCell>
                          <TableCell>{`${pase.operadorNombre} ${pase.operadorApellidoPaterno}`}</TableCell>
                          <TableCell>{pase.tractorPlaca}</TableCell>
                          <TableCell>{getEstadoBadge(pase.estado)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerDetalle(pase.id!)}
                                className="flex items-center gap-1"
                              >
                                <FileTextIcon className="h-3 w-3" />
                                {pase.estado === "pendiente" ? "Autorizar" : "Ver Detalle"}
                              </Button>

                              {pase.estado === "pendiente" && pase.firma && pase.sello && (
                                <>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleQuickAction(pase.id!, "autorizar")}
                                    className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                                  >
                                    <CheckCircleIcon className="h-3 w-3" />
                                    Aprobar
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleQuickAction(pase.id!, "rechazar")}
                                    className="flex items-center gap-1"
                                  >
                                    <XCircleIcon className="h-3 w-3" />
                                    Rechazar
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          <p className="mb-2 font-medium">No se encontraron pases de salida</p>
                          <p className="text-sm">
                            {activeTab === "pendientes"
                              ? "No hay pases pendientes de autorización"
                              : activeTab === "firmados"
                                ? "No hay pases firmados"
                                : activeTab === "rechazados"
                                  ? "No hay pases rechazados"
                                  : "No hay pases que coincidan con los criterios de búsqueda"}
                          </p>
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
