// Tipos globales para la aplicación

// Extender la interfaz ProcessEnv con nuestras variables de entorno personalizadas
declare namespace NodeJS {
  interface ProcessEnv {
    // Variables de entorno de Next.js
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_API_URL: string;
    // Agrega aquí otras variables de entorno que necesites
  }
}

// Extender la interfaz Window con propiedades globales adicionales
interface Window {
  // Propiedades globales de window
  // Agrega aquí propiedades globales si son necesarias
}

export {};
