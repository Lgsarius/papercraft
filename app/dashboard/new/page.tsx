"use client"

import { ProjectForm } from "@/app/components/dashboard/ProjectForm"

export default function NewProjectPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Neue Hausarbeit erstellen</h1>
      <ProjectForm mode="create" />
    </div>
  )
} 