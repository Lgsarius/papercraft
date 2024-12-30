"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/app/firebase/config"
import { Project } from "@/app/types"
import { ProjectForm } from "@/app/components/dashboard/ProjectForm"
import { Spinner } from "@/components/ui/spinner"

export default function EditProjectPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      if (!params.id) return

      try {
        const docRef = doc(db, "projects", params.id as string)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          setProject({
            id: docSnap.id,
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt.toDate(),
            updatedAt: docSnap.data().updatedAt.toDate(),
            deadline: docSnap.data().deadline?.toDate(),
          } as Project)
        }
      } catch (error) {
        console.error("Error fetching project:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Spinner />
      </div>
    )
  }

  if (!project) {
    return <div>Projekt nicht gefunden</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Hausarbeit bearbeiten</h1>
      <ProjectForm mode="edit" project={project} />
    </div>
  )
} 