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
    <div className="w-full">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded-lg h-auto">
          <TabsTrigger 
            value="upload" 
            className="flex items-center gap-2 py-2 px-4 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 data-[state=active]:font-medium transition-colors"
          >
            <UploadIcon className="h-4 w-4" />
            <span>Subir Sello</span>
          </TabsTrigger>
          <TabsTrigger 
            value="create" 
            className="flex items-center gap-2 py-2 px-4 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 data-[state=active]:font-medium transition-colors"
          >
            <StampIcon className="h-4 w-4" />
            <span>Crear Sello</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors hover:border-blue-400">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="p-3 bg-blue-50 rounded-full">
                <UploadIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <Label htmlFor="seal-upload" className="text-base font-medium text-gray-700 cursor-pointer hover:text-blue-600">
                  Haz clic para subir una imagen
                </Label>
                <p className="text-sm text-gray-500 mt-1">o arrastra y suelta una imagen aquí</p>
              </div>
              <Input
                id="seal-upload"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
              <p className="text-xs text-gray-400 mt-2">Formatos: JPG, PNG, GIF (Máx. 5MB)</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="seal-text" className="block text-sm font-medium text-gray-700 mb-1">
                Texto del sello
              </Label>
              <Input
                id="seal-text"
                value={sealText}
                onChange={(e) => setSealText(e.target.value)}
                maxLength={15}
                placeholder="Ej: APROBADO, RECHAZADO"
                className="w-full p-3 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
              />
              <p className="mt-1 text-xs text-gray-500">
                {sealText.length}/15 caracteres
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Vista previa
                </Label>
                <div className="flex justify-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div 
                    className="relative w-40 h-40 flex items-center justify-center"
                    style={{
                      backgroundImage: 'radial-gradient(#ddd 1px, transparent 1px)',
                      backgroundSize: '10px 10px',
                      backgroundPosition: 'center',
                      borderRadius: '50%',
                      border: '1px dashed #9ca3af',
                    }}
                  >
                    <div 
                      className="relative w-32 h-32 rounded-full border-2 flex items-center justify-center text-center p-2"
                      style={{
                        borderColor: sealColor,
                        opacity: sealOpacity,
                        color: sealColor,
                        fontWeight: 'bold',
                        fontSize: '16px',
                        lineHeight: '1.2',
                        wordBreak: 'break-word',
                        overflow: 'hidden',
                      }}
                    >
                      {sealText || 'Vista previa'}
                      <div className="absolute text-xs bottom-2">PEPSICO</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="seal-color" className="block text-sm font-medium text-gray-700 mb-1">
                    Color del sello
                  </Label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-10 h-10 rounded-md cursor-pointer border-2 border-gray-200 flex items-center justify-center"
                        style={{ backgroundColor: sealColor }}
                      >
                        <Input
                          id="seal-color"
                          type="color"
                          value={sealColor}
                          onChange={(e) => setSealColor(e.target.value)}
                          className="w-0 h-0 opacity-0 absolute"
                        />
                      </div>
                      <span className="text-sm font-mono text-gray-600">{sealColor.toUpperCase()}</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1 flex-1">
                      {['#FF0000', '#0000FF', '#00AA00', '#FFA500', '#800080'].map((color) => (
                        <button
                          key={color}
                          type="button"
                          className="w-6 h-6 rounded-full border-2 border-transparent hover:border-gray-400"
                          style={{ backgroundColor: color }}
                          onClick={() => setSealColor(color)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="seal-opacity" className="block text-sm font-medium text-gray-700">
                      Opacidad
                    </Label>
                    <span className="text-sm font-medium text-gray-600">
                      {Math.round(sealOpacity * 100)}%
                    </span>
                  </div>
                  <Input
                    id="seal-opacity"
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={sealOpacity}
                    onChange={(e) => setSealOpacity(Number.parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>

            <Button 
              type="button" 
              onClick={createTextSeal} 
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors"
            >
              <StampIcon className="h-5 w-5 mr-2" />
              Generar Sello
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
