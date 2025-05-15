import type React from "react"
import NavigationBreadcrumb from "@/components/navigation-breadcrumb"

export default function AutorizarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <NavigationBreadcrumb />
      {children}
    </div>
  )
}
