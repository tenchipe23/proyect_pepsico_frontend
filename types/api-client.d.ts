// Declaración de la interfaz ApiResponse para su uso en los tipos
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success: boolean;
  error?: string;
  status?: number;
}

// Interfaz para los datos de usuario en la respuesta de login
interface LoginResponseData {
  id: string;
  userId?: string;
  nombre?: string;
  name?: string;
  apellido?: string;
  lastName?: string;
  email: string;
  rol: string;
  role?: string;
  token: string;
  accessToken?: string;
  expiresIn?: number;
}

// Interfaz para el cliente de API
declare const ApiClient: {
  new (baseURL: string): {
    verifyToken(token: string): Promise<boolean>;
    request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>>;
    login(email: string, password: string): Promise<ApiResponse<LoginResponseData>>;
    logout(): Promise<ApiResponse<void>>;
  };
};

export const apiClient: InstanceType<typeof ApiClient>;
