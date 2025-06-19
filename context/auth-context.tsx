"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext, useCallback } from "react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/components/ui/use-toast"

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface AuthContextProps {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
  hasRole: (roles: string[]) => boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: async () => ({ success: false }),
  logout: () => {},
  loading: false,
  isAuthenticated: false,
  hasRole: () => false,
  refreshUser: async () => {},
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Initialize user from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")

        if (token && storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true)
        const response = await apiClient.login(email, password)

        if (response.success && response.data) {
          const userData: User = {
            id: response.data.id,
            name: `${response.data.nombre} ${response.data.apellido}`,
            email: response.data.email,
            role: response.data.rol.toLowerCase(),
          }

          setUser(userData)
          localStorage.setItem("token", response.data.token)
          localStorage.setItem("user", JSON.stringify(userData))

          toast({
            title: "Inicio de sesión exitoso",
            description: `Bienvenido, ${userData.name}`,
          })

          return { success: true }
        } else {
          return {
            success: false,
            error: response.error || "Credenciales inválidas",
          }
        }
      } catch (error) {
        console.error("Login error:", error)
        return {
          success: false,
          error: "Error de conexión. Intente nuevamente.",
        }
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const logout = useCallback(async () => {
    try {
      await apiClient.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
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
      return roles.includes(user.role)
    },
    [user],
  )

  const value: AuthContextProps = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
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
