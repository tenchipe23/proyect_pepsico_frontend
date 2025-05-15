"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface PaseData {
  id?: string
  estado: "pendiente" | "firmado" | "autorizado" | "rechazado"
  folio: string
  razonSocial: string
  fecha: string
  tractorEco: string
  tractorPlaca: string
  remolque1Eco: string
  remolque1Placa: string
  remolque2Eco: string
  remolque2Placa: string
  operadorNombre: string
  operadorApellidoPaterno: string
  operadorApellidoMaterno: string
  ecoDolly: string
  placasDolly: string
  comentarios: string
  firma: string
  sello: string
  fechaCreacion: string
  fechaFirma?: string
  fechaAutorizacion?: string
}

interface PaseContextType {
  pases: PaseData[]
  currentPase: PaseData | null
  setCurrentPase: (pase: PaseData | null) => void
  addPase: (pase: PaseData) => PaseData
  updatePase: (id: string, pase: Partial<PaseData>) => void
  deletePase: (id: string) => void
  getPaseById: (id: string) => PaseData | undefined
  searchPases: (query: string, field: keyof PaseData) => PaseData[]
}

const defaultPase: PaseData = {
  estado: "pendiente",
  folio: "",
  razonSocial: "",
  fecha: "",
  tractorEco: "",
  tractorPlaca: "",
  remolque1Eco: "",
  remolque1Placa: "",
  remolque2Eco: "",
  remolque2Placa: "",
  operadorNombre: "",
  operadorApellidoPaterno: "",
  operadorApellidoMaterno: "",
  ecoDolly: "",
  placasDolly: "",
  comentarios: "",
  firma: "",
  sello: "",
  fechaCreacion: new Date().toISOString(),
}

const PaseContext = createContext<PaseContextType | undefined>(undefined)

export function PaseProvider({ children }: { children: ReactNode }) {
  const [pases, setPases] = useState<PaseData[]>([])
  const [currentPase, setCurrentPase] = useState<PaseData | null>(null)

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const storedPases = localStorage.getItem("pases")
    if (storedPases) {
      setPases(JSON.parse(storedPases))
    }

    const storedCurrentPase = localStorage.getItem("currentPase")
    if (storedCurrentPase) {
      setCurrentPase(JSON.parse(storedCurrentPase))
    }
  }, [])

  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("pases", JSON.stringify(pases))
  }, [pases])

  useEffect(() => {
    if (currentPase) {
      localStorage.setItem("currentPase", JSON.stringify(currentPase))
    } else {
      localStorage.removeItem("currentPase")
    }
  }, [currentPase])

  const addPase = (pase: PaseData) => {
    const newPase = {
      ...pase,
      id: crypto.randomUUID(),
      fechaCreacion: new Date().toISOString(),
    }
    setPases((prev) => [...prev, newPase])
    return newPase
  }

  const updatePase = (id: string, updatedData: Partial<PaseData>) => {
    setPases((prev) => prev.map((pase) => (pase.id === id ? { ...pase, ...updatedData } : pase)))

    // Si estamos actualizando el pase actual, también actualizamos currentPase
    if (currentPase?.id === id) {
      setCurrentPase((prev) => (prev ? { ...prev, ...updatedData } : null))
    }
  }

  const deletePase = (id: string) => {
    setPases((prev) => prev.filter((pase) => pase.id !== id))

    // Si estamos eliminando el pase actual, limpiamos currentPase
    if (currentPase?.id === id) {
      setCurrentPase(null)
    }
  }

  const getPaseById = (id: string) => {
    return pases.find((pase) => pase.id === id)
  }

  const searchPases = (query: string, field: keyof PaseData) => {
    if (!query) return pases

    return pases.filter((pase) => {
      const value = pase[field]
      if (typeof value === "string") {
        return value.toLowerCase().includes(query.toLowerCase())
      }
      return false
    })
  }

  return (
    <PaseContext.Provider
      value={{
        pases,
        currentPase,
        setCurrentPase,
        addPase,
        updatePase,
        deletePase,
        getPaseById,
        searchPases,
      }}
    >
      {children}
    </PaseContext.Provider>
  )
}

export function usePase() {
  const context = useContext(PaseContext)
  if (context === undefined) {
    throw new Error("usePase must be used within a PaseProvider")
  }
  return context
}
