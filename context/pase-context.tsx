"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/components/ui/use-toast"

// Define the API response type for pases
interface PaseApiResponse {
  content: PaseData[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

// Define the shape of the context value
interface PaseContextValue {
  pases: PaseData[]
  loading: boolean
  error: string | null
  totalPages: number
  currentPage: number
  totalElements: number
  addPase: (pase: Omit<PaseData, 'id' | 'fechaCreacion'>) => Promise<PaseData>
  updatePase: (id: string, updates: Partial<PaseData>) => Promise<void>
  deletePase: (id: string) => Promise<void>
  getPaseById: (id: string) => Promise<PaseData | undefined>
  refreshPases: (page?: number, size?: number, status?: string, search?: string) => Promise<void>
  signPase: (id: string, signatureData: { signature: string; seal: string }) => Promise<void>
  authorizePase: (id: string) => Promise<void>
  rejectPase: (id: string, reason?: string) => Promise<void>
  searchPases: (query: string, page?: number, size?: number, status?: string) => Promise<void>
  getStatistics: () => Promise<any>
}

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
  getPaseById: (id: string) => Promise<PaseData | undefined>
  refreshPases: (page?: number, size?: number, status?: string, search?: string) => Promise<void>
  signPase: (id: string, signatureData: { signature: string; seal: string }) => Promise<void>
  authorizePase: (id: string) => Promise<void>
  rejectPase: (id: string, reason?: string) => Promise<void>
  searchPases: (query: string, page?: number, size?: number) => Promise<void>
  getStatistics: () => Promise<any>
}

const PaseContext = createContext<PaseContextValue | undefined>(undefined)

interface PaseProviderProps {
  children: ReactNode
}

export const PaseProvider: React.FC<PaseProviderProps> = ({ children }) => {
  const [pases, setPases] = useState<PaseData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);

  // Helper function to handle API responses with proper typing
  const handleApiResponse = <T,>(
    response: { success: boolean; data?: T; error?: string },
    successCallback?: (data: T) => void
  ): boolean => {
    if (response.success && response.data) {
      if (successCallback) {
        successCallback(response.data);
      }
      return true;
    } else {
      setError(response.error || 'Error en la operación');
      return false;
    }
  };

  const { toast } = useToast()

