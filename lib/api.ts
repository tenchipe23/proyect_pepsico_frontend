const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.0.0.1:8080/api"

// Configuración de axios o fetch
export const apiClient = {
  baseURL: API_BASE_URL,

  // Método para hacer peticiones autenticadas
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token")
    const url = `${API_BASE_URL}${endpoint}`
    
    // Ensure headers object exists
    const headers = new Headers(options.headers || {})
    headers.set('Content-Type', 'application/json')
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const config: RequestInit = {
      ...options,
      headers: Object.fromEntries(headers.entries()),
      credentials: 'include', // This is important for sending cookies with CORS
      mode: 'cors', // Ensure CORS mode is enabled
    }

    console.log(`[API] ${options.method || 'GET'} ${url}`, { 
      options: {
        ...options,
        body: options.body ? JSON.parse(options.body as string) : undefined,
      } 
    });

    try {
      const response = await fetch(url, config)
      const responseData = await response.json().catch(() => ({}))
      
      console.log(`[API] Response ${response.status} ${url}`, { 
        status: response.status,
        statusText: response.statusText,
        data: responseData,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        throw new Error(
          responseData.message || 
          responseData.error || 
          `HTTP error! status: ${response.status} ${response.statusText}`
        )
      }

      return responseData
    } catch (error) {
      console.error('[API] Request failed:', {
        url,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
      throw error
    }
  },

  // Métodos específicos
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  },

  async getPases(page = 0, size = 10) {
    return this.request(`/passes?page=${page}&size=${size}`)
  },

  async createPase(paseData: any) {
    return this.request("/passes/create", {
      method: "POST",
      body: JSON.stringify(paseData),
    })
  },

  async getVehiculos() {
    return this.request("/vehiculos")
  },

  async getUsers() {
    return this.request("/admin/users")
  },
}
