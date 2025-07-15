"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { usePase, type PaseData } from "@/context/pase-context"
import { useAuth } from "@/context/auth-context"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileTextIcon, SearchIcon, LogOutIcon, RefreshCwIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import AppHeader from "@/components/app-header"
import AuthRedirect from "@/components/auth-redirect"
import LoadingIndicator from "@/components/loading-indicator"

export default function SeguridadPage() {
  const router = useRouter()
  const { pases, loading, refreshPases, searchPases } = usePase()
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchPases(searchQuery.trim())
      } else {
        // Cargar tanto pases FIRMADO como AUTORIZADO
        refreshPases(0, 50, "FIRMADO,AUTORIZADO", undefined) // Show both signed and authorized passes
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, searchPases, refreshPases])

  // Filter only signed or authorized passes
  const filteredPases = pases
    .filter((pase) => pase.estado === "FIRMADO" || pase.estado === "AUTORIZADO")
    .sort((a, b) => {
      // Sort by creation date (newest first)
      return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
    })

  const handleVerDetalle = (id: string) => {
    router.push(`/autorizar/${id}`)
  }

  const getEstadoBadge = (estado: PaseData["estado"]) => {
    switch (estado) {
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
      default:
        return <Badge variant="outline" className="bg-yellow-500 text-white border-none text-sm font-medium px-4 py-1.5 rounded-full shadow-md">Pendiente</Badge>
    }
  }

  const handleLogout = () => {
    logout()
    // La redirección se maneja dentro de la función logout del contexto de autenticación
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  if (loading && pases.length === 0) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <LoadingIndicator text="Cargando panel de seguridad" size="lg" />
      </div>
    )
  }

  return (
    <AuthRedirect allowedRoles={["admin", "seguridad"]}>
      <div className="max-w-7xl mx-auto py-6">
        <AppHeader
          title="Panel de Seguridad"
          description={`Bienvenido, ${user?.name || "Usuario"}. Aquí puede verificar los pases de salida autorizados.`}
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

        <Card className="shadow-xl bg-white rounded-xl overflow-hidden mx-auto mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-6">
            <h2 className="text-xl font-bold tracking-tight">Buscar Pases de Salida</h2>
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
              <h2 className="text-xl font-bold tracking-tight">Pases de Salida Autorizados</h2>
              <Badge className="bg-green-500 text-white border-none text-sm font-medium px-4 py-1.5 rounded-full shadow-md">
                {filteredPases.length} pases disponibles
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredPases.length > 0 ? (
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
                      <TableHead className="font-semibold text-blue-800">Fecha Autorización</TableHead>
                      <TableHead className="text-right font-semibold text-blue-800">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPases.map((pase, index) => (
                      <TableRow 
                        key={pase.id} 
                        className={index % 2 === 0 ? "bg-white" : "bg-blue-50/50 hover:bg-blue-50"}
                      >
                        <TableCell className="font-medium text-blue-800">{pase.folio}</TableCell>
                        <TableCell>{new Date(pase.fecha).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{`${pase.operadorNombre} ${pase.operadorApellidoPaterno}`}</TableCell>
                        <TableCell>{pase.tractorPlaca}</TableCell>
                        <TableCell>{pase.razonSocial}</TableCell>
                        <TableCell>{getEstadoBadge(pase.estado)}</TableCell>
                        <TableCell>
                          {pase.fechaAutorizacion
                            ? new Date(pase.fechaAutorizacion).toLocaleDateString()
                            : pase.fechaFirma
                              ? new Date(pase.fechaFirma).toLocaleDateString()
                              : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVerDetalle(pase.id!)}
                            className="bg-blue-600 text-white border-none hover:bg-blue-700 font-medium py-1 px-3 rounded-lg shadow-md transition-all duration-200 flex items-center gap-1"
                          >
                            <FileTextIcon className="h-3 w-3" />
                            Ver Detalle
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="bg-blue-50 rounded-xl p-8 shadow-sm border border-blue-100 max-w-lg mx-auto">
                  <p className="mb-3 font-medium text-blue-800 text-lg">
                    {searchQuery
                      ? "No se encontraron pases que coincidan con la búsqueda"
                      : "No hay pases de salida autorizados"}
                  </p>
                  <p className="text-blue-600">
                    {searchQuery
                      ? "Intente con otros términos de búsqueda"
                      : "Los pases firmados y autorizados aparecerán aquí."}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthRedirect>
  )
}
