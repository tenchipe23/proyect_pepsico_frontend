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
        refreshPases(0, 50, "AUTORIZADO") // Only show authorized passes
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
      default:
        return <Badge variant="outline">Pendiente</Badge>
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
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
      <div className="max-w-7xl mx-auto">
        <AppHeader
          title="Panel de Seguridad"
          description={`Bienvenido, ${user?.name || "Usuario"}. Aquí puede verificar los pases de salida autorizados.`}
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

        <Card className="shadow-xl mb-6">
          <CardHeader className="bg-gray-900 text-white p-4">
            <h2 className="text-xl font-bold">Buscar Pases de Salida</h2>
          </CardHeader>
          <CardContent className="p-4">
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
              <Button variant="outline" size="icon" onClick={handleClearSearch} title="Limpiar búsqueda">
                <RefreshCwIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader className="bg-gray-100 p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Pases de Salida Autorizados</h2>
              <Badge className="bg-green-600">{filteredPases.length} pases disponibles</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredPases.length > 0 ? (
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
                      <TableHead>Fecha Autorización</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPases.map((pase) => (
                      <TableRow key={pase.id}>
                        <TableCell className="font-medium">{pase.folio}</TableCell>
                        <TableCell>{new Date(pase.fecha).toLocaleDateString()}</TableCell>
                        <TableCell>{`${pase.operadorNombre} ${pase.operadorApellidoPaterno}`}</TableCell>
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
                            className="flex items-center gap-1"
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
              <div className="p-8 text-center text-gray-500">
                <p className="mb-2 font-medium">
                  {searchQuery
                    ? "No se encontraron pases que coincidan con la búsqueda"
                    : "No hay pases de salida autorizados"}
                </p>
                <p className="text-sm">
                  {searchQuery
                    ? "Intente con otros términos de búsqueda"
                    : "Los pases firmados y autorizados aparecerán aquí."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthRedirect>
  )
}
