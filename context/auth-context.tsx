"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext, useCallback } from "react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/components/ui/use-toast"

export let UserRole: string | null = null

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface AuthContextProps {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
  hasRole: (roles: string[]) => boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: async () => ({ success: false, error: "Error de inicio de sesión", user: undefined}),
  logout: () => {},
  loading: false,
  isAuthenticated: false,
  hasRole: () => false,
  refreshUser: async () => {},
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { toast } = useToast()

  // Initialize auth state from localStorage
  const initializeAuth = useCallback(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true)
        const response = await apiClient.login(email, password)
        console.log("Login response:", response)

        if (response.success && response.data) {
          console.log("User data:", response.data)
          // Asegurarse de que el rol esté en minúsculas y sin espacios
          const userRole = response.data.role?.toLowerCase().trim()
          UserRole = userRole
          console.log("User role:", userRole)

          if (!userRole) {
            console.error("No role found in response:", response)
            throw new Error("No se pudo determinar el rol del usuario")
          }
          
          
          const userData: User = {
            id: response.data.id,
            name: `${response.data.nombre} ${response.data.apellido}`,
            email: response.data.email,
            role: userRole
          }
          console.log("User data:", userData)

          // Actualizar el estado de autenticación
          setUser(userData)
          setIsAuthenticated(true)
          
          // Guardar en localStorage
          localStorage.setItem("token", response.data.token)
          localStorage.setItem("user", JSON.stringify(userData))

          toast({
            title: "Inicio de sesión exitoso",
            description: `Bienvenido, ${userData.name}`,
          })

          return { 
            success: true,
            user: userData,
            userRole: userRole
          }
        } else {
          // Limpiar datos de autenticación en caso de error
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          setUser(null)
          setIsAuthenticated(false)
          
          return {
            success: false,
            error: response.error || "Credenciales inválidas",
          }
        }
      } catch (error) {
        console.error("Login error:", error)
        // Limpiar datos de autenticación en caso de error
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
        setIsAuthenticated(false)
        
        return {
          success: false,
          error: error instanceof Error ? error.message : "Error de conexión. Intente nuevamente.",
        }
      } finally {
        setLoading(false)     
      }
    },
    [toast]
  )

  const logout = useCallback(async () => {
    try {
      await apiClient.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem("token")
      localStorage.removeItem("user")

      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      })
    }
  }, [toast])

  const refreshUser = useCallback(async () => {
    // Implementation for refreshing user data if needed
    // This could fetch updated user info from the backend
  }, [])

  const hasRole = useCallback(
    (roles: string[]) => {
      if (!user) return false
      return roles.includes(user.role || '')
    },
    [user],
  )

  const value: AuthContextProps = {
    user,
    login,
    logout,
    loading,
    isAuthenticated,
    hasRole,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
