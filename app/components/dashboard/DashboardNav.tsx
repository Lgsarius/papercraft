"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BurgerMenu } from "@/components/ui/burger-menu"
import {
  FileText,
  FolderOpen,
  Settings,
  LogOut,
  Plus,
  Home,
  BookOpen,
  Calendar,
} from "lucide-react"
import { auth } from "@/app/firebase/config"
import { signOut } from "firebase/auth"
import { toast } from "sonner"

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Projekte",
    href: "/dashboard/projects",
    icon: FolderOpen,
  },
  {
    title: "Quellen",
    href: "/dashboard/sources",
    icon: BookOpen,
  },
  {
    title: "Kalender",
    href: "/dashboard/calendar",
    icon: Calendar,
  },
]

const bottomNavItems = [
  {
    title: "Einstellungen",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast.success("Erfolgreich abgemeldet")
    } catch (error) {
      toast.error("Fehler beim Abmelden")
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col min-h-screen border-r bg-background transition-all duration-300 ease-in-out flex-none",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex-none flex items-center justify-between h-14 px-4 border-b">
        <BurgerMenu
          variant="ghost"
          size="sm"
          isOpen={!isCollapsed}
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
        {!isCollapsed && (
          <span className="font-semibold">PaperCraft</span>
        )}
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto scrollbar-custom">
        <div className="flex-none p-4">
          <Button
            asChild
            className={cn(
              "w-full",
              isCollapsed && "px-0 justify-center"
            )}
          >
            <Link href="/dashboard/projects/new">
              <Plus className="h-4 w-4 mr-2" />
              {!isCollapsed && "Neues Projekt"}
            </Link>
          </Button>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent" : "transparent",
                isCollapsed && "justify-center"
              )}
            >
              <item.icon className="h-4 w-4" />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>

        <div className="flex-none px-2 py-4 mt-auto border-t">
          {bottomNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent" : "transparent",
                isCollapsed && "justify-center"
              )}
            >
              <item.icon className="h-4 w-4" />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm w-full transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isCollapsed && "justify-center"
            )}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span>Abmelden</span>}
          </button>
        </div>
      </div>
    </div>
  )
} 