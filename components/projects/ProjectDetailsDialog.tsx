"use client"

import { useState } from "react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/app/firebase/config"
import { Project } from "@/app/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { format } from "date-fns"

interface ProjectDetailsDialogProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (updatedProject: Project) => void
}

export function ProjectDetailsDialog({
  project,
  open,
  onOpenChange,
  onUpdate,
}: ProjectDetailsDialogProps) {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(project.title)
  const [subject, setSubject] = useState(project.subject || "")
  const [grade, setGrade] = useState(project.grade?.toString() || "")
  const [deadline, setDeadline] = useState(
    project.deadline ? format(project.deadline, "yyyy-MM-dd") : ""
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const projectRef = doc(db, "projects", project.id)
      const updates = {
        title,
        subject,
        grade: grade ? parseFloat(grade) : null,
        deadline: deadline ? new Date(deadline) : null,
        updatedAt: new Date(),
      }

      await updateDoc(projectRef, updates)
      
      onUpdate({
        ...project,
        ...updates,
      })
      
      toast.success("Projekt aktualisiert")
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating project:", error)
      toast.error("Fehler beim Aktualisieren")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Projekt bearbeiten</DialogTitle>
          <DialogDescription>
            Bearbeiten Sie die Details Ihres Projekts hier.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="subject">Fach</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="z.B. Mathematik"
              />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="grade">Note</Label>
              <Input
                id="grade"
                type="number"
                min="1.0"
                max="6.0"
                step="0.1"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="z.B. 1.7"
              />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="deadline">Abgabedatum</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Abbrechen
            </Button>
            <Button type="submit" disabled={loading}>
              Speichern
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 