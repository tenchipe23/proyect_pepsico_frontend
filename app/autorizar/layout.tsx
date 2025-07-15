import type React from "react"

export default function AutorizarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-700 p-4 overflow-hidden">
      <div className="container mx-auto px-4 py-6">
        {children}
      </div>
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,rgba(30,64,175,0.15),transparent_50%)]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(30,64,175,0.15),transparent_50%)]" />
    </div>
  )
}
