"use client"

import { createContext, useState, useEffect, useContext, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { apiClient } from "@/lib/api-client"

export type UserRole = 'admin' | 'autorizador' | 'seguridad' | 'user';

export function normalizeRole(role: string | null | undefined): UserRole {
  console.log('normalizeRole original input:', role);
  console.log('normalizeRole input type:', typeof role);
  console.log('normalizeRole is null:', role === null);
  console.log('normalizeRole is undefined:', role === undefined);
  console.log('normalizeRole is empty string:', role === '');
  
  // Si el valor es null, undefined o falsy, devolver el valor por defecto
  if (role === null || role === undefined || !role) {
    console.log('normalizeRole received null, undefined or empty input, returning default autorizador');
    return 'autorizador';
  }
  
  // Asegurarse de que role sea una cadena
  const roleStr = String(role).trim();
  console.log('normalizeRole after toString:', roleStr);
  
  if (roleStr === '') {
    console.log('normalizeRole empty string after trim, returning default autorizador');
    return 'autorizador';
  }
  
  const lowerRole = roleStr.toLowerCase();
  console.log('normalizeRole lowerRole:', lowerRole);
  
  const roleMap: Record<string, UserRole> = {
    // Roles en inglés
    'admin': 'admin',
    'administrator': 'admin',
    'authorize': 'autorizador',
    'authorizer': 'autorizador',
    'security': 'seguridad',
    // Roles en español
    'administrador': 'admin',
    'autorizador': 'autorizador',
    'autorizar': 'autorizador',
    'autorización': 'autorizador',
    'autorizacion': 'autorizador',
    'seguridad': 'seguridad',
    // Posibles variaciones adicionales
    'adm': 'admin',
    'aut': 'autorizador',
    'seg': 'seguridad',
  };

  if (roleMap[lowerRole]) {
    console.log('normalizeRole matched:', roleMap[lowerRole]);
    return roleMap[lowerRole];
  }
  
  // Si no se encontró una coincidencia, devolver un valor por defecto
  console.log('normalizeRole no match found, returning default autorizador');
  return 'autorizador';
}

interface User {
  id: string;
  nombre: string;
  email: string;
  token?: string;
  apellido?: string;
  estado?: boolean;
  fechaCreacion?: string;
  ultimoAcceso?: string;
  name?: string;
  role?: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole[]) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const updateAuthState = useCallback((newUser: User | null) => {
    setUser(newUser);
    setIsAuthenticated(!!newUser);
    if (newUser) {
      // Guardar datos de usuario en localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      
      if (newUser.token) {
        // Guardar token en localStorage
        localStorage.setItem('token', newUser.token);
        
        // Establecer cookie para acceso del lado del servidor
        const maxAge = 24 * 60 * 60; // 24 horas en segundos
        const secure = window.location.protocol === 'https:' ? 'secure' : '';
        document.cookie = `token=${newUser.token}; path=/; max-age=${maxAge}; SameSite=Lax; ${secure}`;
      }
    } else {
      // Limpiar todos los datos de autenticación
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('originalAccessPath');
      
      // Limpiar cookie
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Avoid localStorage during SSR
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          if (parsedUser && parsedUser.id && parsedUser.email) {
            const userWithRole = {
              ...parsedUser,
              role: normalizeRole(parsedUser.role)
            };
            updateAuthState(userWithRole);
          } else {
            updateAuthState(null);
          }
        } else {
          updateAuthState(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        updateAuthState(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [updateAuthState]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const response = await apiClient.login(email, password);
      console.log('Auth context login response:', response);
      console.log('Auth context response.data:', response.data);
      
      if (response.success && response.data) {
        const { token, ...userData } = response.data;
        console.log('Auth context userData:', userData);
        console.log('Auth context userData.rol:', userData.rol);
        console.log('Auth context userData.role:', userData.role);
        console.log('Auth context userData type:', typeof userData);
        console.log('Auth context userData keys:', Object.keys(userData));
        
        const normalizedUser = {
          ...userData,
          token,
          // Asegurar que tenemos los campos requeridos
          nombre: userData.nombre || '',
          rol: userData.rol || userData.role || '',
          // Mantener compatibilidad con código existente
          name: userData.nombre || '',
          role: normalizeRole(userData.rol || userData.role || 'user') // La normalización es suficiente, la conversión a mayúsculas se hará en api-client.ts
        };
        
        console.log('Auth context normalizedUser:', normalizedUser);
        console.log('Auth context normalizedUser.role:', normalizedUser.role);
        
        updateAuthState(normalizedUser);
        
        return { success: true };
      } else {
        throw new Error(response.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [toast, updateAuthState]);

  const logout = useCallback(() => {
    // Limpiar estado de autenticación
    updateAuthState(null);
    
    // Limpiar localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('originalAccessPath');
    
    // Limpiar cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    
    // Notificar al usuario
    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado sesión correctamente',
    });
    
    // Redirección a login después de un breve retraso para permitir que se complete la limpieza
    setTimeout(() => {
      router.push('/login');
    }, 100);
  }, [toast, updateAuthState, router]);

  const hasRole = useCallback((roles: UserRole[]): boolean => {
    return user?.role ? roles.includes(user.role) : false;
  }, [user?.role]);

  const refreshUser = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const response = await apiClient.getUserById(user.id);
      if (response.success && response.data) {
        const updatedUser = {
          ...response.data,
          // Asegurar que tenemos los campos requeridos
          nombre: response.data.nombre || '',
          rol: response.data.role || '',
          // Mantener compatibilidad con código existente
          name: response.data.nombre || '',
          role: normalizeRole(response.data.role || response.data.role || 'user') // La normalización es suficiente, la conversión a mayúsculas se hará en api-client.ts
        };
        
        updateAuthState(updatedUser);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  }, [user?.id, updateAuthState]);

  const contextValue = useMemo(() => ({
    user,
    login,
    logout,
    loading,
    isAuthenticated,
    hasRole,
    refreshUser,
  }), [user, login, logout, loading, isAuthenticated, hasRole, refreshUser]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
