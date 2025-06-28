const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// Configuración de axios o fetch
export const apiClient = {
  baseURL: API_BASE_URL,

  // Método para hacer peticiones autenticadas
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token")

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  },

  // Métodos específicos
  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  async getPases(page = 0, size = 10) {
    return this.request(`/passes/paginated?page=${page}&size=${size}`)
  },

  async createPase(paseData: any) {
    return this.request("/passes", {
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
