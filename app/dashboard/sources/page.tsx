"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { SourceManager } from "@/app/components/editor/SourceManager"
import { useSourceContext } from "@/app/context/SourceContext"
import { Spinner } from "@/components/ui/spinner"

export default function SourcesPage() {
  const { loading } = useSourceContext()
  const [showAddSheet, setShowAddSheet] = useState(false)

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quellen</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Quellen und Referenzen
          </p>
        </div>
        <Button onClick={() => setShowAddSheet(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Neue Quelle
        </Button>
      </div>

      <SourceManager 
        showAddSheet={showAddSheet}
        setShowAddSheet={setShowAddSheet}
      />
    </div>
  )
} 