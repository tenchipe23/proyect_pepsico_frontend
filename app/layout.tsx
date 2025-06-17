import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { PaseProvider } from "@/context/pase-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema de Pases de Salida - PepsiCo",
  description: "Sistema para gestionar pases de salida",
  creator: 'Jose Manuel Tenchipe del Valle',
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gradient-to-r from-blue-800 to-blue-600 min-h-screen`}>
        <PaseProvider>
          <div className="container mx-auto py-6 px-4">{children}</div>
          <Toaster />
        </PaseProvider>
      </body>
    </html>
  )
}
