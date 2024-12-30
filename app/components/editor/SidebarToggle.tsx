"use client"

import { Button } from "@/components/ui/button"
import { PanelRightClose, PanelRightOpen } from "lucide-react"

interface SidebarToggleProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function SidebarToggle({ isCollapsed, onToggle }: SidebarToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="absolute right-0 top-2 -translate-x-1/2 z-10"
      onClick={onToggle}
    >
      {isCollapsed ? (
        <PanelRightOpen className="h-4 w-4" />
      ) : (
        <PanelRightClose className="h-4 w-4" />
      )}
    </Button>
  )
} 