"use client"

import { DashboardNav } from "@/app/components/dashboard/DashboardNav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden ">
      <DashboardNav />
      <main className="flex-1 flex flex-col overflow-hidden h-screen">
        {children}
      </main>
    </div>
  )
} 