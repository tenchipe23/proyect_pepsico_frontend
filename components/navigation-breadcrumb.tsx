"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href: string
  active: boolean
}

export default function NavigationBreadcrumb() {
  const pathname = usePathname()

  // Generar los elementos del breadcrumb basados en la ruta actual
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    // Inicio siempre presente
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Inicio", href: "/", active: pathname === "/" }]

    // Dividir la ruta en segmentos
    const segments = pathname.split("/").filter(Boolean)

    // Si no hay segmentos, solo mostrar inicio
    if (segments.length === 0) return breadcrumbs

    // Construir las rutas acumulativas
    let currentPath = ""

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`

      // Determinar la etiqueta basada en el segmento
      let label = segment.charAt(0).toUpperCase() + segment.slice(1)

      // Casos especiales
      if (segment === "autorizar" && segments.length === 1) {
        label = "Autorización"
      } else if (segment === "autorizar" && segments.length > 1) {
        label = "Autorización"
      } else if (segment === "dashboard") {
        label = "Panel de Control"
      } else if (segments[index - 1] === "autorizar" && segment.length > 8) {
        // Si es un ID de pase (después de /autorizar/)
        label = "Detalle de Pase"
      }

      breadcrumbs.push({
        label,
        href: currentPath,
        active: currentPath === pathname,
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Si solo tenemos el inicio, no mostrar breadcrumbs
  if (breadcrumbs.length <= 1) return null

  return (
    <nav className="flex items-center text-sm text-white/80 mb-4">
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1 text-white/60" />}

            {breadcrumb.active ? (
              <span className="font-medium text-white">{breadcrumb.label}</span>
            ) : (
              <Link href={breadcrumb.href} className="hover:text-white transition-colors">
                {index === 0 ? (
                  <span className="flex items-center">
                    <Home className="h-3.5 w-3.5 mr-1" />
                    {breadcrumb.label}
                  </span>
                ) : (
                  breadcrumb.label
                )}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
