"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon } from "lucide-react"
import { useUserManagement } from "@/hooks/use-user-management"
import type { UserRole } from "@/context/auth-context"

export default function UserManagement() {
  const { toast } = useToast()
  const { users, addUser, updateUser, deleteUser } = useUserManagement()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "autorizador" as UserRole,
  })

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value as UserRole,
    }))
  }

  const handleAddUser = () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Todos los campos son obligatorios",
      })
      return
    }

    addUser({
      id: crypto.randomUUID(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    })

    toast({
      variant: "success",
      title: "Usuario agregado",
      description: "El usuario ha sido agregado correctamente",
    })

    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditUser = () => {
    if (!currentUser || !formData.name || !formData.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Todos los campos son obligatorios",
      })
      return
    }

    updateUser(currentUser.id, {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      ...(formData.password ? { password: formData.password } : {}),
    })

    toast({
      variant: "success",
      title: "Usuario actualizado",
      description: "El usuario ha sido actualizado correctamente",
    })

    setIsEditDialogOpen(false)
    resetForm()
  }

  const handleDeleteUser = () => {
    if (!currentUser) return

    deleteUser(currentUser.id)

    toast({
      variant: "success",
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado correctamente",
    })

    setIsDeleteDialogOpen(false)
  }

  const openEditDialog = (user: any) => {
    setCurrentUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (user: any) => {
    setCurrentUser(user)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "autorizador",
    })
    setCurrentUser(null)
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador"
      case "autorizador":
        return "Autorizador"
      case "seguridad":
        return "Seguridad"
      default:
        return role
    }
  }

  return (
    <div>
      <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar usuarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => {
            resetForm()
            setIsAddDialogOpen(true)
          }}
          className="bg-blue-700 hover:bg-blue-800 flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Agregar Usuario
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo Electrónico</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleName(user.role)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(user)}
                        className="flex items-center gap-1"
                      >
                        <PencilIcon className="h-3 w-3" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteDialog(user)}
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
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No se encontraron usuarios
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo para agregar usuario */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="autorizador">Autorizador</SelectItem>
                  <SelectItem value="seguridad">Seguridad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddUser} className="bg-blue-700 hover:bg-blue-800">
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar usuario */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre</Label>
              <Input id="edit-name" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Correo Electrónico</Label>
              <Input id="edit-email" name="email" type="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">Contraseña (dejar en blanco para no cambiar)</Label>
              <Input
                id="edit-password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Rol</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="autorizador">Autorizador</SelectItem>
                  <SelectItem value="seguridad">Seguridad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditUser} className="bg-blue-700 hover:bg-blue-800">
              Actualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para eliminar usuario */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar Usuario</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              ¿Está seguro que desea eliminar al usuario <strong>{currentUser?.name}</strong>?
            </p>
            <p className="text-sm text-gray-500 mt-2">Esta acción no se puede deshacer.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
