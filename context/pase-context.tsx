"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/components/ui/use-toast"

export interface PaseData {
  id?: string
  folio: string
  estado: "pendiente" | "firmado" | "autorizado" | "rechazado"
  razonSocial: string
  fecha: string
  tractorEco: string
  tractorPlaca: string
  remolque1Eco?: string
  remolque1Placa?: string
  remolque2Eco?: string
  remolque2Placa?: string
  operadorNombre: string
  operadorApellidoPaterno: string
  operadorApellidoMaterno?: string
  ecoDolly?: string
  placasDolly?: string
  comentarios?: string
  firma?: string
  sello?: string
  fechaCreacion: string
  fechaFirma?: string
  fechaAutorizacion?: string
}

interface PaseContextType {
  pases: PaseData[]
  loading: boolean
  error: string | null
  addPase: (pase: Omit<PaseData, "id" | "fechaCreacion">) => Promise<PaseData>
  updatePase: (id: string, updates: Partial<PaseData>) => Promise<void>
  deletePase: (id: string) => Promise<void>
  getPaseById: (id: string) => Promise<PaseData | null>
  refreshPases: () => Promise<void>
  signPase: (id: string, signatureData: { firma: string; sello: string }) => Promise<void>
  authorizePase: (id: string) => Promise<void>
  rejectPase: (id: string, reason?: string) => Promise<void>
  searchPases: (searchTerm: string, field: string) => Promise<PaseData[]>
}

const PaseContext = createContext<PaseContextType | undefined>(undefined)

export const PaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pases, setPases] = useState<PaseData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const refreshPases = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.getPasses(0, 100) // Get all passes

      if (response.success && response.data) {
        setPases(response.data.content || [])
      } else {
        setError(response.error || "Error loading passes")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error loading passes"
      setError(errorMessage)
      console.error("Error refreshing passes:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load passes on mount
  useEffect(() => {
    refreshPases()
  }, [refreshPases])

  const addPase = useCallback(
    async (paseData: Omit<PaseData, "id" | "fechaCreacion">): Promise<PaseData> => {
      try {
        setLoading(true)

        const response = await apiClient.createPass({
          ...paseData,
          fechaCreacion: new Date().toISOString(),
        })

        if (response.success && response.data) {
          const newPase = response.data as PaseData
          setPases((prev) => [newPase, ...prev])

          toast({
            title: "Pase creado",
            description: `Pase ${newPase.folio} creado exitosamente`,
          })

          return newPase
        } else {
          throw new Error(response.error || "Error creating pass")
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error creating pass"
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
    [toast],
  )

  const updatePase = useCallback(
    async (id: string, updates: Partial<PaseData>) => {
      try {
        setLoading(true)

        const response = await apiClient.updatePass(id, updates)

        if (response.success) {
          setPases((prev) => prev.map((pase) => (pase.id === id ? { ...pase, ...updates } : pase)))

          toast({
            title: "Pase actualizado",
            description: "El pase ha sido actualizado exitosamente",
          })
        } else {
          throw new Error(response.error || "Error updating pass")
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error updating pass"
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
    [toast],
  )

  const deletePase = useCallback(
    async (id: string) => {
      try {
        setLoading(true)

        // Note: Implement soft delete in backend if needed
        setPases((prev) => prev.filter((pase) => pase.id !== id))

        toast({
          title: "Pase eliminado",
          description: "El pase ha sido eliminado exitosamente",
        })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error deleting pass"
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
    [toast],
  )

  const getPaseById = useCallback(async (id: string): Promise<PaseData | null> => {
    try {
      const response = await apiClient.getPassById(id)

      if (response.success && response.data) {
        return response.data as PaseData
      } else {
        return null
      }
    } catch (error) {
      console.error("Error getting pass by ID:", error)
      return null
    }
  }, [])

  const signPase = useCallback(
    async (id: string, signatureData: { firma: string; sello: string }) => {
      try {
        setLoading(true)

        const response = await apiClient.signPass(id, signatureData)

        if (response.success) {
          setPases((prev) =>
            prev.map((pase) =>
              pase.id === id
                ? {
                    ...pase,
                    ...signatureData,
                    estado: "firmado" as const,
                    fechaFirma: new Date().toISOString(),
                  }
                : pase,
            ),
          )

          toast({
            title: "Pase firmado",
            description: "El pase ha sido firmado exitosamente",
          })
        } else {
          throw new Error(response.error || "Error signing pass")
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error signing pass"
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
    [toast],
  )

  const authorizePase = useCallback(
    async (id: string) => {
      try {
        setLoading(true)

        const response = await apiClient.authorizePass(id)

        if (response.success) {
          setPases((prev) =>
            prev.map((pase) =>
              pase.id === id
                ? {
                    ...pase,
                    estado: "autorizado" as const,
                    fechaAutorizacion: new Date().toISOString(),
                  }
                : pase,
            ),
          )

          toast({
            title: "Pase autorizado",
            description: "El pase ha sido autorizado exitosamente",
          })
        } else {
          throw new Error(response.error || "Error authorizing pass")
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error authorizing pass"
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
    [toast],
  )

  const rejectPase = useCallback(
    async (id: string, reason?: string) => {
      try {
        setLoading(true)

        const response = await apiClient.rejectPass(id, reason)

        if (response.success) {
          setPases((prev) =>
            prev.map((pase) =>
              pase.id === id
                ? {
                    ...pase,
                    estado: "rechazado" as const,
                  }
                : pase,
            ),
          )

          toast({
            title: "Pase rechazado",
            description: "El pase ha sido rechazado",
            variant: "destructive",
          })
        } else {
          throw new Error(response.error || "Error rejecting pass")
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error rejecting pass"
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
    [toast],
  )

  const searchPases = useCallback(async (searchTerm: string, field: string): Promise<PaseData[]> => {
    try {
      const response = await apiClient.searchPasses(searchTerm, field)

      if (response.success && response.data) {
        return response.data.content || []
      } else {
        return []
      }
    } catch (error) {
      console.error("Error searching passes:", error)
      return []
    }
  }, [])

  const value: PaseContextType = {
    pases,
    loading,
    error,
    addPase,
    updatePase,
    deletePase,
    getPaseById,
    refreshPases,
    signPase,
    authorizePase,
    rejectPase,
    searchPases,
  }

  return <PaseContext.Provider value={value}>{children}</PaseContext.Provider>
}

export const usePase = () => {
  const context = useContext(PaseContext)
  if (context === undefined) {
    throw new Error("usePase must be used within a PaseProvider")
  }
  return context
}
