"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/app/firebase/config"
import { Project } from "@/app/types"
import { TextEditor } from "@/app/components/editor/TextEditor"

import { SidebarToggle } from "@/app/components/editor/SidebarToggle"

import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { GrammarProvider } from "@/app/context/GrammarContext"


export default function ProjectEditorPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [assistantCollapsed, setAssistantCollapsed] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      if (!params.id) return

      try {
        const docRef = doc(db, "projects", params.id as string)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const projectData = {
            id: docSnap.id,
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt.toDate(),
            updatedAt: docSnap.data().updatedAt.toDate(),
            deadline: docSnap.data().deadline?.toDate(),
          } as Project
          setProject(projectData)
          setContent(projectData.content || "")
        }
      } catch (error) {
        console.error("Error fetching project:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [params.id])

  const handleContentChange = async (newContent: string) => {
    setContent(newContent)
    if (!project?.id) return

    try {
      const projectRef = doc(db, "projects", project.id)
      await updateDoc(projectRef, {
        content: newContent,
        updatedAt: new Date(),
      })
    } catch (error) {
      console.error("Error saving content:", error)
    }
  }

  const handleCitation = (citation: any) => {
    // Implementieren Sie hier die Logik zum Einfügen von Zitaten
    const citationText = `${citation.authors.join(", ")} (${citation.year})`
    // Fügen Sie das Zitat in den Editor ein
  }

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
    <GrammarProvider>
      <div className="h-[calc(100vh-7rem)] relative">
        <div className="flex h-full">
          <div className="flex-1 h-full overflow-hidden">
            <TextEditor 
              content={content} 
              onChange={handleContentChange} 
              projectId={params.id as string}
              sources={project?.sources || []}
            />
          </div>
          
        
          </div>
        </div>
      
    </GrammarProvider>
  )
} 