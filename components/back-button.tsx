"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"

interface BackButtonProps {
  fallbackUrl?: string
  className?: string
}

export default function BackButton({ fallbackUrl = "/", className = "" }: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    // Intentar volver a la página anterior en el historial
    try {
      // Verificar si hay historial para volver atrás
      if (window.history.length > 1) {
        router.back()
      } else {
        // Si no hay historial, ir a la URL de respaldo
        router.push(fallbackUrl)
      }
    } catch (error) {
      console.error("Error al navegar:", error)
      // En caso de error, ir a la URL de respaldo
      router.push(fallbackUrl)
    }
  }

  return (
    <Button
      variant="outline"
      className={`bg-white/10 text-white hover:bg-white/20 flex items-center gap-2 ${className}`}
      onClick={handleBack}
    >
      <ArrowLeftIcon className="h-4 w-4" />
      Volver
    </Button>
  )
}
