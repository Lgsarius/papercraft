"use client"

import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore"
import { auth, db } from "@/app/firebase/config"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { SourceManager } from "@/app/components/sources/SourceManager"

export interface Source {
  id: string
  type: "book" | "article" | "website"
  title: string
  authors: string[]
  year: string
  source: string
  url?: string
  pages?: string
  userId: string
  createdAt: Date
  updatedAt: Date
  projects: string[] // IDs of projects using this source
}

export default function SourcesPage() {
  const [user] = useAuthState(auth)
  const [sources, setSources] = useState<Source[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddSheet, setShowAddSheet] = useState(false)

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, "sources"),
      where("userId", "==", user.uid)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sourcesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as Source[]

      sourcesData.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

      setSources(sourcesData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Quellenverwaltung</h1>
        <Button onClick={() => setShowAddSheet(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Neue Quelle
        </Button>
      </div>

      <SourceManager 
        sources={sources} 
        showAddSheet={showAddSheet}
        setShowAddSheet={setShowAddSheet}
      />
    </div>
  )
} 