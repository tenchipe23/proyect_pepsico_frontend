"use client"

import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { PaseProvider } from "@/context/pase-context"
import { useEffect, useState } from "react"

const inter = Inter({ subsets: ["latin"] })

// Metadata debe estar en un archivo separado o en un componente de servidor
// No se puede usar en un componente cliente

export default function SolicitarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PaseProvider>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </div>
      <Toaster />
    </PaseProvider>
  )
}