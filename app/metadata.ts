// app/metadata.ts
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'PepsiCo - Sistema de Pases de Salida',
  description: 'Sistema de gestión de pases de salida de vehículos para PepsiCo',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  themeColor: '#1e40af',
};