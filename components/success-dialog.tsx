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

interface SuccessDialogProps {
  pase: any | null
  onClose: () => void
}

export default function SuccessDialog({ pase, onClose }: SuccessDialogProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center">Solicitud Enviada</DialogTitle>
          <DialogDescription className="text-center">
            Su solicitud de pase de salida ha sido enviada correctamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="border rounded-md p-4 bg-gray-50">
            <p className="text-sm font-medium mb-2">Detalles de la solicitud:</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Folio:</div>
              <div>{pase?.folio}</div>
              <div className="font-medium">Fecha:</div>
              <div>{pase ? new Date(pase.fecha).toLocaleDateString() : ""}</div>
              <div className="font-medium">Operador:</div>
              <div>{pase ? `${pase.operadorNombre} ${pase.operadorApellidoPaterno}` : ""}</div>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            El pase de salida será revisado por el personal autorizado. Puede consultar el estado de su solicitud con el
            número de folio.
          </p>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button type="button" onClick={onClose} className="bg-blue-700 hover:bg-blue-800">
            Aceptar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
