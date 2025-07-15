import type React from "react"

interface AppHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  titleClassName?: string
  descriptionClassName?: string
}

export default function AppHeader({ 
  title, 
  description, 
  actions, 
  titleClassName,
  descriptionClassName
}: AppHeaderProps) {
  return (
    <div className="mb-6 flex flex-col md:flex-row justify-center items-center gap-4 max-w-8xl mx-auto px-1">
      <div className="text-center md:text-left flex-1">
        <h1 className={titleClassName || "text-white font-bold"}>{title}</h1>
        {description && <p className={descriptionClassName || "text-white/80"}>{description}</p>}
      </div>
      {actions && <div className="flex justify-center md:justify-end">{actions}</div>}
    </div>
  )
}
