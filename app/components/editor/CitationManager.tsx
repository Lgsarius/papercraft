"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Trash2, BookOpen, Quote } from "lucide-react"
import { toast } from "sonner"
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp 
} from "firebase/firestore"
import { db } from "@/app/firebase/config"
import { useAuth } from "@/app/context/AuthContext"

export interface Citation {
  id: string
  type: 'book' | 'article' | 'website'
  title: string
  authors: string[]
  year: string
  publisher?: string
  url?: string
  pages?: string
  userId?: string
  createdAt?: any
}

interface CitationManagerProps {
  onCite: (citation: Citation) => void
}

export function CitationManager({ onCite }: CitationManagerProps) {
  const { user } = useAuth()
  const [citations, setCitations] = useState<Citation[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newCitation, setNewCitation] = useState<Partial<Citation>>({
    type: 'book',
    title: '',
    authors: [],
    year: '',
  })

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, "citations"),
      where("userId", "==", user.uid)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newCitations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Citation[]
      setCitations(newCitations)
    })

    return () => unsubscribe()
  }, [user])

  const addCitation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newCitation.title || !newCitation.authors || !newCitation.year) return

    try {
      const citationData: Omit<Citation, 'id'> = {
        type: newCitation.type || 'book',
        title: newCitation.title,
        authors: typeof newCitation.authors === 'string' 
          ? newCitation.authors.split(',').map(a => a.trim())
          : newCitation.authors,
        year: newCitation.year,
        publisher: newCitation.publisher,
        url: newCitation.url,
        pages: newCitation.pages,
        userId: user.uid,
        createdAt: serverTimestamp(),
      }

      await addDoc(collection(db, "citations"), citationData)
      
      setNewCitation({
        type: 'book',
        title: '',
        authors: [],
        year: '',
      })
      setShowForm(false)
      toast.success("Quelle hinzugefügt")
    } catch (error) {
      toast.error("Fehler beim Hinzufügen der Quelle")
    }
  }

  const removeCitation = async (id: string) => {
    try {
      await deleteDoc(doc(db, "citations", id))
      toast.success("Quelle entfernt")
    } catch (error) {
      toast.error("Fehler beim Entfernen der Quelle")
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          <h2 className="font-semibold">Literaturverwaltung</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Neue Quelle
        </Button>
      </div>

      {showForm ? (
        <form onSubmit={addCitation} className="space-y-4">
          <Input
            placeholder="Titel"
            value={newCitation.title}
            onChange={e => setNewCitation(prev => ({ ...prev, title: e.target.value }))}
          />
          <Input
            placeholder="Autoren (durch Komma getrennt)"
            value={Array.isArray(newCitation.authors) ? newCitation.authors.join(', ') : ''}
            onChange={e => setNewCitation(prev => ({ ...prev, authors: e.target.value }))}
          />
          <Input
            placeholder="Jahr"
            value={newCitation.year}
            onChange={e => setNewCitation(prev => ({ ...prev, year: e.target.value }))}
          />
          <Input
            placeholder="Verlag (optional)"
            value={newCitation.publisher}
            onChange={e => setNewCitation(prev => ({ ...prev, publisher: e.target.value }))}
          />
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">Speichern</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Abbrechen
            </Button>
          </div>
        </form>
      ) : (
        <ScrollArea className="flex-1 -mx-2">
          <div className="space-y-2 px-2">
            {citations.map((citation) => (
              <div
                key={citation.id}
                className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex-1 mr-4">
                  <p className="font-medium">{citation.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {citation.authors.join(', ')} ({citation.year})
                  </p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onCite(citation)}
                    className="h-8 w-8"
                  >
                    <Quote className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCitation(citation.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
} 