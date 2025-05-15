"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import SignaturePad from "@/components/signature-pad"
import SealUpload from "@/components/seal-upload"
import PdfExport from "@/components/pdf-export"
import { PenIcon, StampIcon, SaveIcon } from "lucide-react"

export default function PaseTraficoForm() {
  const formRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    folio: "",
    razonSocial: "",
    fecha: "",
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

  const [activeSection, setActiveSection] = useState<"firma" | "sello" | null>(null)
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSignatureSave = (signatureData: string) => {
    setFormData((prev) => ({
      ...prev,
      firma: signatureData,
    }))
    setActiveSection(null)
  }

  const handleSealSave = (sealData: string) => {
    setFormData((prev) => ({
      ...prev,
      sello: sealData,
    }))
    setActiveSection(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Datos del formulario:", formData)
    // Aquí puedes agregar la lógica para enviar los datos
    setIsFormSubmitted(true)
    alert("Formulario guardado con éxito")
  }

  const isFormComplete = formData.firma && formData.sello

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-white">Pase de Salida Tráfico</h1>
        <div className="flex gap-2">
          <PdfExport
            contentRef={formRef}
            fileName={`pase-salida-${formData.folio || "sin-folio"}`}
            disabled={!isFormComplete}
          />
          <Button
            type="submit"
            form="pase-form"
            className="bg-blue-700 hover:bg-blue-800 flex items-center gap-2"
            disabled={!isFormComplete}
          >
            <SaveIcon className="h-4 w-4" />
            Guardar
          </Button>
        </div>
      </div>

      <Card className="w-full bg-white shadow-xl">
        <div ref={formRef}>
          <CardHeader className="bg-gray-900 text-white p-4 flex flex-row items-center space-y-0 gap-4">
            <div className="bg-white p-2 rounded">
              <h2 className="text-gray-900 font-bold">PEPSICO</h2>
            </div>
            <div className="flex-1 text-center">
              <h1 className="text-xl font-bold">PASE DE SALIDA TRAFICO</h1>
            </div>
            <div className="text-right">
              <p className="text-sm">FOLIO:</p>
              <Input
                name="folio"
                value={formData.folio}
                onChange={handleChange}
                className="bg-white text-black h-8 mt-1"
              />
            </div>
          </CardHeader>

          <div className="bg-gray-100 p-2 text-center border-b">
            <h3 className="font-medium">AZCAPOTZALCO</h3>
          </div>

          <CardContent className="p-6">
            <form id="pase-form" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="razonSocial">RAZÓN SOCIAL:</Label>
                  <Input
                    id="razonSocial"
                    name="razonSocial"
                    value={formData.razonSocial}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="fecha">FECHA:</Label>
                  <Input
                    id="fecha"
                    name="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="border p-4 rounded-md">
                  <h3 className="font-bold text-center mb-4">TRACTOR</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tractorEco">ECO</Label>
                      <Input
                        id="tractorEco"
                        name="tractorEco"
                        value={formData.tractorEco}
                        onChange={handleChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tractorPlaca">PLACA</Label>
                      <Input
                        id="tractorPlaca"
                        name="tractorPlaca"
                        value={formData.tractorPlaca}
                        onChange={handleChange}
                        className="mt-1"
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
                    <Label htmlFor="operadorNombre">NOMBRE(S)</Label>
                    <Input
                      id="operadorNombre"
                      name="operadorNombre"
                      value={formData.operadorNombre}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="operadorApellidoPaterno">APELLIDO PATERNO</Label>
                    <Input
                      id="operadorApellidoPaterno"
                      name="operadorApellidoPaterno"
                      value={formData.operadorApellidoPaterno}
                      onChange={handleChange}
                      className="mt-1"
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

              <div className="border-t pt-6 mt-6">
                <div className="text-center mb-4">
                  <p className="font-bold">AUTORIZA FACILITADOR DE TRANSPORTE</p>
                  <p className="text-sm mt-2">FIRMA Y SELLO</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {/* Sección de Firma */}
                  <div className="border p-4 rounded-md">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <PenIcon className="h-4 w-4" /> Firma Digital
                      </h3>
                      {formData.firma && activeSection !== "firma" && (
                        <Button type="button" variant="outline" size="sm" onClick={() => setActiveSection("firma")}>
                          Cambiar
                        </Button>
                      )}
                    </div>

                    {activeSection === "firma" ? (
                      <SignaturePad onSave={handleSignatureSave} />
                    ) : formData.firma ? (
                      <div className="flex justify-center border bg-white p-2">
                        <img src={formData.firma || "/placeholder.svg"} alt="Firma digital" className="max-h-32" />
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <Button
                          type="button"
                          onClick={() => setActiveSection("firma")}
                          className="bg-blue-700 hover:bg-blue-800"
                        >
                          Agregar Firma
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Sección de Sello */}
                  <div className="border p-4 rounded-md">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <StampIcon className="h-4 w-4" /> Sello Digital
                      </h3>
                      {formData.sello && activeSection !== "sello" && (
                        <Button type="button" variant="outline" size="sm" onClick={() => setActiveSection("sello")}>
                          Cambiar
                        </Button>
                      )}
                    </div>

                    {activeSection === "sello" ? (
                      <SealUpload onSave={handleSealSave} />
                    ) : formData.sello ? (
                      <div className="flex justify-center border bg-white p-2">
                        <img src={formData.sello || "/placeholder.svg"} alt="Sello digital" className="max-h-32" />
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <Button
                          type="button"
                          onClick={() => setActiveSection("sello")}
                          className="bg-blue-700 hover:bg-blue-800"
                        >
                          Agregar Sello
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center text-sm text-gray-600 mt-6">
                  <p>ESTE PASE NO ES VÁLIDO SI NO CONTIENE FIRMA Y SELLO DEL AUTORIZANTE</p>
                </div>
              </div>
            </form>
          </CardContent>
        </div>
      </Card>

      {isFormSubmitted && (
        <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-md text-green-800">
          <p className="font-medium">¡Formulario guardado correctamente!</p>
          <p className="text-sm mt-1">Puedes exportar el pase de salida a PDF usando el botón "Exportar a PDF".</p>
        </div>
      )}
    </div>
  )
}
