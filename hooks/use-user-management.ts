"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient, type UserData } from "@/lib/api-client"
import { useToast } from "@/components/ui/use-toast"
import { UserRole, normalizeRole } from "@/context/auth-context"

// Extend the User type from UserData, excluding the token field
interface User extends Omit<UserData, 'token'> {
  // Additional user-specific fields can be added here if needed
}

export interface UserStats {
  totalUsers: number;
  adminCount: number;
  autorizadorCount: number;
  seguridadCount: number;
}

export function useUserManagement() : {
  users: User[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  totalElements: number;
  stats: UserStats | null;
  addUser: (userData: {
    name: string;
    apellido?: string;
    segundoApellido?: string;
    email: string;
    password: string;
    role: UserRole;
  }) => Promise<User>;
  updateUser: (id: string, userData: {
    name: string;
    apellido?: string;
    segundoApellido?: string;
    email: string;
    role: UserRole;
    password?: string;
  }) => Promise<boolean>;
  deleteUser: (id: string) => Promise<void>;
  refreshUsers: (page?: number, size?: number, search?: string) => Promise<void>;
  searchUsers: (query: string, page?: number, size?: number) => Promise<void>;
  getUserStats: () => Promise<void>;
} {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [stats, setStats] = useState<UserStats | null>(null)
  const { toast } = useToast()

  const refreshUsers = useCallback(async (page = 0, size = 10, search?: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.getUsers(page, size, search)

      if (response.success && response.data) {
        const usersData = (response.data.content || []).map((user: any) => {
          console.log('User from API:', user);
          return {
            id: user.id,
            nombre: user.nombre || '',
            apellido: user.apellido || '',
            segundoApellido: user.segundoApellido || '',
            email: user.email,
            rol: user.rol || '',
            estado: user.estado ?? false,
            fechaCreacion: user.fechaCreacion ?? '',
            ultimoAcceso: user.ultimoAcceso ?? '',
            // Campos adicionales para compatibilidad
            name: user.nombre || '',
            role: user.rol || ''
          };
        })
        setUsers(usersData)
        setTotalPages(response.data.totalPages || 0)
        setCurrentPage(response.data.number || 0)
        setTotalElements(response.data.totalElements || 0)
      } else {
        setError(response.error || "Error loading users")
        setUsers([])
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error loading users"
      setError(errorMessage)
      console.error("Error refreshing users:", error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  const getUserStats = useCallback(async () => {
    try {
      const response = await apiClient.getUserStats()
      if (response.success && response.data) {
        // La respuesta del backend ya tiene el formato correcto
        setStats({
          totalUsers: response.data.totalUsers || 0,
          adminCount: response.data.adminCount || 0,
          autorizadorCount: response.data.autorizadorCount || 0,
          seguridadCount: response.data.seguridadCount || 0
        });
      }
    } catch (error) {
      console.error("Error getting user stats:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al cargar las estadísticas de usuarios",
      });
    }
  }, [toast])

  // Load users on mount
  useEffect(() => {
    refreshUsers()
    getUserStats()
  }, [refreshUsers, getUserStats])

  const addUser = useCallback(
    async (userData: {
      name: string
      apellido?: string
      segundoApellido?: string
      email: string
      password: string
      role: UserRole
    }) => {
      try {
        setLoading(true)
        
        console.log('addUser called with userData:', {
          ...userData,
          password: '***', // No mostrar la contraseña en los logs
          role: userData.role,
          roleType: typeof userData.role,
          name: userData.name
        });
        
        // Validar que el nombre no esté vacío
        if (!userData.name || userData.name.trim() === '') {
          console.error('useUserManagement: name is empty or null, this will cause a validation error');
          throw new Error('El nombre no puede estar vacío');
        }
        
        // Validar que el rol no sea null o undefined
        if (!userData.role) {
          console.error('useUserManagement: role is null or undefined, setting default role');
          userData.role = 'autorizador';
        }
        
        // Normalizar el rol para asegurar compatibilidad con el backend
        // Siempre asignar un valor por defecto si no hay rol
        let normalizedRole: UserRole = userData.role ? normalizeRole(userData.role) : 'autorizador';
        
        console.log('Role normalization:', {
          original: userData.role,
          normalized: normalizedRole,
          normalizedType: typeof normalizedRole
        });

        // Asegurarse de que los campos opcionales no sean undefined
        // Validar que el nombre no esté vacío
        if (!userData.name || userData.name.trim() === '') {
          throw new Error("El nombre no debe estar vacío");
        }
        
        // Verificación adicional para asegurar que nunca sea undefined
        if (!normalizedRole) {
          normalizedRole = 'autorizador';
        }
        
        const requestData = {
          name: userData.name.trim(), // Asegurarse de que no tenga espacios en blanco al inicio o final
          apellido: userData.apellido || "",
          segundoApellido: userData.segundoApellido || "",
          email: userData.email,
          password: userData.password,
          role: normalizedRole, // La conversión a mayúsculas se hará en api-client.ts
        };
        
        console.log('Sending to API:', {
          ...requestData,
          password: '***', // No mostrar la contraseña en los logs
          name: requestData.name,
          role: requestData.role
        });
        
        const response = await apiClient.createUser(requestData)

        if (response.success && response.data) {
          const newUser: User = {
            id: response.data.id,
            nombre: response.data.nombre || '',
            apellido: response.data.apellido || '',
            segundoApellido: response.data.segundoApellido || '',
            email: response.data.email,
            rol: response.data.rol || '',
            estado: response.data.estado ?? false,
            fechaCreacion: response.data.fechaCreacion ?? '',
            ultimoAcceso: response.data.ultimoAcceso ?? '',
            // Campos adicionales para compatibilidad
            name: response.data.nombre || '',
            role: response.data.rol || ''
          }
          setUsers((prev) => [newUser, ...prev])

          toast({
            title: "Usuario creado",
            description: `Usuario ${newUser.name} creado exitosamente`,
          })

          // Refresh stats
          getUserStats()

          return newUser
        } else {
          throw new Error(response.error || "Error creating user")
        }
      } catch (error: any) {
        // Manejar errores de validación específicos
        let errorMessage = "Error al crear usuario";
        
        if (error.response && error.response.data) {
          // Si hay errores de validación específicos del backend
          if (error.response.data.validationErrors) {
            const validationErrors = error.response.data.validationErrors;
            const errorFields = Object.keys(validationErrors).map(field => 
              `${field}: ${validationErrors[field]}`
            ).join(', ');
            errorMessage = `Validación fallida: ${errorFields}`;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error.validationErrors) {
          // Si los errores de validación están en el primer nivel
          const errorFields = Object.keys(error.validationErrors).map(field => 
            `${field}: ${error.validationErrors[field]}`
          ).join(', ');
          errorMessage = `Validación fallida: ${errorFields}`;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        })
        throw new Error(errorMessage);
      } finally {
        setLoading(false)
      }
    },
    [toast, getUserStats],
  )

  const updateUser = useCallback(
    async (
      id: string,
      userData: {
        name: string
        apellido?: string
        segundoApellido?: string
        email: string
        role: UserRole
        password?: string
      },
    ) => {
      try {
        setLoading(true)
        
        console.log('updateUser called with userData:', {
          ...userData,
          password: userData.password ? '***' : undefined, // No mostrar la contraseña en los logs
          role: userData.role,
          roleType: typeof userData.role,
          name: userData.name
        });
        
        // Validar que el nombre no esté vacío
        if (!userData.name || userData.name.trim() === '') {
          console.error('useUserManagement: name is empty or null, this will cause a validation error');
          throw new Error('El nombre no puede estar vacío');
        }
        
        // Validar que el rol no sea null o undefined
        if (!userData.role) {
          console.error('useUserManagement: role is null or undefined, setting default role');
          userData.role = 'autorizador';
        }
        
        // Normalizar el rol y registrar el resultado
        const normalizedRole = normalizeRole(userData.role);
        console.log('Role normalization for update:', {
          original: userData.role,
          normalized: normalizedRole,
          normalizedType: typeof normalizedRole
        });

        // Preparar los datos para la API
        const requestData = {
          nombre: userData.name.trim(), // Asegurarse de que no tenga espacios en blanco al inicio o final
          apellido: userData.apellido || "",
          segundoApellido: userData.segundoApellido || "",
          email: userData.email,
          rol: normalizedRole, // La conversión a mayúsculas se hará en api-client.ts
          ...(userData.password ? { password: userData.password } : {}),
        };
        
        console.log('Sending to API for update:', {
          ...requestData,
          password: userData.password ? '***' : undefined, // No mostrar la contraseña en los logs
          nombre: requestData.nombre,
          rol: requestData.rol
        });

        const response = await apiClient.updateUser(id, requestData)

        if (response.success) {
          setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, ...userData } : user)))

          toast({
            title: "Usuario actualizado",
            description: "El usuario ha sido actualizado exitosamente",
          })

          // Refresh stats
          getUserStats()
           
          return true;
        } else {
          throw new Error(response.error || "Error updating user");
        }
      } catch (error: any) {
        // Manejar errores de validación específicos
        let errorMessage = "Error al actualizar usuario";
        
        if (error.response && error.response.data) {
          // Si hay errores de validación específicos del backend
          if (error.response.data.validationErrors) {
            const validationErrors = error.response.data.validationErrors;
            const errorFields = Object.keys(validationErrors).map(field => 
              `${field}: ${validationErrors[field]}`
            ).join(', ');
            errorMessage = `Validación fallida: ${errorFields}`;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error.validationErrors) {
          // Si los errores de validación están en el primer nivel
          const errorFields = Object.keys(error.validationErrors).map(field => 
            `${field}: ${error.validationErrors[field]}`
          ).join(', ');
          errorMessage = `Validación fallida: ${errorFields}`;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        })
        throw new Error(errorMessage);
      } finally {
        setLoading(false)
      }
    },
    [toast, getUserStats],
  )

  const deleteUser = useCallback(
    async (id: string) => {
      try {
        setLoading(true)

        const response = await apiClient.deleteUser(id)

        if (response.success) {
          setUsers((prev) => prev.filter((user) => user.id !== id))

          toast({
            title: "Usuario eliminado",
            description: "El usuario ha sido eliminado exitosamente",
          })

          // Refresh stats
          getUserStats()
        } else {
          throw new Error(response.error || "Error deleting user")
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error deleting user"
        setError(errorMessage)
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        })
        throw error
      } finally {
        setLoading(false)
      }
    },
    [toast, getUserStats],
  )

  const searchUsers = useCallback(
    async (query: string, page = 0, size = 10) => {
      await refreshUsers(page, size, query)
    },
    [refreshUsers],
  )

  // Cargar estadísticas de usuarios al inicializar el componente
  useEffect(() => {
    getUserStats()
  }, [getUserStats])

  return {
    users,
    loading,
    error,
    totalPages,
    currentPage,
    totalElements,
    stats,
    addUser,
    updateUser,
    deleteUser,
    refreshUsers,
    searchUsers,
    getUserStats,
  }
}