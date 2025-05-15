import type React from "react"

interface AppHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

export default function AppHeader({ title, description, actions }: AppHeaderProps) {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
        {description && <p className="text-white/80">{description}</p>}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  )
}
