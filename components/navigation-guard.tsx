"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangleIcon } from "lucide-react"

interface NavigationGuardProps {
  when: boolean
  message?: string
  children: React.ReactNode
}

export default function NavigationGuard({
  when,
  message = "¿Está seguro que desea abandonar esta página? Los cambios no guardados se perderán.",
  children,
}: NavigationGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [showDialog, setShowDialog] = useState(false)
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)
  const [lastPathname, setLastPathname] = useState(pathname)

  // Detectar cambios en la ruta
  useEffect(() => {
    if (pathname !== lastPathname) {
      setLastPathname(pathname)
    }
  }, [pathname, lastPathname])

  // Manejar la navegación del usuario
  useEffect(() => {
    if (!when) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = message
      return message
    }

    // Agregar listener para navegación fuera del sitio
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [when, message])

  // Función para interceptar la navegación
  const handleNavigation = (url: string) => {
    if (when) {
      // Mostrar diálogo de confirmación
      setPendingUrl(url)
      setShowDialog(true)
      return false
    }
    return true
  }

  // Función para continuar con la navegación
  const handleContinue = () => {
    setShowDialog(false)
    if (pendingUrl) {
      router.push(pendingUrl)
    }
  }

  // Función para cancelar la navegación
  const handleCancel = () => {
    setShowDialog(false)
    setPendingUrl(null)
  }

  return (
    <>
      {children}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 mb-4">
              <AlertTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <DialogTitle className="text-center">¿Abandonar página?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center">{message}</p>
          </div>
          <DialogFooter className="flex flex-row justify-center gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleContinue}>
              Abandonar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
