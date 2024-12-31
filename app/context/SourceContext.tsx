"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore"
import { db, auth } from "@/app/firebase/config"
import { useAuthState } from "react-firebase-hooks/auth"
import { Source } from "@/app/types"
import { toast } from "sonner"

interface SourceContextType {
  sources: Source[]
  loading: boolean
  addSource: (source: Source) => void
  updateSource: (source: Source) => void
  deleteSource: (sourceId: string) => void
}

const SourceContext = createContext<SourceContextType | undefined>(undefined)

export function SourceProvider({ children }: { children: React.ReactNode }) {
  const [user] = useAuthState(auth)
  const [sources, setSources] = useState<Source[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const q = query(
        collection(db, "sources"),
        where("userId", "==", user.uid),
        orderBy("updatedAt", "desc")
      )

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const sourcesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
          })) as Source[]

          setSources(sourcesData)
          setLoading(false)
          setError(null)
        },
        (error) => {
          console.error("Error fetching sources:", error)
          setError(error.message)
          setLoading(false)
          toast.error("Fehler beim Laden der Quellen")
        }
      )

      return () => unsubscribe()
    } catch (error) {
      console.error("Error setting up sources listener:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
      setLoading(false)
      toast.error("Fehler beim Laden der Quellen")
    }
  }, [user])

  const addSource = (source: Source) => {
    setSources(prev => [source, ...prev])
  }

  const updateSource = (updatedSource: Source) => {
    setSources(prev => prev.map(source => 
      source.id === updatedSource.id ? updatedSource : source
    ))
  }

  const deleteSource = (sourceId: string) => {
    setSources(prev => prev.filter(source => source.id !== sourceId))
  }

  return (
    <SourceContext.Provider value={{
      sources,
      loading,
      addSource,
      updateSource,
      deleteSource,
    }}>
      {children}
    </SourceContext.Provider>
  )
}

export function useSourceContext() {
  const context = useContext(SourceContext)
  if (context === undefined) {
    throw new Error("useSourceContext must be used within a SourceProvider")
  }
  return context
} 