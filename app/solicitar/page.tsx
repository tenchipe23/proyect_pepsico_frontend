"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { usePase, type PaseData } from "@/context/pase-context"
import { SendIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import SuccessDialog from "@/components/success-dialog"

export default function SolicitarPage() {
  const { toast } = useToast()
  const { addPase } = usePase()
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [lastPaseId, setLastPaseId] = useState<string | null>(null)

  const [formData, setFormData] = useState<Omit<PaseData, "id" | "firma" | "sello" | "fechaCreacion" | "estado">>({
    folio: `PST-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`,
    razonSocial: "",
    fecha: new Date().toISOString().split("T")[0],
    tractorEco: "",
    tractorPlaca: "",
    remolque1Eco: "",
    remolque1Placa: "",
    remolque2Eco: "",
    remolque2Placa: "",
    operadorNombre: "",
    operadorApellidoPaterno: "",
    operadorApellidoMaterno: "",
    ecoDolly: "",
    placasDolly: "",
    comentarios: "",
    firma: "",
    sello: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setFormData({
      ...formData,
      folio: `PST-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`,
      razonSocial: "",
      tractorEco: "",
      tractorPlaca: "",
      remolque1Eco: "",
      remolque1Placa: "",
      remolque2Eco: "",
      remolque2Placa: "",
      operadorNombre: "",
      operadorApellidoPaterno: "",
      operadorApellidoMaterno: "",
      ecoDolly: "",
      placasDolly: "",
      comentarios: "",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar campos requeridos
    const requiredFields = [
      "razonSocial",
      "fecha",
      "tractorEco",
      "tractorPlaca",
      "operadorNombre",
      "operadorApellidoPaterno",
    ]

    const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData])

    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Error en el formulario",
        description: `Por favor complete los siguientes campos: ${missingFields.join(", ")}`,
      })
      return
    }

    // Crear nuevo pase
    const newPase = addPase({
      ...formData,
      estado: "pendiente",
      firma: "",
      sello: "",
      fechaCreacion: new Date().toISOString(),
    })

    // Guardar el ID del pase para mostrarlo en el diálogo
    setLastPaseId(newPase.id)

    // Mostrar diálogo de éxito
    setShowSuccessDialog(true)
  }

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false)
    resetForm()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Solicitud de Pase de Salida</h1>
        <p className="text-white/80">Complete el formulario para solicitar un nuevo pase de salida.</p>
      </div>

      <Card className="shadow-xl">
        <CardHeader className="bg-gray-900 text-white p-4 flex flex-row items-center space-y-0 gap-4">
          <div className="bg-white p-2 rounded">
            <h2 className="text-gray-900 font-bold">PEPSICO</h2>
          </div>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold">PASE DE SALIDA TRAFICO</h1>
          </div>
          <div className="text-right">
            <p className="text-sm">FOLIO:</p>
            <Input name="folio" value={formData.folio} readOnly className="bg-white text-black h-8 mt-1" />
          </div>
        </CardHeader>

        <div className="bg-gray-100 p-2 text-center border-b">
          <h3 className="font-medium">AZCAPOTZALCO</h3>
        </div>

        <CardContent className="p-6">
          <form id="solicitud-form" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="razonSocial">
                  RAZÓN SOCIAL: <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="razonSocial"
                  name="razonSocial"
                  value={formData.razonSocial}
                  onChange={handleChange}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="fecha">
                  FECHA: <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fecha"
                  name="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={handleChange}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="border p-4 rounded-md">
                <h3 className="font-bold text-center mb-4">TRACTOR</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tractorEco">
                      ECO <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="tractorEco"
                      name="tractorEco"
                      value={formData.tractorEco}
                      onChange={handleChange}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tractorPlaca">
                      PLACA <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="tractorPlaca"
                      name="tractorPlaca"
                      value={formData.tractorPlaca}
                      onChange={handleChange}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="border p-4 rounded-md">
                <h3 className="font-bold text-center mb-4">REMOLQUE 1</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="remolque1Eco">ECO</Label>
                    <Input
                      id="remolque1Eco"
                      name="remolque1Eco"
                      value={formData.remolque1Eco}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="remolque1Placa">PLACA</Label>
                    <Input
                      id="remolque1Placa"
                      name="remolque1Placa"
                      value={formData.remolque1Placa}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="border p-4 rounded-md">
                <h3 className="font-bold text-center mb-4">REMOLQUE 2</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="remolque2Eco">ECO</Label>
                    <Input
                      id="remolque2Eco"
                      name="remolque2Eco"
                      value={formData.remolque2Eco}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="remolque2Placa">PLACA</Label>
                    <Input
                      id="remolque2Placa"
                      name="remolque2Placa"
                      value={formData.remolque2Placa}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-2">OPERADOR:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="operadorNombre">
                    NOMBRE(S) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="operadorNombre"
                    name="operadorNombre"
                    value={formData.operadorNombre}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="operadorApellidoPaterno">
                    APELLIDO PATERNO <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="operadorApellidoPaterno"
                    name="operadorApellidoPaterno"
                    value={formData.operadorApellidoPaterno}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="operadorApellidoMaterno">APELLIDO MATERNO</Label>
                  <Input
                    id="operadorApellidoMaterno"
                    name="operadorApellidoMaterno"
                    value={formData.operadorApellidoMaterno}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="ecoDolly">ECO DOLLY</Label>
                <Input
                  id="ecoDolly"
                  name="ecoDolly"
                  value={formData.ecoDolly}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="placasDolly">PLACAS DOLLY</Label>
                <Input
                  id="placasDolly"
                  name="placasDolly"
                  value={formData.placasDolly}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="mb-6">
              <Label htmlFor="comentarios">COMENTARIOS:</Label>
              <Textarea
                id="comentarios"
                name="comentarios"
                value={formData.comentarios}
                onChange={handleChange}
                className="mt-1"
                rows={2}
              />
            </div>
          </form>
        </CardContent>

        <CardFooter className="bg-gray-50 border-t p-4 flex justify-end">
          <Button type="submit" form="solicitud-form" className="bg-blue-700 hover:bg-blue-800 flex items-center gap-2">
            <SendIcon className="h-4 w-4" />
            Enviar Solicitud
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-4 text-white/70 text-sm">
        <p>
          Los campos marcados con <span className="text-red-500">*</span> son obligatorios.
        </p>
      </div>

      {/* Diálogo de confirmación */}
      {showSuccessDialog && <SuccessDialog paseId={lastPaseId} onClose={handleCloseSuccessDialog} />}
    </div>
  )
}
