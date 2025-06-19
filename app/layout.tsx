import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/context/auth-context"
import { PaseProvider } from "@/context/pase-context"
import NavigationBreadcrumb from "@/components/navigation-breadcrumb"
import NavigationGuard from "@/components/navigation-guard"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PepsiCo - Sistema de Pases de Salida",
  description: "Sistema de gestión de pases de salida de vehículos para PepsiCo",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <PaseProvider>
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
              <div className="container mx-auto px-4 py-8">
                <NavigationBreadcrumb />
                <NavigationGuard>{children}</NavigationGuard>
              </div>
            </div>
            <Toaster />
          </PaseProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
