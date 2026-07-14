"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface MenuItem {
  icon: LucideIcon | React.FC
  label: string
  href: string
  gradient: string
  iconColor: string
  sectionId?: string
}

interface MenuBarProps {
  className?: string
  items: MenuItem[]
  activeItem?: string
  onItemClick?: (id: string, href: string) => void
}

const itemVariants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
}

const backVariants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
}

const glowVariants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
      scale: { duration: 0.5, type: "spring" as const, stiffness: 300, damping: 25 },
    },
  },
}

const navGlowVariants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
}

const sharedTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  duration: 0.5,
}

export const MenuBar = React.forwardRef<HTMLDivElement, MenuBarProps>(
  ({ className, items, activeItem, onItemClick }, ref) => {
    return (
      <motion.nav
        ref={ref}
        className={cn("p-2 rounded-2xl backdrop-blur-lg shadow-lg relative overflow-hidden", className)}
        style={{
          background: "linear-gradient(to bottom, rgba(23,23,26,0.9), rgba(23,23,26,0.65))",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
        initial="initial"
        whileHover="hover"
      >
        {/* Nav-level glow: blue → purple → red sweep on hover */}
        <motion.div
          className="absolute -inset-2 rounded-3xl z-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(96,165,250,0.18) 0%, transparent 50%), " +
              "radial-gradient(ellipse at 60% 50%, rgba(167,139,250,0.15) 0%, transparent 50%), " +
              "radial-gradient(ellipse at 90% 50%, rgba(248,113,113,0.12) 0%, transparent 50%)",
          }}
          variants={navGlowVariants}
        />

        <ul className="flex items-center gap-1 relative z-10">
          {items.map((item) => {
            const Icon = item.icon
            const id = item.sectionId ?? item.label
            const isActive = id === activeItem

            return (
              <motion.li key={id} className="relative">
                <a
                  href={item.href}
                  onClick={() => onItemClick?.(id, item.href)}
                  className="block"
                >
                  <motion.div
                    className="block rounded-xl overflow-visible group relative"
                    style={{ perspective: "600px" }}
                    whileHover="hover"
                    initial="initial"
                  >
                    {/* Per-item radial glow */}
                    <motion.div
                      className="absolute inset-0 z-0 pointer-events-none rounded-2xl"
                      variants={glowVariants}
                      animate={isActive ? "hover" : "initial"}
                      style={{ background: item.gradient }}
                    />

                    {/* Front face */}
                    <motion.div
                      className="flex items-center gap-2 px-4 py-2 relative z-10 bg-transparent rounded-xl"
                      style={{
                        color: isActive ? "rgba(242,239,233,1)" : "rgba(242,239,233,0.45)",
                        transition: "color 0.2s",
                      }}
                      variants={itemVariants}
                      transition={sharedTransition}
                      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "rgba(242,239,233,1)" }}
                      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "rgba(242,239,233,0.45)" }}
                    >
                      <span
                        className={cn("transition-colors duration-300 h-5 w-5 flex items-center justify-center", isActive ? item.iconColor : "")}
                        style={!isActive ? { color: "rgba(242,239,233,0.55)" } : undefined}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-medium tracking-wide">{item.label}</span>
                    </motion.div>

                    {/* Back face (flips in on hover) */}
                    <motion.div
                      className="flex items-center gap-2 px-4 py-2 absolute inset-0 z-10 bg-transparent rounded-xl"
                      style={{ color: "rgba(242,239,233,1)" }}
                      variants={backVariants}
                      transition={sharedTransition}
                    >
                      <span className={cn("transition-colors duration-300 h-5 w-5 flex items-center justify-center", item.iconColor)}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-medium tracking-wide">{item.label}</span>
                    </motion.div>
                  </motion.div>
                </a>
              </motion.li>
            )
          })}
        </ul>
      </motion.nav>
    )
  },
)

MenuBar.displayName = "MenuBar"
