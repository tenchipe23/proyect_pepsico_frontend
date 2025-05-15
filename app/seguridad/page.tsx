"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { usePase, type PaseData } from "@/context/pase-context"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { FileTextIcon, SearchIcon, LogOutIcon } from "lucide-react"
import AppHeader from "@/components/app-header"
import AuthRedirect from "@/components/auth-redirect"

export default function SeguridadPage() {
  const router = useRouter()
  const { pases } = usePase()
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchField, setSearchField] = useState<keyof PaseData>("folio")
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

  // Filter only signed or authorized passes
  const filteredPases = pases
    .filter((pase) => pase.estado === "firmado" || pase.estado === "autorizado")
    .filter((pase) => {
      if (!searchQuery) return true

      const value = pase[searchField]
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchQuery.toLowerCase())
      }
      return false
    })
    .sort((a, b) => {
      // Sort by creation date (newest first)
      return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
    })

  const handleVerDetalle = (id: string) => {
    router.push(`/autorizar/${id}`)
  }

  const getEstadoBadge = (estado: PaseData["estado"]) => {
    switch (estado) {
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
      default:
        return <Badge variant="outline">Pendiente</Badge>
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  // If still loading after authentication, show loading indicator
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="text-white text-center">
          <h2 className="text-xl font-bold mb-2">Cargando...</h2>
          <p>Cargando panel de seguridad</p>
        </div>
      </div>
    )
  }

  return (
    <AuthRedirect allowedRoles={["admin", "seguridad"]}>
      <div className="max-w-6xl mx-auto">
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
                    <SelectItem value="fecha">Fecha</SelectItem>
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
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader className="bg-gray-100 p-4 border-b">
            <h2 className="text-lg font-bold">Pases de Salida Autorizados</h2>
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
                      <TableHead>Estado</TableHead>
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
                        <TableCell>{getEstadoBadge(pase.estado)}</TableCell>
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
                <p className="mb-2 font-medium">No hay pases de salida autorizados</p>
                <p className="text-sm">Los pases firmados y autorizados aparecerán aquí.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthRedirect>
  )
}
