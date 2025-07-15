"use client"

import * as React from 'react';
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePase, type PaseData } from "@/context/pase-context"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

// Custom Badge component since we removed the original one
const Badge = ({ className, children, variant = 'default', ...props }: { className?: string, children: React.ReactNode, variant?: 'default' | 'secondary' | 'destructive' | 'outline' }) => {
  const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors';
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/80 border-transparent',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent',
    outline: 'text-foreground',
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)} {...props}>
      {children}
    </div>
  );
};
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
        refreshPases(0, 50, activeTab === "todos" ? undefined : activeTab.toUpperCase(), undefined)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, activeTab, searchPases, refreshPases])

  // Filter pases based on active tab
  const filteredPases = pases.filter((pase: PaseData) => {
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
      await refreshPases(0, 50, activeTab === "todos" ? undefined : activeTab.toUpperCase(), undefined)
      
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

    const paseToDelete = pases.find(p => p.id === currentPaseId);
    if (!paseToDelete) return;



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
          <div className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
            "bg-yellow-100 text-yellow-800 border-yellow-300"
          )}>
            Pendiente
          </div>
        )
      case "FIRMADO":
        return (
          <div className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
            "bg-blue-100 text-blue-800 border-blue-300"
          )}>
            Firmado
          </div>
        )
      case "AUTORIZADO":
        return (
          <div className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
            "bg-green-600 text-white"
          )}>
            Autorizado
          </div>
        )
      case "RECHAZADO":
        return (
          <div className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
            "bg-destructive text-destructive-foreground"
          )}>
            Rechazado
          </div>
        )
      default:
        return (
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
            Desconocido
          </div>
        )
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
      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar pases por folio, operador, placa, razón social..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
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
                  <span className="flex items-center">
                    Todos
                    <Badge variant="secondary" className="ml-2">
                      {pases.length}
                    </Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="pendiente">
                  <span className="flex items-center">
                    Pendientes
                    <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-300">
                      {pases.filter((p: PaseData) => p.estado === "PENDIENTE").length}
                    </Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="firmado">
                  <span className="flex items-center">
                    Firmados
                    <Badge className="ml-2 bg-blue-500">
                      {pases.filter((p: PaseData) => p.estado === "FIRMADO").length}
                    </Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="autorizado">
                  <span className="flex items-center">
                    Autorizados
                    <Badge className="ml-2 bg-green-500">
                      {pases.filter((p: PaseData) => p.estado === "AUTORIZADO").length}
                    </Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="rechazado">
                  <span className="flex items-center">
                    Rechazados
                    <Badge className="ml-2 bg-red-500">
                      {pases.filter((p: PaseData) => p.estado === "RECHAZADO").length}
                    </Badge>
                  </span>
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
                      filteredPases.map((pase: PaseData) => (
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

                              <div className="flex gap-2">
                                {pase.estado === "FIRMADO" && (
                                  <>
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={() => pase.id && handleAutorizar(pase.id, true)}
                                      className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                                    >
                                      <CheckCircleIcon className="h-3 w-3" />
                                      Autorizar
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => pase.id && handleAutorizar(pase.id, false)}
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
                                  onClick={() => pase.id && openDeleteDialog(pase.id)}
                                  className="flex items-center gap-1"
                                >
                                  <TrashIcon className="h-3 w-3" />
                                  Eliminar
                                </Button>
                              </div>
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
        <DialogContent className="sm:max-w-md bg-white text-black p-6 rounded-lg shadow-xl">
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
