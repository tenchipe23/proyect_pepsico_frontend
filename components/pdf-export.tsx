"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileIcon, LoaderIcon } from "lucide-react"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

interface PdfExportProps {
  contentRef: React.RefObject<HTMLDivElement>
  fileName?: string
  disabled?: boolean
}

export default function PdfExport({ contentRef, fileName = "pase-de-salida", disabled = false }: PdfExportProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePdf = async () => {
    if (!contentRef.current) return

    try {
      setIsGenerating(true)

      // Crear una copia del elemento para manipularlo sin afectar la UI
      const element = contentRef.current

      // Configurar opciones para html2canvas
      const options = {
        scale: 2, // Mayor escala para mejor calidad
        useCORS: true, // Permitir imágenes de otros dominios
        logging: false,
        backgroundColor: "#ffffff",
      }

      // Capturar el contenido como imagen
      const canvas = await html2canvas(element, options)

      // Calcular dimensiones para el PDF (A4)
      const imgData = canvas.toDataURL("image/png")
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Crear nuevo documento PDF
      const pdf = new jsPDF("p", "mm", "a4")

      // Añadir la imagen al PDF
      let heightLeft = imgHeight
      let position = 0

      // Primera página
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Si el contenido es más largo que una página, añadir más páginas
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Guardar el PDF
      pdf.save(`${fileName}-${new Date().toISOString().split("T")[0]}.pdf`)
    } catch (error) {
      console.error("Error al generar el PDF:", error)
      alert("Ocurrió un error al generar el PDF. Por favor, intente nuevamente.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      type="button"
      onClick={generatePdf}
      disabled={disabled || isGenerating}
      variant="outline"
      className="flex items-center gap-2"
    >
      {isGenerating ? (
        <>
          <LoaderIcon className="h-4 w-4 animate-spin" />
          Generando PDF...
        </>
      ) : (
        <>
          <FileIcon className="h-4 w-4" />
          Exportar a PDF
        </>
      )}
    </Button>
  )
}
