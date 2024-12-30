"use client"

import { useState } from "react"
import ProtectedRoute from "../components/auth/ProtectedRoute"
import { DashboardNav } from "../components/dashboard/DashboardNav"
import { DashboardSidebarToggle } from "../components/dashboard/DashboardSidebarToggle"
import { DashboardHeader } from "../components/dashboard/DashboardHeader"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col overflow-hidden bg-background">
        <DashboardHeader />
        <div className="flex-1 flex pt-16 overflow-hidden">
          <aside className={cn(
            "fixed left-0 top-16 bottom-0 z-20 bg-background border-r transition-all duration-300 overflow-y-auto",
            sidebarCollapsed ? "w-16" : "w-64"
          )}>
            <DashboardSidebarToggle
              isCollapsed={sidebarCollapsed}
              onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <DashboardNav collapsed={sidebarCollapsed} />
          </aside>
          <main className={cn(
            "flex-1 transition-all duration-300 overflow-y-auto",
            sidebarCollapsed ? "ml-16" : "ml-64"
          )}>
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
} 