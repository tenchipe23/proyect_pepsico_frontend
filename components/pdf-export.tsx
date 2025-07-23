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
        transform-origin: top left;
        width: 100%;
        max-width: none;
        margin: 0;
        padding: 10mm;
        font-size: 10pt;
        line-height: 1.4;
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
      
      // Forzar vista de seguridad: eliminar botones de autorización, rechazo, edición y cualquier elemento no visible en seguridad
      const actionButtons = clone.querySelectorAll('button');
      actionButtons.forEach((button) => {
        const text = button.textContent?.toLowerCase() || '';
        if (text.includes('autorizar') || text.includes('rechazar') || text.includes('editar') || text.includes('modificar firma y sello') || text.includes('guardar cambios') || text.includes('eliminar pase')) {
          let parent = button.parentElement;
          while (parent && parent.tagName !== 'BODY') {
            if (parent.classList.contains('card-footer') || parent.id === 'modify-button-container' || parent.classList.contains('hide-in-pdf')) {
              parent.remove();
              break;
            }
            parent = parent.parentElement;
          }
          if (!parent) {
            button.remove();
          }
        }
      });

      // Eliminar footers o secciones de acciones
      const footers = clone.querySelectorAll('.card-footer, [class*="footer"]');
      footers.forEach((footer) => {
        footer.remove();
      });

      // Eliminar cualquier elemento restante con texto de acciones
      const allElements = clone.querySelectorAll('*');
      allElements.forEach((el) => {
        const text = el.textContent?.toLowerCase() || '';
        if (text.includes('autorizar') || text.includes('rechazar') || text.includes('editar') || text.includes('modificar') || text.includes('eliminar')) {
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
      const pdfWidth = 215.9 // Letter width in mm (8.5 inches)
      const pdfHeight = 279.4 // Letter height in mm (11 inches)
      const margin = 0// Margen en mm
      const contentWidth = pdfWidth - (2 * margin)
      const contentHeight = pdfHeight - (2 * margin)
      
      // Calcular la escala para ajustar a una página
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const scaleX = contentWidth / (imgWidth * 0.264583) // Convertir px a mm
      const scaleY = contentHeight / (imgHeight * 0.264583)
      const scale = scaleX // Llenar el ancho completo
      
      const finalWidth = (imgWidth * 0.264583) * scale
      const finalHeight = (imgHeight * 0.264583) * scale
      
      // Centrar el contenido perfectamente
      const xOffset = margin
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
      pdf.addImage(imgData, "PNG", xOffset, yOffset, finalWidth, finalHeight, undefined, 'SLOW') // Usar compresión lenta para mejor calidad
      
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
