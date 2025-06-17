"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import { apiClient } from "@/lib/api"

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
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: async () => ({ success: false }),
  logout: () => {},
  loading: false,
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing user from localStorage:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await apiClient.login(email, password)

      const userData = {
        id: response.id,
        name: response.nombre + " " + response.apellido,
        email: response.email,
        role: response.rol.toLowerCase(),
      }

      setUser(userData)
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(userData))

      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Credenciales inválidas" }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  const value: AuthContextProps = {
    user,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
