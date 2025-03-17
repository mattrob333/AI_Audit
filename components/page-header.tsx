'use client'

interface PageHeaderProps {
  heading: string
  subheading?: string
}

export function PageHeader({ heading, subheading }: PageHeaderProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold text-neutral-200">{heading}</h1>
      {subheading && (
        <p className="text-sm text-neutral-400">{subheading}</p>
      )}
    </div>
  )
}
