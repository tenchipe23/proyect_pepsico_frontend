"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "admin" | "autorizador" | "seguridad" | "cliente" | null

interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isAuthorized: (allowedRoles: UserRole[]) => boolean
}

// Usuarios de prueba
const MOCK_USERS = [
  {
    id: "1",
    name: "Administrador",
    email: "admin@pepsico.com",
    password: "admin123",
    role: "admin" as UserRole,
  },
  {
    id: "2",
    name: "Autorizador",
    email: "autorizador@pepsico.com",
    password: "auth123",
    role: "autorizador" as UserRole,
  },
  {
    id: "3",
    name: "Seguridad",
    email: "seguridad@pepsico.com",
    password: "seg123",
    role: "seguridad" as UserRole,
  },
]

// Crear el contexto con un valor por defecto
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
  isAuthorized: () => false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing user from localStorage:", error)
        localStorage.removeItem("user")
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Buscar usuario
    const foundUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (foundUser) {
      // Crear objeto de usuario sin contraseña
      const userToStore = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      }

      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(userToStore))

      // Actualizar estado
      setUser(userToStore)
      return true
    }

    return false
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  const isAuthenticated = !!user

  const isAuthorized = (allowedRoles: UserRole[]) => {
    if (!user) return false
    return allowedRoles.includes(user.role)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        isAuthorized,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