  const refreshPases = useCallback(async (page = 0, size = 10, status?: string, search?: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.getPasses(page, size, status, search)

      if (handleApiResponse(response, (data) => {
        setPases(data.content || []);
        setTotalPages(data.totalPages || 0);
        setCurrentPage(data.number || 0);
        setTotalElements(data.totalElements || 0);
      })) {
        setLoading(false);
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

  const searchPases = useCallback(async (query: string, page = 0, size = 10, status?: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // Use getPasses method instead of globalSearch
      const response = await apiClient.getPasses(page, size, status, query)

      if (handleApiResponse(response, (data) => {
        setPases(data.content || []);
        setTotalPages(data.totalPages || 0);
        setCurrentPage(data.number || 0);
        setTotalElements(data.totalElements || 0);
      })) {
        setLoading(false);
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

  const addPase = useCallback(async (pase: Omit<PaseData, "id" | "fechaCreacion">): Promise<PaseData> => {
    try {
      setLoading(true)
      setError(null)

      // Asegurarse de que los campos requeridos estén presentes
      const newPass = {
        ...pase,
        fecha: pase.fecha || new Date().toISOString().split('T')[0], // Solo la parte de la fecha YYYY-MM-DD
        estado: 'PENDIENTE' as const,
        // No incluir fechaCreacion, dejar que el backend la maneje
      };

      console.log("Enviando datos al backend:", newPass);
      
      // Create a new pase using the public API
      const response = await apiClient.createPass(newPass);
      if (response.success && response.data) {
        const newPase = response.data as PaseData;
        setPases(prev => [newPase, ...prev]);
        toast({
          title: 'Pase creado',
          description: 'El pase se ha creado correctamente',
        });
        setLoading(false);
        return newPase;
      } else {
        throw new Error(response.error || 'Error al crear el pase');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear el pase'
      setError(errorMessage)
      console.error('Error creating pass:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const deletePase = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);

      // Delete a pase using the public API
      const response = await apiClient.deletePass(id);
      if (response.success) {
        setPases(prev => prev.filter(pase => pase.id !== id));
        toast({
          title: 'Pase eliminado',
          description: 'El pase se ha eliminado correctamente',
        });
      } else {
        throw new Error(response.error || 'Error al eliminar el pase');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el pase'
      setError(errorMessage)
      console.error('Error deleting pass:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePase = useCallback(async (id: string, updates: Partial<PaseData>): Promise<void> => {
    try {
      setLoading(true);

      // Update a pase using the public API
      const response = await apiClient.updatePass(id, updates);
      if (response.success && response.data) {
        const updatedPase = response.data as PaseData;
        setPases(prev =>
          prev.map(pase => (pase.id === id ? updatedPase : pase))
        );
        toast({
          title: 'Pase actualizado',
          description: 'El pase se ha actualizado correctamente',
        });
      } else {
        throw new Error(response.error || 'Error al actualizar el pase');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el pase'
      setError(errorMessage)
      console.error('Error updating pass:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const getPaseById = useCallback(async (id: string): Promise<PaseData | undefined> => {
    // Primero buscar en el array local
    const localPase = pases.find((pase) => pase.id === id);
    if (localPase) {
      return localPase;
    }
    
    // Si no se encuentra en el array local, hacer una llamada al backend
    try {
      setLoading(true);
      const response = await apiClient.getPassById(id);
      if (response.success && response.data) {
        // Agregar el pase al array local para futuras referencias
        const fetchedPase = response.data as PaseData;
        setPases(prev => {
          // Verificar si el pase ya existe en el array (por si acaso)
          const exists = prev.some(p => p.id === id);
          if (exists) {
            return prev.map(p => p.id === id ? fetchedPase : p);
          } else {
            return [...prev, fetchedPase];
          }
        });
        return fetchedPase;
      }
      return undefined;
    } catch (error) {
      console.error('Error fetching pass by ID:', error);
      return undefined;
    } finally {
      setLoading(false);
    }
  }, [pases])

  const signPase = useCallback(async (id: string, signatureData: { signature: string; seal: string }): Promise<void> => {
    try {
      setLoading(true);

      // Sign a pase using the public API
      const response = await apiClient.signPass(id, signatureData);
      if (response.success && response.data) {
        const updatedPase = response.data as PaseData;
        setPases(prev =>
          prev.map(pase => (pase.id === id ? updatedPase : pase))
        );
        toast({
          title: 'Pase firmado',
          description: 'El pase se ha firmado correctamente',
        });
      } else {
        throw new Error(response.error || 'Error al firmar el pase');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al firmar el pase'
      setError(errorMessage)
      console.error('Error signing pass:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const authorizePase = useCallback(
    async (id: string): Promise<void> => {
      if (!id) return

      try {
        setLoading(true);

        // Authorize a pase using the public API
        const response = await apiClient.authorizePass(id);
        if (response.success && response.data) {
          const updatedPase = response.data as PaseData;
          setPases((prev) =>
            prev.map((pase) =>
              pase.id === id ? updatedPase : pase
            )
          );
        } else {
          throw new Error(response.error || 'Error al autorizar el pase');
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Error al autorizar el pase'
        setError(errorMessage)
        console.error('Error authorizing pass:', error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const rejectPase = useCallback(
    async (id: string, reason?: string): Promise<void> => {
      if (!id) return

      try {
        setLoading(true);

        // Reject a pase using the public API
        const response = await apiClient.rejectPass(id, reason || '');
        if (response.success && response.data) {
          const updatedPase = response.data as PaseData;
          setPases((prev) =>
            prev.map((pase) =>
              pase.id === id ? updatedPase : pase
            )
          );
        } else {
          throw new Error(response.error || 'Error al rechazar el pase');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al rechazar el pase'
        setError(errorMessage)
        console.error('Error rejecting pass:', error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const getStatistics = useCallback(async (): Promise<any> => {
    try {
      setLoading(true)
      const response = await apiClient.getPassStatistics()

      if (response.success && response.data) {
        // La respuesta del backend ya tiene la estructura correcta
        const stats = {
          totalPasses: response.data.totalPasses || 0,
          pendingPasses: response.data.pendingPasses || 0,
          signedPasses: response.data.signedPasses || 0,
          authorizedPasses: response.data.authorizedPasses || 0,
          rejectedPasses: response.data.rejectedPasses || 0,
          todayPasses: response.data.todayPasses || 0
        }
        console.log("Statistics loaded:", stats)
        return stats
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
    } catch (error) {
      console.error("Error loading statistics:", error)
      // Devolver valores por defecto en caso de error
      const defaultStats = {
        totalPasses: 0,
        pendingPasses: 0,
        signedPasses: 0,
        authorizedPasses: 0,
        rejectedPasses: 0,
        todayPasses: 0
      }
      return defaultStats
    } finally {
      setLoading(false)
    }
  }, [])

  const value: PaseContextValue = {
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
