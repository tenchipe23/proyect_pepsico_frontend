"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/components/ui/use-toast"

export interface PaseData {
  id?: string
  folio: string
  estado: "PENDIENTE" | "FIRMADO" | "AUTORIZADO" | "RECHAZADO"
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
  operador?: any
}

interface PaseContextType {
  pases: PaseData[]
  loading: boolean
  error: string | null
  totalPages: number
  currentPage: number
  totalElements: number
  addPase: (pase: Omit<PaseData, "id" | "fechaCreacion">) => Promise<PaseData>
  updatePase: (id: string, updates: Partial<PaseData>) => Promise<void>
  deletePase: (id: string) => Promise<void>
  getPaseById: (id: string) => PaseData | undefined
  refreshPases: (page?: number, size?: number, status?: string, search?: string) => Promise<void>
  signPase: (id: string, signatureData: { signature: string; seal: string }) => Promise<void>
  authorizePase: (id: string) => Promise<void>
  rejectPase: (id: string, reason?: string) => Promise<void>
  searchPases: (query: string, page?: number, size?: number) => Promise<void>
  getStatistics: () => Promise<any>
}

const PaseContext = createContext<PaseContextType | undefined>(undefined)

export const PaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pases, setPases] = useState<PaseData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const { toast } = useToast()

  const refreshPases = useCallback(async (page = 0, size = 10, status?: string, search?: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.getPasses(page, size, status, search)

      if (response.success && response.data) {
        setPases(response.data.content || [])
        setTotalPages(response.data.totalPages || 0)
        setCurrentPage(response.data.number || 0)
        setTotalElements(response.data.totalElements || 0)
      } else {
        setError(response.error || "Error loading passes")
        setPases([])
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error loading passes"
      setError(errorMessage)
      console.error("Error refreshing passes:", error)
      setPases([])
    } finally {
      setLoading(false)
    }
  }, [])

  const searchPases = useCallback(async (query: string, page = 0, size = 10) => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.globalSearch(query, page, size)

      if (response.success && response.data) {
        setPases(response.data.content || [])
        setTotalPages(response.data.totalPages || 0)
        setCurrentPage(response.data.number || 0)
        setTotalElements(response.data.totalElements || 0)
      } else {
        setError(response.error || "Error searching passes")
        setPases([])
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error searching passes"
      setError(errorMessage)
      console.error("Error searching passes:", error)
      setPases([])
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
        
        // Generate a UUID for the new pass
        const passId = crypto.randomUUID()
        const now = new Date().toISOString()
        
        // Create the pass object with all required fields
        const newPass = {
          ...paseData,
          id: passId,
          estado: "PENDIENTE",
          fechaCreacion: now,
          fechaFirma: now, // Initialize with current time
          fechaAutorizacion: now, // Initialize with current time
          // Asegurarse de que los campos del operador se envíen correctamente
          operadorNombre: paseData.operadorNombre || '',
          operadorApellidoPaterno: paseData.operadorApellidoPaterno || '',
          operadorApellidoMaterno: paseData.operadorApellidoMaterno || ''
        };
        
        console.log("Enviando datos al backend:", newPass);
        const response = await apiClient.createPass(newPass)

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

        const response = await apiClient.deletePass(id)

        if (response.success) {
          setPases((prev) => prev.filter((pase) => pase.id !== id))

          toast({
            title: "Pase eliminado",
            description: "El pase ha sido eliminado exitosamente",
          })
        } else {
          throw new Error(response.error || "Error deleting pass")
        }
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

  const getPaseById = useCallback((id: string): PaseData | undefined => {
    return pases.find((pase) => pase.id === id)
  }, [pases])

  const signPase = useCallback(
    async (id: string, signatureData: { signature: string; seal: string }) => {
      try {
        setLoading(true)

        const response = await apiClient.signPass(id, signatureData)

        if (response.success) {
          setPases((prev) =>
            prev.map((pase) =>
              pase.id === id
                ? {
                    ...pase,
                    firma: signatureData.signature,
                    sello: signatureData.seal,
                    estado: "FIRMADO" as const,
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
                    estado: "AUTORIZADO" as const,
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
                    estado: "RECHAZADO" as const,
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

  const getStatistics = useCallback(async () => {
    try {
      setLoading(true)
      console.log("Fetching statistics from API...")
      
      // Hacer la petición al endpoint corregido
      const response = await apiClient.getPassStatistics()
      
      console.log("Statistics API response:", response)
      
      // Si la respuesta es exitosa y tiene datos, devolverlos
      if (response.success && response.data) {
        const stats = {
          totalPasses: response.data.totalPasses || 0,
          pendingPasses: response.data.pendingPasses || 0,
          signedPasses: response.data.signedPasses || 0,
          authorizedPasses: response.data.authorizedPasses || 0,
          rejectedPasses: response.data.rejectedPasses || 0,
          todayPasses: response.data.todayPasses || 0
        }
        console.log("Parsed statistics:", stats)
        return stats
      } 
      
      // Si hay un error en la respuesta, lanzar el error
      const errorMessage = response.error || "Error al cargar las estadísticas"
      console.error("Error in statistics response:", response)
      throw new Error(errorMessage)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al cargar estadísticas"
      console.error("Error getting statistics:", error)
      
      // Mostrar notificación de error solo si no es un error de autenticación
      if (!errorMessage.includes('Unauthorized') && !errorMessage.includes('No authentication token')) {
        toast({
          variant: "destructive",
          title: "Error",
          description: `No se pudieron cargar las estadísticas: ${errorMessage}`,
        })
      }
      
      // Devolver valores por defecto
      const defaultStats = {
        totalPasses: 0,
        pendingPasses: 0,
        signedPasses: 0,
        authorizedPasses: 0,
        rejectedPasses: 0,
        todayPasses: 0
      }
      
      console.log("Returning default statistics due to error")
      return defaultStats
    } finally {
      setLoading(false)
    }
  }, [toast])

  const value: PaseContextType = {
    pases,
    loading,
    error,
    totalPages,
    currentPage,
    totalElements,
    addPase,
    updatePase,
    deletePase,
    getPaseById,
    refreshPases,
    signPase,
    authorizePase,
    rejectPase,
    searchPases,
    getStatistics,
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
