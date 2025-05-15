"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StampIcon, UploadIcon } from "lucide-react"

interface SealUploadProps {
  onSave: (sealData: string) => void
}

export default function SealUpload({ onSave }: SealUploadProps) {
  const [sealText, setSealText] = useState("AUTORIZADO")
  const [sealColor, setSealColor] = useState("#FF0000")
  const [sealOpacity, setSealOpacity] = useState(0.5)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Verificar que sea una imagen
    if (!file.type.match("image.*")) {
      alert("Por favor, selecciona un archivo de imagen válido")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        onSave(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const createTextSeal = () => {
    // Crear un canvas para generar el sello de texto
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Configurar el tamaño del canvas
    canvas.width = 200
    canvas.height = 200

    // Dibujar un círculo
    ctx.beginPath()
    ctx.arc(100, 100, 90, 0, Math.PI * 2)
    ctx.strokeStyle = sealColor
    ctx.lineWidth = 5
    ctx.stroke()

    // Configurar el texto
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = sealColor
    ctx.globalAlpha = sealOpacity

    // Dibujar el texto principal
    ctx.fillText(sealText, 100, 100)

    // Dibujar "PEPSICO" en la parte inferior
    ctx.font = "bold 16px Arial"
    ctx.fillText("PEPSICO", 100, 140)

    // Convertir a imagen
    const sealImage = canvas.toDataURL("image/png")
    onSave(sealImage)
  }

  return (
    <Card className="p-4 border border-gray-300">
      <Tabs defaultValue="upload">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <UploadIcon className="h-4 w-4" />
            Subir Sello
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <StampIcon className="h-4 w-4" />
            Crear Sello
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div className="flex flex-col items-center">
            <Label htmlFor="seal-upload" className="mb-2">
              Selecciona una imagen de sello
            </Label>
            <Input
              id="seal-upload"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="max-w-xs"
            />
            <p className="text-xs text-gray-500 mt-2">Formatos aceptados: JPG, PNG, GIF</p>
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="seal-text">Texto del sello</Label>
              <Input
                id="seal-text"
                value={sealText}
                onChange={(e) => setSealText(e.target.value)}
                maxLength={15}
                placeholder="Texto del sello"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="seal-color">Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="seal-color"
                    type="color"
                    value={sealColor}
                    onChange={(e) => setSealColor(e.target.value)}
                    className="w-12 h-8 p-1"
                  />
                  <span className="text-sm">{sealColor}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="seal-opacity">Opacidad</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="seal-opacity"
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={sealOpacity}
                    onChange={(e) => setSealOpacity(Number.parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm w-8">{Math.round(sealOpacity * 100)}%</span>
                </div>
              </div>
            </div>

            <Button type="button" onClick={createTextSeal} className="w-full bg-blue-700 hover:bg-blue-800">
              Generar Sello
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
