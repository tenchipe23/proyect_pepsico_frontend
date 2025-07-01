"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext, useCallback } from "react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/components/ui/use-toast"

export type UserRole = "admin" | "autorizador" | "seguridad"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

interface AuthContextProps {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
  hasRole: (roles: UserRole[]) => boolean
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
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Initialize user from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")

        if (token && storedUser) {
          try {
            const userData = JSON.parse(storedUser)
            // Validate stored user data
            if (userData && userData.id && userData.email) {
              setUser(userData)
              // Verify token is still valid
              return;
            }
          } catch (e) {
            console.error("Error parsing stored user data:", e)
          }
        }
        // Clear invalid data
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      } catch (error) {
        console.error("Error initializing auth:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      } finally {
        // Always set loading to false, even if there was an error
        setLoading(false)
      }
    }

    // Add a small delay to prevent race conditions with auth state
    const timer = setTimeout(() => {
      initializeAuth()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      // Clear any previous errors
      setError(null);
      
      try {
        setLoading(true)
        // Clear any existing auth data to prevent race conditions
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        
        const response = await apiClient.login(email, password)
        console.log('Login response:', response); // Debug log

        if (response.success && response.data) {
          // Handle different response formats
          const responseData = response.data;
          
          // Type assertion to handle the response data
          const loginData = responseData as {
            id: string;
            userId?: string;
            nombre?: string;
            name?: string;
            apellido?: string;
            lastName?: string;
            email: string;
            rol: string;
            role?: string;
            token: string;
            accessToken?: string;
          };
          
          // Extract user data with fallbacks
          const userData: User = {
            id: loginData.id || loginData.userId || '',
            name: [
              loginData.nombre || loginData.name || '',
              loginData.apellido || loginData.lastName || ''
            ].filter(Boolean).join(' ') || email,
            email: loginData.email || email,
            role: (loginData.rol || loginData.role || '').toLowerCase() as UserRole,
          }

          // Validate required fields
          if (!userData.role) {
            console.error('Invalid or missing role in login response:', responseData);
            throw new Error('No se pudo determinar el rol del usuario. Por favor contacte al administrador.');
          }

          // Normalize role to lowercase for consistent comparison
          userData.role = userData.role.toLowerCase() as UserRole;

          // Validate role is one of the allowed values
          const validRoles: UserRole[] = ['admin', 'autorizador', 'seguridad'];
          if (!validRoles.includes(userData.role)) {
            console.error('Invalid role value:', userData.role);
            throw new Error('Rol de usuario no válido');
          }

          // Save token if provided in the response
          const token = loginData.token || loginData.accessToken;
          if (!token) {
            console.error('No token provided in login response');
            throw new Error('Error de autenticación: token no recibido');
          }

          setUser(userData);
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(userData));

          toast({
            title: "Inicio de sesión exitoso",
            description: `Bienvenido, ${userData.name}`,
          });

          return { success: true };
        } else {
          // Handle API error response
          const errorMessage = response.error || 
                             response.message || 
                             'Error desconocido al iniciar sesión';
          
          console.error('Login failed:', errorMessage);
          
          return {
            success: false,
            error: errorMessage,
          };
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

  const logout = useCallback(async (silent: boolean = false) => {
    try {
      // Clear user state first to prevent race conditions
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Only call the API if not a silent logout (like on 401)
      if (!silent) {
        try {
          await apiClient.logout();
        } catch (error) {
          console.error("Logout API error:", error);
          // Continue with local logout even if API fails
        }
      }

      if (!silent) {
        toast({
          title: "Sesión cerrada",
          description: "Has cerrado sesión correctamente",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      if (!silent) {
        toast({
          title: "Error",
          description: "Ocurrió un error al cerrar la sesión",
          variant: "destructive",
        });
      }
    }
  }, [toast])

  const refreshUser = useCallback(async () => {
    if (user) {
      try {
        const response = await apiClient.getUserById(user.id)
        if (response.success && response.data) {
          const updatedUser: User = {
            id: response.data.id,
            name: `${response.data.nombre} ${response.data.apellido}`,
            email: response.data.email,
            role: response.data.rol.toLowerCase() as UserRole,
          }
          setUser(updatedUser)
          localStorage.setItem("user", JSON.stringify(updatedUser))
        }
      } catch (error) {
        console.error("Error refreshing user:", error)
      }
    }
  }, [user])

  const hasRole = useCallback(
    (roles: UserRole[]) => {
      if (!user) return false
      // Convert both the user's role and the required roles to lowercase for case-insensitive comparison
      const userRole = user.role.toLowerCase()
      return roles.some(role => role.toLowerCase() === userRole)
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
