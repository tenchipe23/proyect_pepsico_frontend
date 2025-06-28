"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/components/ui/use-toast"
import type { UserRole } from "@/context/auth-context"

interface User {
  id: string
  nombre: string
  apellido: string
  email: string
  rol: UserRole
  estado: boolean
  fechaCreacion: string
  ultimoAcceso?: string
}

interface UserStats {
  totalUsers: number
  adminCount: number
  autorizadorCount: number
  seguridadCount: number
}

export function useUserManagement() {
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
        setUsers(response.data.content || [])
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
        setStats(response.data)
      }
    } catch (error) {
      console.error("Error getting user stats:", error)
    }
  }, [])

  // Load users on mount
  useEffect(() => {
    refreshUsers()
    getUserStats()
  }, [refreshUsers, getUserStats])

  const addUser = useCallback(
    async (userData: {
      name: string
      apellido?: string
      email: string
      password: string
      role: UserRole
    }) => {
      try {
        setLoading(true)

        const response = await apiClient.createUser(userData)

        if (response.success && response.data) {
          const newUser = response.data as User
          setUsers((prev) => [newUser, ...prev])

          toast({
            title: "Usuario creado",
            description: `Usuario ${newUser.nombre} creado exitosamente`,
          })

          // Refresh stats
          getUserStats()

          return newUser
        } else {
          throw new Error(response.error || "Error creating user")
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error creating user"
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

  const updateUser = useCallback(
    async (
      id: string,
      userData: {
        nombre: string
        apellido?: string
        email: string
        rol: UserRole
        password?: string
      },
    ) => {
      try {
        setLoading(true)

        const response = await apiClient.updateUser(id, userData)

        if (response.success) {
          setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, ...userData } : user)))

          toast({
            title: "Usuario actualizado",
            description: "El usuario ha sido actualizado exitosamente",
          })

          // Refresh stats
          getUserStats()
        } else {
          throw new Error(response.error || "Error updating user")
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error updating user"
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
