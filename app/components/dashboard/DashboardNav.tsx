"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  FileText,
  BookOpen,
  Settings,
  FolderOpen,
  Home,
} from "lucide-react"

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },

  {
    title: "Quellen",
    href: "/dashboard/sources",
    icon: BookOpen,
  },
  {
    title: "Vorlagen",
    href: "/dashboard/templates",
    icon: FolderOpen,
  },
  {
    title: "Einstellungen",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

interface DashboardNavProps {
  collapsed: boolean
}

export function DashboardNav({ collapsed }: DashboardNavProps) {
  const pathname = usePathname()

  return (
    <nav className="space-y-1 p-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
            pathname === item.href ? "bg-accent" : "transparent",
            collapsed ? "justify-center" : ""
          )}
        >
          <item.icon className="h-4 w-4" />
          {!collapsed && <span>{item.title}</span>}
        </Link>
      ))}
    </nav>
  )
} 