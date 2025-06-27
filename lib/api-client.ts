const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

interface ApiResponse<T> {
  data?: T
  message?: string
  success: boolean
  error?: string
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP error! status: ${response.status}`,
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: "Error parsing response",
      }
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const config: RequestInit = {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, config)
      return this.handleResponse<T>(response)
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      }
    }
  }

  // Authentication endpoints
  async login(email: string, password: string) {
    return this.request<{
      token: string
      id: number
      nombre: string
      apellido: string
      email: string
      role: string
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    })
  }

  // User management endpoints
  async getUsers(page = 0, size = 10) {
    return this.request<{
      content: any[]
      totalElements: number
      totalPages: number
      number: number
      size: number
    }>(`/admin/users?page=${page}&size=${size}`)
  }

  async createUser(userData: any) {
    return this.request("/admin/users", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async updateUser(id: number, userData: any) {
    return this.request(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  }

  async deleteUser(id: number) {
    return this.request(`/admin/users/${id}`, {
      method: "DELETE",
    })
  }

  // Vehicle Exit Pass endpoints
  async getPasses(page = 0, size = 10, status?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(status && { status }),
    })
    return this.request<{
      content: any[]
      totalElements: number
      totalPages: number
      number: number
      size: number
    }>(`/vehicle-exit-passes/paginated?${params}`)
  }

  async getPassById(id: string) {
    return this.request(`/vehicle-exit-passes/${id}`)
  }

  async createPass(passData: any) {
    return this.request("/vehicle-exit-passes", {
      method: "POST",
      body: JSON.stringify(passData),
    })
  }

  async updatePass(id: string, passData: any) {
    return this.request(`/vehicle-exit-passes/${id}`, {
      method: "PUT",
      body: JSON.stringify(passData),
    })
  }

  async signPass(id: string, signatureData: { firma: string; sello: string }) {
    return this.request(`/vehicle-exit-passes/${id}/sign`, {
      method: "PUT",
      body: JSON.stringify(signatureData),
    })
  }

  async authorizePass(id: string) {
    return this.request(`/vehicle-exit-passes/${id}/authorize`, {
      method: "PUT",
    })
  }

  async rejectPass(id: string, reason?: string) {
    return this.request(`/vehicle-exit-passes/${id}/reject`, {
      method: "PUT",
      body: JSON.stringify({ reason }),
    })
  }

  async searchPasses(searchTerm: string, field: string, page = 0, size = 10) {
    const params = new URLSearchParams({
      searchTerm,
      field,
      page: page.toString(),
      size: size.toString(),
    })
    return this.request<{ content: any[] }>(`/vehicle-exit-passes/search?${params}`)
  }

  // Vehicle management endpoints
  async getVehicles() {
    return this.request<any[]>("/vehiculos")
  }

  async createVehicle(vehicleData: any) {
    return this.request("/vehiculos", {
      method: "POST",
      body: JSON.stringify(vehicleData),
    })
  }

  async updateVehicle(id: number, vehicleData: any) {
    return this.request(`/vehiculos/${id}`, {
      method: "PUT",
      body: JSON.stringify(vehicleData),
    })
  }

  async deleteVehicle(id: number) {
    return this.request(`/vehiculos/${id}`, {
      method: "DELETE",
    })
  }

  // Statistics endpoints
  async getPassStatistics() {
    return this.request<{
      totalPasses: number
      pendingPasses: number
      authorizedPasses: number
      rejectedPasses: number
    }>("/vehicle-exit-passes/statistics")
  }

  async getUserStatistics() {
    return this.request<{
      totalUsers: number
      activeUsers: number
      usersByRole: Record<string, number>
    }>("/admin/users/statistics")
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
