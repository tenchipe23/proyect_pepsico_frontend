export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= exp;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    // Limpiar token del localStorage
    localStorage.removeItem('token');
    
    // Limpiar otros datos de autenticación para asegurar una limpieza completa
    localStorage.removeItem('user');
    localStorage.removeItem('originalAccessPath');
    
    // Limpiar cookie de token
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
  }
};
