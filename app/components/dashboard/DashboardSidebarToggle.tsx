"use client"

import { Button } from "@/components/ui/button"
import { PanelLeftClose, PanelLeft } from "lucide-react"

interface DashboardSidebarToggleProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function DashboardSidebarToggle({
  isCollapsed,
  onToggle,
}: DashboardSidebarToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="absolute -right-4 top-4 h-8 w-8 rounded-full p-0"
      onClick={onToggle}
    >
      {isCollapsed ? (
        <PanelLeft className="h-4 w-4" />
      ) : (
        <PanelLeftClose className="h-4 w-4" />
      )}
    </Button>
  )
} 