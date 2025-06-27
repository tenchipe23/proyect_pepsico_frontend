"use client"

import { useState, useEffect } from "react"
import type { UserRole } from "@/context/auth-context"

interface User {
  id: string
  name: string
  email: string
  password: string
  role: typeof UserRole
}

// Usuarios de prueba iniciales
const INITIAL_USERS = [
  {
    id: "1",
    name: "Administrador",
    email: "admin@pepsico.com",
    password: "admin123",
    role: "admin" as typeof UserRole,
  },
  {
    id: "2",
    name: "Autorizador",
    email: "autorizador@pepsico.com",
    password: "auth123",
    role: "autorizador" as typeof UserRole,
  },
  {
    id: "3",
    name: "Seguridad",
    email: "seguridad@pepsico.com",
    password: "seg123",
    role: "seguridad" as typeof UserRole,
  },
]

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([])

  // Cargar usuarios del localStorage al iniciar
  useEffect(() => {
    const storedUsers = localStorage.getItem("users")
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    } else {
      // Si no hay usuarios en localStorage, usar los iniciales
      setUsers(INITIAL_USERS)
      localStorage.setItem("users", JSON.stringify(INITIAL_USERS))
    }
  }, [])

  // Guardar usuarios en localStorage cuando cambien
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("users", JSON.stringify(users))
    }
  }, [users])

  const addUser = (user: User) => {
    setUsers((prev) => [...prev, user])
  }

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === id) {
          return { ...user, ...userData }
        }
        return user
      }),
    )
  }

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id))
  }

  return {
    users,
    addUser,
    updateUser,
    deleteUser,
  }
}
