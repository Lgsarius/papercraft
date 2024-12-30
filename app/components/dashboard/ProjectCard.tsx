"use client"

import { Project } from "@/app/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Calendar, BookOpen, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { deleteDoc, doc } from "firebase/firestore"
import { db } from "@/app/firebase/config"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function ProjectCard({ project }: { project: Project }) {
  const router = useRouter()

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "projects", project.id))
      router.refresh()
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  const statusColors = {
    draft: "bg-gray-500",
    in_progress: "bg-blue-500",
    review: "bg-yellow-500",
    completed: "bg-green-500",
  }

  const statusLabels = {
    draft: "Entwurf",
    in_progress: "In Bearbeitung",
    review: "In Überprüfung",
    completed: "Abgeschlossen",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{project.title}</span>
          <span
            className={`${
              statusColors[project.status]
            } text-white text-xs px-2 py-1 rounded`}
          >
            {statusLabels[project.status]}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-muted-foreground">{project.description}</p>
        {project.subject && (
          <div className="flex items-center text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4 mr-2" />
            {project.subject}
          </div>
        )}
        {project.deadline && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            Abgabe: {project.deadline.toLocaleDateString()}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/dashboard/projects/${project.id}`)}
        >
          <FileText className="h-4 w-4 mr-2" />
          Öffnen
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/dashboard/edit/${project.id}`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Bearbeiten
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Löschen
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
              <AlertDialogDescription>
                Diese Aktion kann nicht rückgängig gemacht werden. Die Hausarbeit
                wird permanent gelöscht.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Löschen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
} 