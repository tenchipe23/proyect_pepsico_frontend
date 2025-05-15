"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { usePase } from "@/context/pase-context"

interface NotificationBadgeProps {
  className?: string
}

export default function NotificationBadge({ className }: NotificationBadgeProps) {
  const { pases } = usePase()
  const [count, setCount] = useState(0)
  const [hasNewNotifications, setHasNewNotifications] = useState(false)
  const [lastChecked, setLastChecked] = useState<string | null>(null)

  useEffect(() => {
    // Load last checked timestamp from localStorage
    const storedLastChecked = localStorage.getItem("lastNotificationCheck")
    if (storedLastChecked) {
      setLastChecked(storedLastChecked)
    } else {
      // If first time, set current time as last checked
      const now = new Date().toISOString()
      localStorage.setItem("lastNotificationCheck", now)
      setLastChecked(now)
    }
  }, [])

  useEffect(() => {
    if (!lastChecked) return

    // Count pending passes created after last check
    const pendingCount = pases.filter(
      (pase) => pase.estado === "pendiente" && new Date(pase.fechaCreacion) > new Date(lastChecked),
    ).length

    setCount(pendingCount)
    setHasNewNotifications(pendingCount > 0)
  }, [pases, lastChecked])

  // Update last checked time when user interacts with notifications
  const updateLastChecked = () => {
    const now = new Date().toISOString()
    localStorage.setItem("lastNotificationCheck", now)
    setLastChecked(now)
    setHasNewNotifications(false)
    setCount(0)
  }

  // Expose the update function to parent components
  useEffect(() => {
    // @ts-ignore - Adding a global function for simplicity
    window.updateNotificationLastChecked = updateLastChecked
  }, [])

  if (count === 0) return null

  return (
    <Badge className={`${className} ${hasNewNotifications ? "animate-pulse bg-red-500" : "bg-gray-500"}`}>
      {count}
    </Badge>
  )
}
