import { getToken, isTokenExpired, removeToken } from './auth-utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

interface ApiResponse<T> {
  data?: T
  message?: string
  success: boolean
  error?: string
  status?: number
}

interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private getAuthHeaders(): HeadersInit {
    try {
      const token = getToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      // Don't add Authorization header for login/register endpoints
      if (typeof window !== 'undefined' && 
          (window.location.pathname.includes('/login') || 
           window.location.pathname.includes('/register'))) {
        return headers;
      }

      if (!token) {
        console.warn('No authentication token found');
        this.handleUnauthorized();
        return headers;
      }

      // Check if token is expired
      if (isTokenExpired(token)) {
        console.warn('Token is expired');
        this.handleUnauthorized();
        return headers;
      }

      // Add authorization header if token is valid
      headers['Authorization'] = `Bearer ${token}`;
      return headers;
    } catch (error) {
      console.error('Error in getAuthHeaders:', error);
      return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
    }
  }

  private handleUnauthorized() {
    // Only redirect if we're not already on the login page
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      // Store the current URL to redirect back after login
      const redirectPath = window.location.pathname + window.location.search;
      const loginUrl = `/login?session=expired${redirectPath !== '/' ? `&redirect=${encodeURIComponent(redirectPath)}` : ''}`;
      
      // Use replaceState to avoid adding to browser history
      window.history.replaceState(null, '', loginUrl);
      // Force a page reload to ensure clean state
      window.location.reload();
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    // Handle 401 Unauthorized
    if (response.status === 401) {
      console.warn('Unauthorized - handling unauthorized response');
      removeToken();
      this.handleUnauthorized();
      return {
        success: false,
        error: 'Session expired. Please log in again.',
        status: 401,
      };
    }

    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error('Failed to parse response:', error);
      return {
        success: false,
        error: 'Failed to parse server response',
        status: response.status,
      };
    }

    if (!response.ok) {
      console.error('Request failed:', {
        status: response.status,
        statusText: response.statusText,
        data,
      });
      return {
        success: false,
        error: data.message || response.statusText || 'Request failed',
        status: response.status,
      };
    }

    return {
      success: true,
      data: data as T,
    };
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      // For GET requests, we don't need to handle preflight
      if (options.method && options.method.toUpperCase() === 'GET') {
        const config: RequestInit = {
          ...options,
          method: 'GET',
          credentials: 'include',
          headers: {
            ...this.getAuthHeaders(),
            ...options.headers,
            'Accept': 'application/json',
          },
        };
        
        const response = await fetch(`${this.baseURL}${endpoint}`, config);
        return this.handleResponse<T>(response);
      }
      
      // For non-GET requests, handle preflight
      const preflightHeaders: HeadersInit = {
        'Access-Control-Request-Method': options.method || 'POST',
        'Access-Control-Request-Headers': 'authorization,content-type',
        ...this.getAuthHeaders(),
      };

      // Make preflight request
      try {
        const preflightResponse = await fetch(`${this.baseURL}${endpoint}`, {
          method: 'OPTIONS',
          headers: preflightHeaders,
          credentials: 'include',
        });

        if (!preflightResponse.ok) {
          console.error('Preflight request failed:', preflightResponse);
          // Continue anyway, as some backends handle CORS without explicit OPTIONS
        }
      } catch (preflightError) {
        console.warn('Preflight request error:', preflightError);
        // Continue with the actual request
      }

      // Make the actual request
      const config: RequestInit = {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      };

      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('Request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication endpoints
  async login(email: string, password: string) {
    return this.request<{
      token: string
      accessToken?: string
      id: string
      userId?: string
      nombre?: string
      name?: string
      apellido?: string
      lastName?: string
      email: string
      rol: string
      role?: string
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
  async getUsers(page = 0, size = 10, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(search && { search }),
    })
    return this.request<PaginatedResponse<any>>(`/admin/users?${params}`)
  }

  async getUserById(id: string) {
    return this.request<any>(`/admin/users/${id}`)
  }

  async createUser(userData: {
    name: string
    apellido?: string
    email: string
    password: string
    role: string
  }) {
    return this.request<any>("/admin/users", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async updateUser(
    id: string,
    userData: {
      nombre: string
      apellido?: string
      email: string
      rol: string
      password?: string
    },
  ) {
    return this.request<any>(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  }

  async deleteUser(id: string) {
    return this.request(`/admin/users/${id}`, {
      method: "DELETE",
    })
  }

  async getUsersByRole(role: string) {
    return this.request<any[]>(`/admin/users/role/${role}`)
  }

  async getUserStats() {
    return this.request<{
      totalUsers: number
      adminCount: number
      autorizadorCount: number
      seguridadCount: number
    }>("/admin/users/stats")
  }

  // Vehicle Exit Pass endpoints
  async getPasses(page = 0, size = 10, status?: string, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(status && { status }),
      ...(search && { search }),
    })
    return this.request<PaginatedResponse<any>>(`/passes?${params}`)
  }

  async getPassById(id: string) {
    return this.request<any>(`/passes/${id}`)
  }

  async getPassByFolio(folio: string) {
    return this.request<any>(`/passes/folio/${folio}`)
  }

  async createPass(passData: any) {
    try {
      // Ensure we have all required fields with proper types
      const passToCreate = {
        ...passData,
        id: passData.id || crypto.randomUUID(),
        fechaCreacion: passData.fechaCreacion || new Date().toISOString(),
        estado: passData.estado || 'PENDIENTE',
        // Ensure all required fields have default values
        remolque1Eco: passData.remolque1Eco || '',
        remolque1Placa: passData.remolque1Placa || '',
        remolque2Eco: passData.remolque2Eco || '',
        remolque2Placa: passData.remolque2Placa || '',
        operadorApellidoMaterno: passData.operadorApellidoMaterno || '',
        ecoDolly: passData.ecoDolly || '',
        placasDolly: passData.placasDolly || '',
        comentarios: passData.comentarios || ''
      };
      
      const response = await this.request<any>("/passes/create", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(passToCreate),
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to create pass');
      }

      return response;
    } catch (error) {
      console.error('Error in createPass:', error);
      throw error;
    }
  }

  async updatePass(id: string, passData: any) {
    return this.request<any>(`/passes/${id}`, {
      method: "PUT",
      body: JSON.stringify(passData),
    })
  }

  async signPass(id: string, signatureData: { signature: string; seal: string }) {
    return this.request<any>(`/passes/${id}/sign`, {
      method: "POST",
      body: JSON.stringify(signatureData),
    })
  }

  async authorizePass(id: string) {
    return this.request<any>(`/passes/authorize/${id}`, {
      method: "POST",
    })
  }

  async rejectPass(id: string, reason?: string) {
    return this.request<any>(`/passes/reject/${id}`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    })
  }

  async deletePass(id: string) {
    return this.request(`/passes/${id}`, {
      method: "DELETE",
    })
  }

  // Global search endpoint
  async globalSearch(query: string, page = 0, size = 10) {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      size: size.toString(),
    })
    return this.request<PaginatedResponse<any>>(`/search/global?${params}`)
  }

  // Statistics endpoints
  async getPassStatistics() {
    return this.request<{
      totalPasses: number
      pendingPasses: number
      signedPasses: number
      authorizedPasses: number
      rejectedPasses: number
      todayPasses: number
    }>("/passes/stats")
  }

  async getPassCountByStatus(status: string) {
    return this.request<number>(`/passes/stats/count-by-status/${status}`)
  }

  async getPassCountCreatedToday() {
    return this.request<number>("/passes/stats/count-created-today")
  }

  // Vehicle management endpoints
  async getVehicles() {
    return this.request<any[]>("/vehiculos")
  }

  async createVehicle(vehicleData: any) {
    return this.request<any>("/vehiculos", {
      method: "POST",
      body: JSON.stringify(vehicleData),
    })
  }

  async updateVehicle(id: string, vehicleData: any) {
    return this.request<any>(`/vehiculos/${id}`, {
      method: "PUT",
      body: JSON.stringify(vehicleData),
    })
  }

  async deleteVehicle(id: string) {
    return this.request(`/vehiculos/${id}`, {
      method: "DELETE",
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
