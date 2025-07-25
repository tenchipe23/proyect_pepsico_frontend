"use client"

import { Loader2Icon } from "lucide-react"
import { useEffect, useState } from "react"

interface LoadingIndicatorProps {
  text?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function LoadingIndicator({ text = "Cargando...", size = "md", className = "" }: LoadingIndicatorProps) {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }[size]

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`} suppressHydrationWarning>
      {isMounted ? (
        <>
          <Loader2Icon className={`${sizeClass} text-white animate-spin`} suppressHydrationWarning />
          {text && <p className="text-white font-medium" suppressHydrationWarning>{text}</p>}
        </>
      ) : null}
    </div>
  )
}
