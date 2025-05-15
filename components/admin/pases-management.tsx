"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePase, type PaseData } from "@/context/pase-context"
import { FileTextIcon, SearchIcon, CheckCircleIcon, XCircleIcon, TrashIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

export default function PasesManagement() {
  const router = useRouter()
  const { pases, updatePase, deletePase } = usePase()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchField, setSearchField] = useState<keyof PaseData>("folio")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPaseId, setCurrentPaseId] = useState<string | null>(null)

  // Filtrar pases según la búsqueda
  const filteredPases = pases
    .filter((pase) => {
      if (!searchQuery) return true

      const value = pase[searchField]
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchQuery.toLowerCase())
      }
      return false
    })
    .sort((a, b) => {
      // Ordenar por fecha de creación (más reciente primero)
      return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
    })

  const handleVerDetalle = (id: string) => {
    router.push(`/autorizar/${id}`)
  }

  const handleAutorizar = (id: string, autorizar: boolean) => {
    updatePase(id, {
      estado: autorizar ? "autorizado" : "rechazado",
      fechaAutorizacion: new Date().toISOString(),
    })

    toast({
      variant: autorizar ? "success" : "destructive",
      title: autorizar ? "Pase autorizado" : "Pase rechazado",
      description: autorizar ? "El pase ha sido autorizado correctamente" : "El pase ha sido rechazado correctamente",
    })
  }

  const handleDeletePase = () => {
    if (!currentPaseId) return

    deletePase(currentPaseId)
    setIsDeleteDialogOpen(false)
    setCurrentPaseId(null)

    toast({
      variant: "success",
      title: "Pase eliminado",
      description: "El pase ha sido eliminado correctamente",
    })
  }

  const openDeleteDialog = (id: string) => {
    setCurrentPaseId(id)
    setIsDeleteDialogOpen(true)
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

  return (
    <div>
      <div className="p-4 flex flex-col md:flex-row gap-4">
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
              <SelectItem value="estado">Estado</SelectItem>
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
                <TableRow key={pase.id}>
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
                        Ver/Editar
                      </Button>

                      {pase.estado === "firmado" && (
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
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No se encontraron pases de salida
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo para eliminar pase */}
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
            <Button variant="destructive" onClick={handleDeletePase}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
