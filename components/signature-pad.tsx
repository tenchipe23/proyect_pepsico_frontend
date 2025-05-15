"use client"

import { useRef, useState } from "react"
import SignatureCanvas from "react-signature-canvas"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface SignaturePadProps {
  onSave: (signatureData: string) => void
}

export default function SignaturePad({ onSave }: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null)
  const [isSigned, setIsSigned] = useState(false)

  const clear = () => {
    sigCanvas.current?.clear()
    setIsSigned(false)
  }

  const save = () => {
    if (sigCanvas.current?.isEmpty()) {
      alert("Por favor, realice su firma antes de guardar")
      return
    }

    const signatureData = sigCanvas.current?.toDataURL("image/png")
    if (signatureData) {
      onSave(signatureData)
      setIsSigned(true)
    }
  }

  return (
    <div className="w-full">
      <Card className="border border-gray-300 rounded-md p-1 mb-3">
        <div className="bg-white">
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{
              className: "w-full h-40 border-b border-gray-200",
            }}
            onEnd={() => setIsSigned(true)}
          />
        </div>
      </Card>
      <div className="flex justify-between gap-2">
        <Button type="button" variant="outline" onClick={clear} className="flex-1">
          Limpiar
        </Button>
        <Button type="button" onClick={save} disabled={!isSigned} className="flex-1 bg-blue-700 hover:bg-blue-800">
          Confirmar Firma
        </Button>
      </div>
    </div>
  )
}
