"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon, UsersIcon, UserCheckIcon, ShieldIcon } from "lucide-react"
import { useUserManagement } from "@/hooks/use-user-management"
import type { UserRole } from "@/context/auth-context"
import LoadingIndicator from "@/components/loading-indicator"

export default function UserManagement() {
  const { users, loading, stats, addUser, updateUser, deleteUser, searchUsers, refreshUsers } = useUserManagement()

  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  // Handle dialog state changes
  const handleAddDialogChange = (open: boolean) => {
    setIsAddDialogOpen(open)
    if (!open) resetForm()
  }
  
  const handleEditDialogChange = (open: boolean) => {
    setIsEditDialogOpen(open)
    if (!open) resetForm()
  }
  
  const handleDeleteDialogChange = (open: boolean) => {
    setIsDeleteDialogOpen(open)
    if (!open) setCurrentUser(null)
  }
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [formData, setFormData] = useState<{
    name: string
    apellido: string
    segundoApellido: string
    email: string
    password: string
    role: UserRole
  }>({
    name: "",
    apellido: "",
    segundoApellido: "",
    email: "",
    password: "",
    role: "autorizador" as UserRole, // Valor por defecto - NUNCA debe ser null o undefined
  })
  
  // Log del estado inicial del formulario
  useEffect(() => {
    console.log('Initial formData state:', formData);
  }, [])

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchUsers(searchQuery.trim())
      } else {
        refreshUsers()
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, searchUsers, refreshUsers])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRoleChange = (value: string) => {
    console.log('handleRoleChange called with value:', value);
    console.log('handleRoleChange value type:', typeof value);
    
    // Validar que el valor no sea nulo, indefinido o vacío
    if (value === null || value === undefined || value === '') {
      console.error('handleRoleChange received null, undefined or empty value, using default');
      value = 'autorizador' as UserRole;
    }
    
    // Validar que el valor sea una cadena
    if (typeof value !== 'string') {
      console.error('handleRoleChange received non-string value, converting to string');
      value = String(value);
    }
    
    // Validar que el valor no esté vacío después de la conversión
    if (value.trim() === '') {
      console.error('handleRoleChange received empty string after trimming, using default');
      value = 'autorizador' as UserRole;
    }
    
    // Validar que el valor sea uno de los roles permitidos
    const validRoles = ['admin', 'autorizador', 'seguridad', 'user'];
    if (!validRoles.includes(value)) {
      console.error(`handleRoleChange received invalid role: ${value}, using default`);
      value = 'autorizador' as UserRole;
    }
    
    // Asegurarse de que el valor sea válido antes de actualizar el estado
    const safeValue = value || ('autorizador' as UserRole);
    
    setFormData((prev) => {
      const updatedForm = {
        ...prev,
        role: safeValue as UserRole,
      };
      console.log('Updated formData after role change:', updatedForm);
      
      // Actualizar también el campo oculto si existe
      const hiddenRoleInput = document.getElementById('hidden-role') as HTMLInputElement;
      if (hiddenRoleInput) {
        hiddenRoleInput.value = safeValue;
        console.log('Updated hidden role input value:', hiddenRoleInput.value);
      } else {
        console.error('Could not find hidden-role input element');
      }
      
      // También actualizar el campo oculto para edición si existe
      const hiddenEditRoleInput = document.getElementById('hidden-edit-role') as HTMLInputElement;
      if (hiddenEditRoleInput) {
        hiddenEditRoleInput.value = safeValue;
        console.log('Updated hidden-edit-role input value:', hiddenEditRoleInput.value);
      }
      
      return updatedForm;
    });
  }

  const handleAddUser = async () => {
    console.log('handleAddUser called with formData:', formData);
    
    // Validación más completa según los requisitos del backend
    if (!formData.name || formData.name.trim() === '') {
      console.log('Validation failed - name is empty');
      alert("El nombre es obligatorio");
      return;
    }
    
    if (!formData.email || !formData.password) {
      console.log('Validation failed - missing required fields:', {
        email: !!formData.email,
        password: !!formData.password,
        role: !!formData.role
      });
      alert("Todos los campos marcados son obligatorios");
      return;
    }
    
    // Asegurarse de que el rol tenga un valor válido
    if (!formData.role) {
      console.log('Role is empty in form submission, setting default role');
      setFormData(prev => ({
        ...prev,
        role: "autorizador" as UserRole
      }));
    }

    // Asegurarse de que el rol tenga un valor válido
    let role = formData.role;
    if (!role) {
      console.log('Role is empty, setting default role');
      role = "autorizador" as UserRole;
      // Actualizar el formData para asegurar que el rol se envíe correctamente
      setFormData(prev => ({
        ...prev,
        role: role
      }));
    }
    
    // Asegurarse de que el rol sea una cadena y mantener el tipo UserRole
    if (typeof role !== 'string') {
      console.log('Role is not a string, converting to string');
      role = String(role) as UserRole;
    }
    
    // Validar que la contraseña tenga al menos 6 caracteres (requisito del backend)
    if (formData.password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Por favor, introduce un correo electrónico válido");
      return;
    }

    try {
      // Limpiar espacios en blanco al inicio y final del nombre
      const cleanName = formData.name.trim();
      
      // Asegurarse de que el nombre no esté vacío después de limpiar
      if (cleanName === '') {
        console.error('Name is empty after trimming');
        alert("El nombre no puede estar vacío");
        return;
      }
      
      console.log('Sending user data to backend:', {
        name: cleanName,
        apellido: formData.apellido || "",
        segundoApellido: formData.segundoApellido || "",
        email: formData.email,
        password: '***', // No mostrar la contraseña en los logs
        role: role,
        roleType: typeof role
      });
      
      // Crear un objeto con los datos validados para enviar
      const userData = {
        name: cleanName,
        apellido: formData.apellido || "", // Asegurar que no sea undefined
        segundoApellido: formData.segundoApellido || "", // Asegurar que no sea undefined
        email: formData.email,
        password: formData.password,
        role: role, // Usar el valor validado
      };
      
      // Verificación final para asegurar que el nombre y el rol no estén vacíos
      if (!userData.name || userData.name.trim() === '') {
        console.error('Final validation: name is empty');
        alert("El nombre no puede estar vacío");
        return;
      }
      
      if (!userData.role) {
        console.error('Final validation: role is empty, setting default');
        userData.role = "autorizador" as UserRole;
      }
      
      console.log('Sending validated user data:', {
        ...userData,
        password: '***', // No mostrar la contraseña en los logs
        role: userData.role,
        roleType: typeof userData.role
      });
      
      await addUser(userData);

      handleAddDialogChange(false)
    } catch (error: any) {
      console.error("Error adding user:", error);
      
      // Mostrar mensaje de error más descriptivo
      let errorMessage = "Error al crear usuario";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.validationErrors) {
        console.error('Validation errors:', error.validationErrors);
      }
      
      alert(`Error: ${errorMessage}`);
    }
  }

  const handleEditUser = async () => {
    console.log('handleEditUser called with formData:', formData);
    
    // Validación más completa según los requisitos del backend
    if (!formData.name || formData.name.trim() === '') {
      console.log('Validation failed - name is empty');
      alert("El nombre es obligatorio");
      return;
    }
    
    if (!formData.email) {
      console.log('Validation failed - missing required fields:', {
        email: !!formData.email
      });
      alert("Todos los campos marcados son obligatorios");
      return;
    }

    // Asegurarse de que el rol tenga un valor válido
    let role = formData.role;
    if (!role) {
      console.log('Role is empty, setting default role');
      role = "autorizador" as UserRole;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Por favor, introduce un correo electrónico válido");
      return;
    }

    // Validar contraseña si se está actualizando
    if (formData.password && formData.password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      // Limpiar espacios en blanco al inicio y final del nombre
      const cleanName = formData.name.trim();
      
      console.log('Sending user data to backend for update:', {
        name: cleanName,
        apellido: formData.apellido || "",
        segundoApellido: formData.segundoApellido || "",
        email: formData.email,
        password: formData.password ? '***' : undefined, // No mostrar la contraseña en los logs
        role: role,
        roleType: typeof role
      });
      
      // Asegurarse de que estamos enviando los campos correctos al backend
      await updateUser(currentUser.id, {
        name: cleanName, // Este campo se mapeará a 'nombre' en el hook
        apellido: formData.apellido || "", // Asegurar que no sea undefined
        segundoApellido: formData.segundoApellido || "", // Asegurar que no sea undefined
        email: formData.email,
        role: role, // Este campo se mapeará a 'rol' en el hook
        ...(formData.password ? { password: formData.password } : {}),
      })

      handleEditDialogChange(false)
    } catch (error: any) {
      console.error("Error updating user:", error);
      
      // Mostrar mensaje de error más descriptivo
      let errorMessage = "Error al actualizar usuario";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.validationErrors) {
        console.error('Validation errors:', error.validationErrors);
      }
      
      alert(`Error: ${errorMessage}`);
    }
  }

  const handleDeleteUser = async () => {
    if (!currentUser) return

    try {
      await deleteUser(currentUser.id)
      handleDeleteDialogChange(false)
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const openEditDialog = (user: any) => {
    console.log('Opening edit dialog with user:', user)
    console.log('User role:', user.rol || user.role, typeof (user.rol || user.role))
    setCurrentUser(user)
    setFormData({
      name: user.nombre || user.name || "",
      apellido: user.apellido || "",
      segundoApellido: user.segundoApellido || "",
      email: user.email,
      password: "",
      role: (user.rol || user.role || "") as UserRole,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (user: any) => {
    console.log('Opening delete dialog with user:', user)
    setCurrentUser(user)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    console.log('Resetting form data');
    const defaultFormData = {
      name: "",
      apellido: "",
      segundoApellido: "",
      email: "",
      password: "",
      role: "autorizador" as UserRole, // Asegurarse de que el tipo sea correcto
    };
    
    console.log('Default form data:', defaultFormData);
    setFormData(defaultFormData);
    setCurrentUser(null);
    
    // Verificar que el formulario se haya restablecido correctamente
    setTimeout(() => {
      console.log('Form data after reset:', formData);
    }, 0);
  }

  const getRoleName = (role: string | undefined) => {
    // Verificar si role es undefined o null
    if (role === undefined || role === null) {
      return 'Sin rol';
    }
    
    // Asegurarse de que role sea una cadena y convertirla a minúsculas para comparación
    const normalizedRole = String(role).toLowerCase();
    
    switch (normalizedRole) {
      case "admin":
        return "Administrador"
      case "autorizador":
        return "Autorizador"
      case "seguridad":
        return "Seguridad"
      default:
        // Si el rol está en mayúsculas, intentar normalizarlo
        if (role === "ADMIN") return "Administrador";
        if (role === "AUTORIZADOR") return "Autorizador";
        if (role === "SEGURIDAD") return "Seguridad";
        return role
    }
  }

  const getRoleBadge = (role: string | undefined) => {
    // Verificar si role es undefined o null
    if (role === undefined || role === null) {
      return <Badge variant="outline">Sin rol</Badge>;
    }
    
    // Asegurarse de que role sea una cadena y convertirla a minúsculas para comparación
    const normalizedRole = String(role).toLowerCase();
    
    // Verificar el rol en cualquier formato (mayúsculas o minúsculas)
    if (role === "ADMIN" || normalizedRole === "admin") {
      return <Badge className="bg-red-600">Administrador</Badge>
    } else if (role === "AUTORIZADOR" || normalizedRole === "autorizador") {
      return <Badge className="bg-blue-600">Autorizador</Badge>
    } else if (role === "SEGURIDAD" || normalizedRole === "seguridad") {
      return <Badge className="bg-green-600">Seguridad</Badge>
    } else {
      return <Badge variant="outline">{role}</Badge>
    }
  }

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingIndicator text="Cargando usuarios..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administradores</CardTitle>
              <ShieldIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.adminCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Autorizadores</CardTitle>
              <UserCheckIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.autorizadorCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Seguridad</CardTitle>
              <ShieldIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.seguridadCount}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Add User */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar usuarios por nombre, email o rol..."
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

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo Electrónico</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {user.nombre || user.name || ''} {user.apellido || ''} {user.segundoApellido || ''}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {getRoleBadge(user.rol || user.role)}
                      </TableCell>
                      <TableCell>
                        {user.estado === true ? (
                          <Badge className="bg-green-600">Activo</Badge>
                        ) : (
                          <Badge className="bg-gray-600">Inactivo</Badge>
                        )}
                      </TableCell>
                      <TableCell>{user.fechaCreacion || 'No disponible'}</TableCell>
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
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {searchQuery
                        ? "No se encontraron usuarios que coincidan con la búsqueda"
                        : "No hay usuarios registrados"}
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={handleAddDialogChange}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-black">Agregar Nuevo Usuario</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">Complete el formulario para agregar un nuevo usuario al sistema.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-black font-medium">Nombre</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="border-gray-300 bg-white text-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido" className="text-black font-medium">Primer Apellido</Label>
              <Input 
                id="apellido" 
                name="apellido" 
                value={formData.apellido} 
                onChange={handleChange} 
                className="border-gray-300 bg-white text-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="segundo-apellido" className="text-black font-medium">Segundo Apellido</Label>
              <Input 
                id="segundo-apellido" 
                name="segundoApellido" 
                value={formData.segundoApellido} 
                onChange={handleChange} 
                className="border-gray-300 bg-white text-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black font-medium">Correo Electrónico</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                className="border-gray-300 bg-white text-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-black font-medium">Contraseña</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                value={formData.password} 
                onChange={handleChange} 
                className="border-gray-300 bg-white text-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-black font-medium">Rol</Label>
              <Select 
                value={formData.role || "autorizador"} 
                onValueChange={handleRoleChange}
                defaultValue="autorizador"
                name="role"
                required
              >
                <SelectTrigger id="role" className="border-gray-300 bg-white text-black">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black">
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="autorizador">Autorizador</SelectItem>
                  <SelectItem value="seguridad">Seguridad</SelectItem>
                </SelectContent>
              </Select>
              {/* Campo oculto para asegurar que el rol siempre tenga un valor */}
              <input 
                type="hidden" 
                name="role" 
                id="hidden-role"
                value={formData.role || "autorizador"} 
                onChange={(e) => {
                  // Asegurarse de que el valor nunca sea nulo o vacío
                  if (!e.target.value || e.target.value.trim() === '') {
                    e.target.value = "autorizador";
                    // Actualizar también el estado del formulario
                    setFormData(prev => ({
                      ...prev,
                      role: "autorizador" as UserRole
                    }));
                  } else {
                    // Actualizar el estado del formulario con el valor actual
                    setFormData(prev => ({
                      ...prev,
                      role: e.target.value as UserRole
                    }));
                    console.log('hidden-role onChange updated formData.role to:', e.target.value);
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleAddDialogChange(false)} className="border-gray-300 text-black hover:bg-gray-100">
              Cancelar
            </Button>
            <Button onClick={handleAddUser} className="bg-blue-700 hover:bg-blue-800 text-white" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogChange}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-black">Editar Usuario</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">Modifique los datos del usuario <strong className="text-black">{currentUser?.nombre || currentUser?.name || 'Sin nombre'} {currentUser?.apellido || ''} {currentUser?.segundoApellido || ''}</strong>.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-black font-medium">Nombre</Label>
              <Input 
                id="edit-name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="border-gray-300 bg-white text-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-apellido" className="text-black font-medium">Primer Apellido</Label>
              <Input 
                id="edit-apellido" 
                name="apellido" 
                value={formData.apellido} 
                onChange={handleChange} 
                className="border-gray-300 bg-white text-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-segundo-apellido" className="text-black font-medium">Segundo Apellido</Label>
              <Input 
                id="edit-segundo-apellido" 
                name="segundoApellido" 
                value={formData.segundoApellido} 
                onChange={handleChange} 
                className="border-gray-300 bg-white text-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-black font-medium">Correo Electrónico</Label>
              <Input 
                id="edit-email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                className="border-gray-300 bg-white text-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password" className="text-black font-medium">Contraseña (dejar en blanco para no cambiar)</Label>
              <Input
                id="edit-password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="border-gray-300 bg-white text-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role" className="text-black font-medium">Rol</Label>
              <Select 
                value={formData.role ? formData.role.toLowerCase() : "autorizador"} 
                onValueChange={handleRoleChange}
                defaultValue="autorizador"
                name="role"
              >
                <SelectTrigger id="edit-role" className="border-gray-300 bg-white text-black">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black">
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="autorizador">Autorizador</SelectItem>
                  <SelectItem value="seguridad">Seguridad</SelectItem>
                </SelectContent>
              </Select>
              {/* Campo oculto para asegurar que el rol siempre tenga un valor */}
              <input 
                type="hidden" 
                name="role" 
                id="hidden-edit-role"
                value={formData.role || "autorizador"} 
                onChange={(e) => {
                  if (!e.target.value || e.target.value.trim() === '') {
                    e.target.value = "autorizador";
                    // Actualizar también el estado del formulario
                    setFormData(prev => ({
                      ...prev,
                      role: "autorizador" as UserRole
                    }));
                  } else {
                    // Actualizar el estado del formulario con el valor actual
                    setFormData(prev => ({
                      ...prev,
                      role: e.target.value as UserRole
                    }));
                    console.log('hidden-edit-role onChange updated formData.role to:', e.target.value);
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleEditDialogChange(false)} className="border-gray-300 text-black hover:bg-gray-100">
              Cancelar
            </Button>
            <Button onClick={handleEditUser} className="bg-blue-700 hover:bg-blue-800 text-white" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-black">Eliminar Usuario</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">Esta acción eliminará permanentemente al usuario del sistema.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-black">
              ¿Está seguro que desea eliminar al usuario{" "}
              <strong>
                {currentUser?.name || 'Sin nombre'} {currentUser?.apellido || ''} {currentUser?.segundoApellido || ''}
              </strong>
              ?
            </p>
            <p className="text-sm text-gray-500 mt-2">Esta acción no se puede deshacer.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleDeleteDialogChange(false)} className="border-gray-300 text-black hover:bg-gray-100">
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
              {loading ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
