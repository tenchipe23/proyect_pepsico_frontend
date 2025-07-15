import { string } from 'prop-types';
import { getToken, isTokenExpired, removeToken } from './auth-utils';
import { UserRole, normalizeRole } from '@/context/auth-context';

const API_BASE_URL = '/api';

// Response Types
interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success: boolean;
  error?: string;
  status?: number;
  unauthorized?: boolean;
  networkError?: boolean;
  [key: string]: any; // Allow additional properties
}

// User types

export interface UserData {
  id: string;
  nombre: string;
  apellido?: string;
  segundoApellido?: string;
  email: string;
  rol: UserRole;
  estado?: boolean;
  fechaCreacion?: string;
  ultimoAcceso?: string;
  token?: string; 
  // Campos adicionales para compatibilidad con el código existente
  name?: string;
  role?: UserRole;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Log request details in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${options.method || 'GET'} ${url}`, { options });
    }
    
    try {
      // Verificar si el token ha expirado antes de hacer la solicitud
      if (!endpoint.startsWith('/auth') && typeof window !== 'undefined') {
        const token = getToken();
        if (token && isTokenExpired(token)) {
          console.log('[API] Token expirado, redirigiendo a login');
          this.handleUnauthorized();
          return {
            success: false,
            error: 'Token expirado - Por favor inicie sesión nuevamente',
            unauthorized: true,
          };
        }
      }
      
      const headers = this.getAuthHeaders(endpoint);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...headers,
          ...options.headers,
        },
        credentials: 'include',
        cache: 'no-store',
        next: { revalidate: 0 }
      });

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      let data: any;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = text ? JSON.parse(text) : {};
        } catch (e) {
          data = { message: text };
        }
      }
      
      // Log response details in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API] Response ${response.status} ${url}`, { 
          status: response.status,
          statusText: response.statusText,
          data,
          headers: Object.fromEntries(response.headers.entries())
        });
      }
      
      if (!response.ok) {
        if (response.status === 401) {
          this.handleUnauthorized();
          return {
            success: false,
            status: response.status,
            error: 'Unauthorized - Please log in again',
            unauthorized: true,
          };
        }
        
        // Mejorar el manejo de errores de validación (400 Bad Request)
        if (response.status === 400 && data?.validationErrors) {
          console.error('[API] Validation errors:', data.validationErrors);
          
          // Crear un mensaje de error más descriptivo
          const validationErrorMessages = Object.entries(data.validationErrors)
            .map(([field, message]) => `${field}: ${message}`)
            .join(', ');
          
          return {
            success: false,
            status: response.status,
            error: `Validation Failed: ${validationErrorMessages}`,
            validationErrors: data.validationErrors,
            ...data,
          };
        }
        
        return {
          success: false,
          status: response.status,
          error: data?.message || data?.error || response.statusText || 'Request failed',
          ...data,
        };
      }

      return {
        success: true,
        status: response.status,
        ...(data && { data }),
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      console.error(`[API] Request failed: ${errorMessage}`, { 
        url,
        error: errorMessage,
        stack: errorStack,
      });
      
      return {
        success: false,
        status: 0,
        error: errorMessage,
        networkError: true,
      };
    }
  }

  private getAuthHeaders(endpoint: string): HeadersInit {
    const headers: HeadersInit = {};
    
    // Skip auth headers for public endpoints
    if (endpoint.startsWith('/auth')) {
      return headers;
    }

    const token = typeof window !== 'undefined' ? getToken() : null;
    
    if (token && !isTokenExpired(token)) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  private handleUnauthorized(): void {
    if (typeof window === 'undefined') return;
    
    // Limpiar token
    removeToken();
    
    // Limpiar localStorage de manera explícita para asegurar una limpieza completa
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('originalAccessPath');
    
    // Limpiar cookies con parámetros explícitos
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    
    // No redirigir automáticamente en rutas públicas
    const publicPaths = ['/', '/login', '/unauthorized', '/solicitar'];
    const currentPath = window.location.pathname;
    
    // Solo redirigir si no estamos en una ruta pública y no estamos ya en login
    if (!publicPaths.includes(currentPath) && currentPath !== '/login') {
      console.log('API Client: Redirigiendo a login debido a error de autenticación');
      // Guardar la ruta original para posible redirección después del login
      localStorage.setItem('originalAccessPath', currentPath);
      // Usar setTimeout para evitar problemas con la redirección durante la ejecución de una solicitud
      // y asegurar que la limpieza de credenciales se complete antes de la redirección
      setTimeout(() => {
        window.location.href = '/login?session_expired=true';
      }, 100);
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request<{ token: string } & UserData>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      // Transform the response to include the token and user data
      const { token, ...userData } = response.data;
      
      // Guardar el token en localStorage
      localStorage.setItem('token', token);
      
      // También establecer la cookie para acceso del lado del servidor
      // Asegurar que la cookie tenga los parámetros correctos para seguridad y duración
      const maxAge = 24 * 60 * 60; // 24 horas en segundos
      const secure = window.location.protocol === 'https:' ? 'secure' : '';
      document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=Lax; ${secure}`;
      
      // Establecer un temporizador para refrescar el token antes de que expire
      // (esto podría implementarse en el futuro si se necesita)
      
      console.log('Login successful, token saved:', token);
      console.log('Login response data:', response.data);
      console.log('User data from backend:', userData);
      console.log('Backend rol value:', userData.rol);
      console.log('Backend role value:', userData.role);
      console.log('Backend user type:', typeof userData);
      console.log('Backend user keys:', Object.keys(userData));
      
      return {
        ...response,
        data: {
          ...userData,
          token,
          // Mapear los campos del backend a los campos que espera el frontend
          name: userData.nombre || '',
          role: normalizeRole(userData.rol || userData.role || 'user'),
          // Mantener los campos originales
          nombre: userData.nombre || '',
          apellido: userData.apellido || '',
          rol: userData.rol || userData.role || 'user'
        }
      };
    }
    console.error('Login failed:', response.error || 'Unknown error');
    return response;
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await this.request<{ valid: boolean }>('/auth/verify-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.success && response.data?.valid === true;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }

  async getUserById(id: string) {
    return this.request<UserData>(`/admin/users/${id}`, {
      method: 'GET',
    });
  }

  // User management methods
  async getUsers(
    page: number = 0,
    size: number = 10,
    search: string = ''
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(search && { search }),
    });

    return this.request<{
      content: UserData[];
      totalElements: number;
      totalPages: number;
      number: number;
      size: number;
    }>(`/admin/users?${params.toString()}`, {
      method: 'GET',
    });
  }

  async getUserStats() {
    return this.request<{
      totalUsers: number;
      adminCount: number;
      autorizadorCount: number;
      seguridadCount: number;
    }>('/admin/users/stats', {
      method: 'GET',
    });
  }

  async updateUser(id: string, userData: Partial<UserData> & { password?: string }) {
    console.log('API Client updateUser called with:', {
      ...userData,
      password: userData.password ? '***' : undefined, // No mostrar la contraseña en los logs
      rol: userData.rol,
      rolType: typeof userData.rol,
      nombre: userData.nombre
    });
    
    // Validar que nombre no esté vacío
    if (userData.nombre !== undefined && (userData.nombre === null || userData.nombre.trim() === '')) {
      console.error('API Client: nombre is empty or null, this will cause a validation error');
    }
    
    // Asegurarse de que el rol no sea null o undefined
    if (userData.rol === null || userData.rol === undefined || (typeof userData.rol === 'string' && userData.rol.trim() === '')) {
      console.error('API Client: rol is null, undefined or empty, setting default role');
      userData.rol = 'autorizador' as UserRole;
    }
    
    // Asegurarse de que el rol sea una cadena y convertirlo a UserRole
    if (userData.rol !== undefined && typeof userData.rol !== 'string') {
      console.error('API Client: rol is not a string, converting to string');
      userData.rol = normalizeRole(String(userData.rol));
    }
    
    // Validar que el rol no esté vacío después de la conversión
    if (userData.rol !== undefined && typeof userData.rol === 'string' && userData.rol.trim() === '') {
      console.error('API Client: rol is empty after trimming, setting default role');
      userData.rol = 'autorizador' as UserRole;
    }
    
    // Normalizar el rol antes de enviarlo
    if (userData.rol !== undefined) {
      // Convertir el rol a mayúsculas para que coincida con los valores del enum en el backend
      const normalizedRole = normalizeRole(userData.rol as string);
      userData.rol = normalizedRole.toUpperCase() as any;
      console.log('API Client: normalized and uppercased role:', userData.rol);
    }
    
    console.log('API Client sending userData for update:', {
      ...userData,
      password: userData.password ? '***' : undefined, // No mostrar la contraseña en los logs
      rol: userData.rol,
      rolType: typeof userData.rol,
      nombre: userData.nombre
    });
    
    return this.request<UserData>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Pass statistics
  async getPassStatistics() {
    return this.request<{
      totalPasses: number;
      pendingPasses: number;
      signedPasses: number;
      authorizedPasses: number;
      rejectedPasses: number;
      todayPasses: number;
    }>('/passes/stats', {
      method: 'GET',
    });
  }

  // Passes methods
  async getPasses(
    page: number = 0,
    size: number = 10,
    status?: string,
    search?: string
  ) {
    let url = `/passes?page=${page}&size=${size}`;
    
    if (status) {
      url += `&status=${encodeURIComponent(status)}`;
    }
    
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    
    return this.request<{
      content: any[];
      totalElements: number;
      totalPages: number;
      number: number;
      size: number;
    }>(url, {
      method: 'GET',
    });
  }

  // Create a new pass
  async createPass(passData: Partial<any>) {
    return this.request<any>('/passes/create', {
      method: 'POST',
      body: JSON.stringify(passData),
    });
  }

  // Update a pass
  async updatePass(id: string, updates: Partial<any>) {
    return this.request<any>(`/passes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Delete a pass
  async deletePass(id: string) {
    return this.request<any>(`/passes/${id}`, {
      method: 'DELETE',
    });
  }

  // Sign a pass
  async signPass(id: string, signatureData: { signature: string; seal: string }) {
    return this.request<any>(`/passes/${id}/sign`, {
      method: 'POST',
      body: JSON.stringify(signatureData),
    });
  }

  // Authorize a pass
  async authorizePass(id: string) {
    return this.request<any>(`/passes/${id}/authorize`, {
      method: 'POST',
    });
  }

  // Reject a pass
  async rejectPass(id: string, reason: string) {
    return this.request<any>(`/passes/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Get a pass by ID
  async getPassById(id: string) {
    return this.request<any>(`/passes/${id}`, {
      method: 'GET',
    });
  }

  async createUser(userData: {
    name: string;
    apellido?: string;
    segundoApellido?: string;
    email: string;
    password: string;
    role: string | UserRole;
  }) {
    console.log('API Client createUser called with:', {
      ...userData,
      password: '***',
      role: userData.role,
      roleType: typeof userData.role,
      name: userData.name
    });
    
    // Validar que name no esté vacío
    if (!userData.name || userData.name.trim() === '') {
      console.error('API Client: name is empty or null, this will cause a validation error');
    }
    
    // Asegurarse de que el role no sea null or undefined
    if (userData.role === null || userData.role === undefined || (typeof userData.role === 'string' && userData.role === '')) {
      console.error('API Client: role is null, undefined or empty, setting default role');
      userData.role = 'autorizador' as UserRole;
    }
    
    // Asegurarse de que el role sea una cadena y convertirlo a UserRole
    if (typeof userData.role !== 'string') {
      console.error('API Client: role is not a string, converting to string');
      userData.role = normalizeRole(String(userData.role));
    }
    
    // Validar que el role no esté vacío después de la conversión
    if (typeof userData.role === 'string' && userData.role.trim() === '') {
      console.error('API Client: role is empty after trimming, setting default role');
      userData.role = 'autorizador' as UserRole;
    }
    
    // Normalizar el role antes de enviarlo
    const normalizedRole = normalizeRole(userData.role as string);
    // Convertir el rol a mayúsculas para que coincida con los valores del enum en el backend
    userData.role = normalizedRole.toUpperCase() as any;
    console.log('API Client: normalized and uppercased role:', userData.role);
    
    // Verificación final para asegurar que el rol nunca sea nulo o vacío
    if (!userData.role) {
      console.error('API Client: role is still null or empty after all validations, forcing default role');
      userData.role = 'AUTORIZADOR' as any; // Usar directamente el valor en mayúsculas
    }
    
    console.log('API Client sending userData:', {
      ...userData,
      password: '***',
      role: userData.role,
      roleType: typeof userData.role,
      name: userData.name
    });
    
    return this.request<UserData>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }
}

export const apiClient = new ApiClient();


export default apiClient;
