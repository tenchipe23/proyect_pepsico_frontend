"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePase, type PaseData } from "@/context/pase-context"
import { useToast } from "@/components/ui/use-toast"
import {
  FileTextIcon,
  SearchIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  ClipboardListIcon,
  ClockIcon,
  CheckIcon,
  AlertTriangleIcon,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import LoadingIndicator from "@/components/loading-indicator"

export default function PasesManagement() {
  const router = useRouter()
  const { pases, loading, authorizePase, rejectPase, deletePase, refreshPases, searchPases, getStatistics } = usePase()
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("todos")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPaseId, setCurrentPaseId] = useState<string | null>(null)
  const [statistics, setStatistics] = useState<any>(null)

  // Load statistics on mount and when pases change
  useEffect(() => {
    let isMounted = true
    
    const loadStats = async () => {
      try {
        console.log("Loading statistics...")
        const stats = await getStatistics()
        console.log("Statistics loaded:", stats)
        
        if (isMounted) {
          setStatistics(stats)
        }
      } catch (error) {
        console.error("Error loading statistics:", error)
        // Set default values if there's an error
        if (isMounted) {
          console.log("Setting default statistics due to error")
          setStatistics({
            totalPasses: 0,
            pendingPasses: 0,
            signedPasses: 0,
            authorizedPasses: 0,
            rejectedPasses: 0,
            todayPasses: 0
          })
        }
      }
    }
    
    loadStats()
    
    // Cleanup function
    return () => {
      isMounted = false
    }
  }, [getStatistics]) // Removed pases from dependencies to avoid infinite loops

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchPases(searchQuery.trim())
      } else {
        refreshPases(0, 50, activeTab === "todos" ? undefined : activeTab.toUpperCase())
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, activeTab, searchPases, refreshPases])

  // Filter pases based on active tab
  const filteredPases = pases.filter((pase) => {
    if (activeTab === "todos") return true
    return pase.estado.toLowerCase() === activeTab
  })

  const handleVerDetalle = (id: string) => {
    router.push(`/autorizar/${id}`)
  }

  const handleAutorizar = async (id: string, autorizar: boolean) => {
    try {
      console.log(`${autorizar ? 'Autorizando' : 'Rechazando'} pase:`, id)
      
      if (autorizar) {
        await authorizePase(id)
      } else {
        await rejectPase(id)
      }
      
      console.log("Pase actualizado, actualizando estadísticas...")
      
      // Forzar actualización de la lista de pases
      await refreshPases(0, 50, activeTab === "todos" ? undefined : activeTab.toUpperCase())
      
      // Actualizar estadísticas
      const stats = await getStatistics()
      console.log("Estadísticas actualizadas:", stats)
      setStatistics(stats)
      
      // Mostrar notificación de éxito
      toast({
        title: `Pase ${autorizar ? 'autorizado' : 'rechazado'} exitosamente`,
        description: `El pase ha sido ${autorizar ? 'autorizado' : 'rechazado'}.`,
      })
      
    } catch (error) {
      console.error("Error al procesar pase:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo ${autorizar ? 'autorizar' : 'rechazar'} el pase: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      })
    }
  }

  const handleDeletePase = async () => {
    if (!currentPaseId) return

    try {
      await deletePase(currentPaseId)
      setIsDeleteDialogOpen(false)
      setCurrentPaseId(null)
      // Refresh statistics
      const stats = await getStatistics()
      setStatistics(stats)
    } catch (error) {
      console.error("Error deleting pase:", error)
    }
  }

  const openDeleteDialog = (id: string) => {
    setCurrentPaseId(id)
    setIsDeleteDialogOpen(true)
  }

  const getEstadoBadge = (estado: PaseData["estado"]) => {
    switch (estado) {
      case "PENDIENTE":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Pendiente
          </Badge>
        )
      case "FIRMADO":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            Firmado
          </Badge>
        )
      case "AUTORIZADO":
        return (
          <Badge variant="default" className="bg-green-600">
            Autorizado
          </Badge>
        )
      case "RECHAZADO":
        return <Badge variant="destructive">Rechazado</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  if (loading && pases.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingIndicator text="Cargando pases..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Total Pases */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pases</CardTitle>
            <ClipboardListIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statistics ? (
              <div className="text-2xl font-bold">{statistics.totalPasses}</div>
            ) : (
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
            )}
          </CardContent>
        </Card>

        {/* Pendientes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statistics ? (
              <div className="text-2xl font-bold">{statistics.pendingPasses}</div>
            ) : (
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
            )}
          </CardContent>
        </Card>

        {/* Firmados */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Firmados</CardTitle>
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statistics ? (
              <div className="text-2xl font-bold">{statistics.signedPasses}</div>
            ) : (
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
            )}
          </CardContent>
        </Card>

        {/* Autorizados */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Autorizados</CardTitle>
            <CheckIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statistics ? (
              <div className="text-2xl font-bold">{statistics.authorizedPasses}</div>
            ) : (
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
            )}
          </CardContent>
        </Card>

        {/* Rechazados */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rechazados</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statistics ? (
              <div className="text-2xl font-bold">{statistics.rejectedPasses}</div>
            ) : (
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar pases por folio, operador, placa, razón social..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs and Table */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab}>
            <div className="px-4 pt-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="todos">
                  Todos
                  <Badge className="ml-2 bg-gray-500">{pases.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="pendiente">
                  Pendientes
                  <Badge className="ml-2 bg-yellow-500">{pases.filter((p) => p.estado === "PENDIENTE").length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="firmado">
                  Firmados
                  <Badge className="ml-2 bg-blue-500">{pases.filter((p) => p.estado === "FIRMADO").length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="autorizado">
                  Autorizados
                  <Badge className="ml-2 bg-green-500">{pases.filter((p) => p.estado === "AUTORIZADO").length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="rechazado">
                  Rechazados
                  <Badge className="ml-2 bg-red-500">{pases.filter((p) => p.estado === "RECHAZADO").length}</Badge>
                </TabsTrigger>
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
                      <TableHead>Razón Social</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPases.length > 0 ? (
                      filteredPases.map((pase) => (
                        <TableRow key={pase.id}>
                          <TableCell className="font-medium">{pase.folio}</TableCell>
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
                                className="flex items-center gap-1"
                              >
                                <FileTextIcon className="h-3 w-3" />
                                Ver/Editar
                              </Button>

                              {pase.estado === "FIRMADO" && (
                                <>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleAutorizar(pase.id!, true)}
                                    className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                                  >
                                    <CheckCircleIcon className="h-3 w-3" />
                                    Autorizar
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleAutorizar(pase.id!, false)}
                                    className="flex items-center gap-1"
                                  >
                                    <XCircleIcon className="h-3 w-3" />
                                    Rechazar
                                  </Button>
                                </>
                              )}

                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openDeleteDialog(pase.id!)}
                                className="flex items-center gap-1"
                              >
                                <TrashIcon className="h-3 w-3" />
                                Eliminar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          {searchQuery
                            ? "No se encontraron pases que coincidan con la búsqueda"
                            : "No hay pases de salida"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar Pase de Salida</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>¿Está seguro que desea eliminar este pase de salida?</p>
            <p className="text-sm text-gray-500 mt-2">Esta acción no se puede deshacer.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeletePase} disabled={loading}>
              {loading ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
