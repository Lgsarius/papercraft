"use client"

import { useState, useEffect } from "react"
import { collection, query, where, onSnapshot, updateDoc, arrayUnion, arrayRemove, doc, getDoc, serverTimestamp } from "firebase/firestore"
import { db, auth } from "@/app/firebase/config"
import { Source } from "@/app/dashboard/sources/page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Quote, Plus, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function ProjectSources({ projectId, onCite }: { 
  projectId: string
  onCite: (citation: string) => void 
}) {
  const [sources, setSources] = useState<Source[]>([])
  const [projectSources, setProjectSources] = useState<string[]>([]) // IDs of sources used in this project
  const [search, setSearch] = useState("")
  const [content, setContent] = useState("")
  const router = useRouter()

  useEffect(() => {
    const user = auth.currentUser
    if (!user) return

    // Fetch all sources
    const sourcesQuery = query(
      collection(db, "sources"),
      where("userId", "==", user.uid)
    )

    const unsubscribe = onSnapshot(sourcesQuery, (snapshot) => {
      const sourcesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as Source[]

      sourcesData.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      setSources(sourcesData)
    })

    // Fetch project's content and sources
    const projectRef = doc(db, "projects", projectId)
    const projectUnsubscribe = onSnapshot(projectRef, (doc) => {
      if (doc.exists()) {
        setProjectSources(doc.data().sources || [])
        setContent(doc.data().content || "")
      }
    })

    return () => {
      unsubscribe()
      projectUnsubscribe()
    }
  }, [projectId])

  const toggleSource = async (sourceId: string) => {
    const projectRef = doc(db, "projects", projectId)
    const sourceRef = doc(db, "sources", sourceId)

    try {
      if (projectSources.includes(sourceId)) {
        // Remove source from project and update content immediately
        const updatedContent = content.replace(
          new RegExp(`<span[^>]*data-citation-id="${sourceId}"[^>]*>.*?</span>`, 'g'),
          ''
        )
        
        await Promise.all([
          updateDoc(projectRef, {
            sources: arrayRemove(sourceId),
            content: updatedContent,
            updatedAt: serverTimestamp()
          }),
          updateDoc(sourceRef, {
            projects: arrayRemove(projectId)
          })
        ])
      } else {
        // Add source to project
        await Promise.all([
          updateDoc(projectRef, {
            sources: arrayUnion(sourceId),
            updatedAt: serverTimestamp()
          }),
          updateDoc(sourceRef, {
            projects: arrayUnion(projectId)
          })
        ])
      }
    } catch (error) {
      console.error("Error toggling source:", error)
    }
  }

  const generateCitation = (source: Source) => {
    return `${source.authors.join(", ")} (${source.year})`
  }

  const handleCite = (source: Source) => {
    if (!projectSources.includes(source.id)) {
      return
    }
    
    const citation = `${source.authors[0].split(' ').pop()}, ${source.year}`
    onCite(`<span data-citation data-citation-id="${source.id}">(${citation})</span>`)
  }

  const filteredSources = sources.filter(source =>
    source.title.toLowerCase().includes(search.toLowerCase()) ||
    source.authors.join(", ").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Quellen</h2>
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/sources')}>
            <Plus className="h-4 w-4 mr-2" />
            Neue Quelle
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Quellen durchsuchen..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredSources.map(source => (
            <div
              key={source.id}
              className={cn(
                "flex items-center justify-between p-2 border rounded-lg hover:bg-muted/50",
                projectSources.includes(source.id) && "border-primary"
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{source.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {source.authors.join(", ")} ({source.year})
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => toggleSource(source.id)}
                >
                  {projectSources.includes(source.id) ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleCite(source)}
                  className={!projectSources.includes(source.id) ? 'opacity-50' : ''}
                  disabled={!projectSources.includes(source.id)}
                >
                  <Quote className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
} 