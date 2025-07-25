"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle } from "lucide-react"
import type { PaseData } from "@/context/pase-context"

interface SuccessDialogProps {
  pase: PaseData | null
  onClose: () => void
}

export default function SuccessDialog({ pase, onClose }: SuccessDialogProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-lg">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center text-gray-900">Solicitud Enviada</DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Su solicitud de pase de salida ha sido enviada correctamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
            <p className="text-sm font-medium mb-2 text-gray-800">Detalles de la solicitud:</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium text-gray-700">Folio:</div>
              <div className="text-gray-900">{pase?.folio || 'N/A'}</div>
              <div className="font-medium text-gray-700">Fecha:</div>
              <div className="text-gray-900">{pase?.fecha ? new Date(pase.fecha).toLocaleDateString('es-MX') : 'N/A'}</div>
              <div className="font-medium text-gray-700">Operador:</div>
              <div className="text-gray-900">
                {pase?.operadorNombre && pase?.operadorApellidoPaterno 
                  ? `${pase.operadorNombre} ${pase.operadorApellidoPaterno}`
                  : pase?.operadorNombre || 'No especificado'}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            El pase de salida será revisado por el personal autorizado. Puede consultar el estado de su solicitud con el
            número de folio.
          </p>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button 
            type="button" 
            onClick={onClose} 
            className="bg-blue-700 hover:bg-blue-800 text-white font-medium px-4 py-2 rounded-md shadow-sm"
          >
            Aceptar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

