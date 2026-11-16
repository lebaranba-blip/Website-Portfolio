"use client"
import type { NavItem } from "@/lib/constants"

/** Plain text navigation: no icons, a thin gradient underline marks the current section */
export function TextNav({ items, activeItem, onItemClick }: {
  items: NavItem[]
  activeItem?: string
  onItemClick?: (id: string, href?: string) => void
}) {
  return (
    <ul className="text-nav">
      {items.map((item) => (
        <li key={item.sectionId}>
          <a
            href={item.href}
            data-active={activeItem === item.sectionId}
            aria-current={activeItem === item.sectionId ? "true" : undefined}
            onClick={(e) => { e.preventDefault(); onItemClick?.(item.sectionId, item.href) }}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  )
}
