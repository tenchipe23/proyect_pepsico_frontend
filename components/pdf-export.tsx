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
  className?: string
  onStart?: () => void
  onFinish?: () => void
}

export default function PdfExport({ contentRef, fileName = "pase-de-salida", disabled = false, className = "", onStart, onFinish }: PdfExportProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePdf = async () => {
    if (!contentRef.current) return

    try {
      setIsGenerating(true)

      // Crear una copia del elemento para manipularlo sin afectar la UI
      const element = contentRef.current
      
      // Aplicar estilos temporales para el PDF
      const originalStyle = element.style.cssText
      element.style.cssText += `
        transform: scale(1);
        transform-origin: center;
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        padding: 0;
        font-size: 12px;
        line-height: 1.2;
        box-sizing: border-box;
      `

      // Configurar opciones para html2canvas optimizadas para una página
      const options = {
        scale: 2.5, // Mayor escala para mejor calidad
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        imageTimeout: 5000, // Esperar hasta 5 segundos para cargar imágenes
        allowTaint: true // Permitir imágenes del mismo origen sin CORS
      }

      onStart?.();
      await new Promise(resolve => setTimeout(resolve, 2000)); // Retraso extendido para permitir re-render y actualización DOM
      // Crear un clon del elemento para modificarlo sin afectar la UI visible
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.width = `${element.scrollWidth}px`;
      clone.style.height = `${element.scrollHeight}px`;
      document.body.appendChild(clone);

      // Ocultar todos los elementos con clase hide-in-pdf en el clon
      const hideInPdfElements = clone.querySelectorAll('.hide-in-pdf, [data-pdf-hide="true"], #modify-button-container');
      hideInPdfElements.forEach((element) => {
        (element as HTMLElement).style.display = 'none';
        (element as HTMLElement).remove(); // Eliminar completamente del DOM
      });
      
      // Buscar y eliminar específicamente el botón de modificar firma
      const modifyButtons = clone.querySelectorAll('button');
      modifyButtons.forEach((button) => {
        if (button.textContent?.includes('Modificar Firma y Sello') || 
            button.innerHTML?.includes('Modificar Firma y Sello') || 
            button.innerHTML?.includes('Modificar Firma y Sello')) {
          // Eliminar el botón y su contenedor padre
          let parent = button.parentElement;
          while (parent && parent.tagName !== 'BODY') {
            if (parent.id === 'modify-button-container' || parent.classList.contains('hide-in-pdf')) {
              parent.remove();
              break;
            }
            const nextParent = parent.parentElement;
            if (!nextParent || nextParent.tagName === 'BODY') {
              button.remove(); // Si no encontramos un contenedor específico, eliminamos solo el botón
              break;
            }
            parent = nextParent;
          }
        }
      });
      
      // Eliminar cualquier elemento que contenga el texto "Modificar Firma"
      const allElements = clone.querySelectorAll('*');
      allElements.forEach((el) => {
        if (el.textContent?.includes('Modificar Firma y Sello') || el.textContent?.includes('Modificar firma y sello')) {
          el.remove();
        }
      });

      // Agregar clase al documento para ocultar elementos durante la exportación
      document.body.classList.add('pdf-export-in-progress');
      
      // Capturar el clon como imagen
      clone.classList.add('exporting-pdf');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Retraso adicional para carga
      
      // Ya hemos eliminado los elementos que queremos ocultar en el paso anterior
      // No necesitamos hacer más eliminaciones aquí
      
      const canvas = await html2canvas(clone, options);
      clone.classList.remove('exporting-pdf');
      document.body.classList.remove('pdf-export-in-progress');
      document.body.removeChild(clone);
      onFinish?.();
      
      // Restaurar estilos originales
      element.style.cssText = originalStyle;

      // Calcular dimensiones para el PDF (Letter) - optimizado para una sola página
      const imgData = canvas.toDataURL("image/png", 1.0) // Máxima calidad
      const pdfWidth = 250 // Letter width in mm
      const pdfHeight = 275 // Letter height in mm
      const margin = 1 // Margen en mm (reducido para aprovechar más espacio)
      const contentWidth = pdfWidth - (margin)
      const contentHeight = pdfHeight - (margin)
      
      // Calcular la escala para ajustar a una página
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const scaleX = contentWidth / (imgWidth * 0.264583) // Convertir px a mm
      const scaleY = contentHeight / (imgHeight * 0.264583)
      const scale = Math.min(scaleX, scaleY, 0.98) // Reducir solo un poco para asegurar márgenes
      
      const finalWidth = (imgWidth * 0.264583) * scale
      const finalHeight = (imgHeight * 0.264583) * scale
      
      // Centrar el contenido perfectamente
      const xOffset = margin + (contentWidth - finalWidth) / 2
      const yOffset = margin

      // Crear nuevo documento PDF con tamaño Letter
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "letter",
        compress: true,
        hotfixes: ["px_scaling"] // Mejora la escala de píxeles
      })

      // Añadir la imagen centrada al PDF con mejor calidad
      pdf.addImage(imgData, "PNG", xOffset, yOffset, finalWidth, finalHeight, undefined, 'FAST')
      
      // Optimizar el PDF
      pdf.setProperties({
        title: `${fileName}`,
        subject: "Pase de Salida PepsiCo",
        creator: "Sistema de Pases PepsiCo",
        keywords: "pase, salida, pepsico"
      })

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
      className={`bg-green-600 text-white border-none hover:bg-green-700 font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2 ${className} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
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
