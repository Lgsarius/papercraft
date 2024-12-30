"use client"

import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore"
import { auth, db } from "../firebase/config"
import { Project } from "../types"
import { ProjectCard } from "../components/dashboard/ProjectCard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"

export default function DashboardPage() {
  const [user] = useAuthState(auth)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, "projects"),
      where("userId", "==", user.uid),
      orderBy("updatedAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
        deadline: doc.data().deadline?.toDate(),
      })) as Project[]

      setProjects(projectsData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  if (loading) {
    return <Spinner />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Meine Hausarbeiten</h1>
        <Button onClick={() => router.push('/dashboard/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Neue Arbeit
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Sie haben noch keine Hausarbeiten erstellt.
          </p>
          <Button onClick={() => router.push('/dashboard/new')}>
            Erste Hausarbeit erstellen
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
} 