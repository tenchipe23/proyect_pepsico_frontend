"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { usePase, type PaseData } from "@/context/pase-context"
import { SendIcon, Loader2Icon, FileTextIcon } from "lucide-react"
import SuccessDialog from "@/components/success-dialog"

export default function SolicitarPage() {
  const { addPase, loading } = usePase()
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [lastPase, setLastPase] = useState<PaseData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
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
      return
    }

    try {
      setIsSubmitting(true)

      // Create new pass
      const newPase = await addPase({
        ...formData,
        estado: "PENDIENTE",
      })

      if (newPase) {
        // Save the complete pass data for the success dialog
        setLastPase({
          ...formData,
          ...newPase,
          fecha: formData.fecha,
          estado: "PENDIENTE"
        })
        setShowSuccessDialog(true)
      } else {
        console.error("No se recibieron datos del pase creado")
      }
    } catch (error) {
      console.error("Error creating pass:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false)
    resetForm()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-white p-3 rounded-full shadow-lg">
              <FileTextIcon className="h-8 w-8 text-blue-700" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Solicitud de Pase de Salida
            </h1>
          </div>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Complete el formulario para solicitar un nuevo pase de salida de tráfico.
            Todos los campos marcados con <span className="text-red-300 font-semibold">*</span> son obligatorios.
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="shadow-2xl border-0 overflow-hidden bg-white">
          {/* Enhanced Header */}
          <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-lg shadow-md">
                  <div className="text-gray-900 font-bold text-lg tracking-wide">PEPSICO</div>
                </div>
                <div className="border-l border-gray-600 pl-4">
                  <h2 className="text-2xl font-bold tracking-wide uppercase">Pase de Salida Tráfico</h2>
                  <p className="text-gray-300 text-sm mt-1">Formulario de Solicitud</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300 mb-2">FOLIO:</p>
                <div className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold text-lg shadow-md">
                  {formData.folio}
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Location Banner */}
          <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-4 text-center border-b border-blue-200 shadow-sm">
            <h3 className="font-bold text-blue-800 text-lg tracking-wide uppercase">AZCAPOTZALCO</h3>
          </div>

          <CardContent className="p-8 bg-gray-50">
            <form id="solicitud-form" onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200 uppercase tracking-wide">
                  Información General
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="razonSocial" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      RAZÓN SOCIAL <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="razonSocial"
                      name="razonSocial"
                      value={formData.razonSocial}
                      onChange={handleChange}
                      className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                      placeholder="Ingrese la razón social"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fecha" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      FECHA <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fecha"
                      name="fecha"
                      type="date"
                      value={formData.fecha}
                      onChange={handleChange}
                      className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Vehicles Section */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200 uppercase tracking-wide">
                  Información de Vehículos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Tractor */}
                  <div className="print:bg-gradient-to-br print:from-blue-50 print:to-blue-100 p-5 rounded-lg border-2 print:border-blue-200 shadow-sm">
                    <h4 className="font-bold text-center mb-4 print:text-blue-800 text-lg uppercase tracking-wide border-b border-black-300 pb-2">
                      TRACTOR
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="tractorEco" className="text-sm font-semibold print:text-blue-700 uppercase">
                          ECO <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="tractorEco"
                          name="tractorEco"
                          value={formData.tractorEco}
                          onChange={handleChange}
                          className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base text-center"
                          placeholder="ECO"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="tractorPlaca" className="text-sm font-semibold print:text-blue-700 uppercase">
                          PLACAS <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="tractorPlaca"
                          name="tractorPlaca"
                          value={formData.tractorPlaca}
                          onChange={handleChange}
                          className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base text-center"
                          placeholder="PLACAS"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Remolque 1 */}
                  <div className="p-5 rounded-lg border-2 shadow-sm">
                    <h4 className="font-bold text-center mb-4 text-lg uppercase tracking-wide border-b pb-2">
                      REMOLQUE 1
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="remolque1Eco" className="text-sm font-semibold uppercase">ECO</Label>
                        <Input
                          id="remolque1Eco"
                          name="remolque1Eco"
                          value={formData.remolque1Eco}
                          onChange={handleChange}
                          className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base text-center"
                          placeholder="ECO"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="remolque1Placa" className="text-sm font-semibold uppercase">PLACAS</Label>
                        <Input
                          id="remolque1Placa"
                          name="remolque1Placa"
                          value={formData.remolque1Placa}
                          onChange={handleChange}
                          className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base text-center"
                          placeholder="PLACAS"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Remolque 2 */}
                  <div className="p-5 rounded-lg border-2 shadow-sm">
                    <h4 className="font-bold text-center mb-4 text-lg uppercase tracking-wide border-b pb-2">
                      REMOLQUE 2
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="remolque2Eco" className="text-sm font-semibold uppercase">ECO</Label>
                        <Input
                          id="remolque2Eco"
                          name="remolque2Eco"
                          value={formData.remolque2Eco}
                          onChange={handleChange}
                          className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base text-center"
                          placeholder="ECO"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="remolque2Placa" className="text-sm font-semibold uppercase">PLACAS</Label>
                        <Input
                          id="remolque2Placa"
                          name="remolque2Placa"
                          value={formData.remolque2Placa}
                          onChange={handleChange}
                          className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base text-center"
                          placeholder="PLACAS"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Operator and Dolly Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Operator */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200 uppercase tracking-wide">
                    Información del Operador
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="operadorNombre" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        NOMBRE(S) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="operadorNombre"
                        name="operadorNombre"
                        value={formData.operadorNombre}
                        onChange={handleChange}
                        className="mt-2 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                        placeholder="Nombre(s) del operador"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="operadorApellidoPaterno" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        APELLIDO PATERNO <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="operadorApellidoPaterno"
                        name="operadorApellidoPaterno"
                        value={formData.operadorApellidoPaterno}
                        onChange={handleChange}
                        className="mt-2 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                        placeholder="Apellido paterno"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="operadorApellidoMaterno" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        APELLIDO MATERNO
                      </Label>
                      <Input
                        id="operadorApellidoMaterno"
                        name="operadorApellidoMaterno"
                        value={formData.operadorApellidoMaterno}
                        onChange={handleChange}
                        className="mt-2 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                        placeholder="Apellido materno (opcional)"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Dolly */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200 uppercase tracking-wide">
                    Información del Dolly
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ecoDolly" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">ECO DOLLY</Label>
                      <Input
                        id="ecoDolly"
                        name="ecoDolly"
                        value={formData.ecoDolly}
                        onChange={handleChange}
                        className="mt-2 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base text-center"
                        placeholder="ECO del dolly"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="placasDolly" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">PLACAS DOLLY</Label>
                      <Input
                         id="placasDolly"
                        name="placasDolly"
                        value={formData.placasDolly}
                        onChange={handleChange}
                        className="mt-2 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base text-center"
                        placeholder="Placas del dolly"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200 uppercase tracking-wide">
                  Comentarios Adicionales
                </h3>
                <div>
                  <Label htmlFor="comentarios" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    COMENTARIOS
                  </Label>
                  <Textarea
                    id="comentarios"
                    name="comentarios"
                    value={formData.comentarios}
                    onChange={handleChange}
                    className="mt-2 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[120px] text-base"
                    placeholder="Ingrese cualquier comentario adicional sobre el pase de salida..."
                    rows={4}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-3 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2Icon className="h-6 w-6 animate-spin" />
                      Enviando Solicitud...
                    </>
                  ) : (
                    <>
                      <SendIcon className="h-6 w-6" />
                      Enviar Solicitud
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="bg-gradient-to-r from-gray-100 to-gray-50 p-6 text-center border-t border-gray-200">
            <div className="w-full">
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-semibold">Aviso de Privacidad:</span> Al enviar este formulario, acepta que los datos proporcionados 
                sean utilizados exclusivamente para el proceso de autorización de salida de tráfico conforme a las políticas de la empresa.
              </p>
            </div>
          </CardFooter>
        </Card>

        {showSuccessDialog && lastPase && (
          <SuccessDialog
            onClose={handleCloseSuccessDialog}
            pase={lastPase}
          />
        )}
      </div>
    </div>
  )
}