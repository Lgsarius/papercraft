"use client"

import { useState } from "react"
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db, auth } from "@/app/firebase/config"
import { useAuthState } from "react-firebase-hooks/auth"
import { Source } from "@/app/types"
import { useSourceContext } from "@/app/context/SourceContext"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { SourceList } from "./SourceList"

interface SourceManagerProps {
  showAddSheet: boolean
  setShowAddSheet: (show: boolean) => void
}

export function SourceManager({ showAddSheet, setShowAddSheet }: SourceManagerProps) {
  const [user] = useAuthState(auth)
  const { sources, addSource, updateSource, deleteSource } = useSourceContext()
  const [loading, setLoading] = useState(false)
  const [editingSource, setEditingSource] = useState<Source | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    year: new Date().getFullYear().toString(),
    url: "",
    type: "article" as const,
    publisher: "",
    journal: "",
    volume: "",
    issue: "",
    pages: "",
    doi: "",
    isbn: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const now = new Date()
      const sourceData = {
        ...formData,
        authors: formData.authors.split(",").map(a => a.trim()).filter(a => a),
        userId: user.uid,
        createdAt: now,
        updatedAt: now,
      }

      if (editingSource) {
        await updateDoc(doc(db, "sources", editingSource.id), {
          ...sourceData,
          updatedAt: now,
        })
        updateSource({ id: editingSource.id, ...sourceData } as Source)
        toast.success("Quelle aktualisiert")
      } else {
        const docRef = await addDoc(collection(db, "sources"), sourceData)
        addSource({ id: docRef.id, ...sourceData } as Source)
        toast.success("Quelle hinzugefügt")
      }

      setShowAddSheet(false)
      resetForm()
    } catch (error) {
      console.error("Error saving source:", error)
      toast.error("Fehler beim Speichern")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (source: Source) => {
    setEditingSource(source)
    setFormData({
      title: source.title,
      authors: source.authors.join(", "),
      year: source.year,
      url: source.url || "",
      type: source.type,
      publisher: source.publisher || "",
      journal: source.journal || "",
      volume: source.volume || "",
      issue: source.issue || "",
      pages: source.pages || "",
      doi: source.doi || "",
      isbn: source.isbn || "",
    })
    setShowAddSheet(true)
  }

  const handleDelete = async (sourceId: string) => {
    if (!confirm("Möchten Sie diese Quelle wirklich löschen?")) return

    try {
      await deleteDoc(doc(db, "sources", sourceId))
      deleteSource(sourceId)
      toast.success("Quelle gelöscht")
    } catch (error) {
      console.error("Error deleting source:", error)
      toast.error("Fehler beim Löschen")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      authors: "",
      year: new Date().getFullYear().toString(),
      url: "",
      type: "article",
      publisher: "",
      journal: "",
      volume: "",
      issue: "",
      pages: "",
      doi: "",
      isbn: "",
    })
    setEditingSource(null)
  }

  return (
    <>
      <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editingSource ? "Quelle bearbeiten" : "Neue Quelle hinzufügen"}</SheetTitle>
            <SheetDescription>
              {editingSource ? "Bearbeiten Sie die Details der Quelle." : "Fügen Sie eine neue Quelle zu Ihrer Bibliothek hinzu."}
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="type">Typ</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Source["type"] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Artikel</SelectItem>
                  <SelectItem value="book">Buch</SelectItem>
                  <SelectItem value="website">Webseite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authors">Autoren (kommagetrennt)</Label>
              <Input
                id="authors"
                value={formData.authors}
                onChange={(e) => setFormData(prev => ({ ...prev, authors: e.target.value }))}
                required
                placeholder="Max Mustermann, Erika Musterfrau"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Jahr</Label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                required
                type="number"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            {formData.type === "book" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="publisher">Verlag</Label>
                  <Input
                    id="publisher"
                    value={formData.publisher}
                    onChange={(e) => setFormData(prev => ({ ...prev, publisher: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    value={formData.isbn}
                    onChange={(e) => setFormData(prev => ({ ...prev, isbn: e.target.value }))}
                    placeholder="z.B. 978-3-16-148410-0"
                  />
                </div>
              </>
            )}

            {formData.type === "article" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="journal">Journal</Label>
                  <Input
                    id="journal"
                    value={formData.journal}
                    onChange={(e) => setFormData(prev => ({ ...prev, journal: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="volume">Band</Label>
                    <Input
                      id="volume"
                      value={formData.volume}
                      onChange={(e) => setFormData(prev => ({ ...prev, volume: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issue">Ausgabe</Label>
                    <Input
                      id="issue"
                      value={formData.issue}
                      onChange={(e) => setFormData(prev => ({ ...prev, issue: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doi">DOI</Label>
                  <Input
                    id="doi"
                    value={formData.doi}
                    onChange={(e) => setFormData(prev => ({ ...prev, doi: e.target.value }))}
                    placeholder="z.B. 10.1000/xyz123"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="pages">Seiten</Label>
              <Input
                id="pages"
                value={formData.pages}
                onChange={(e) => setFormData(prev => ({ ...prev, pages: e.target.value }))}
                placeholder="z.B. 123-145"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL {formData.type === "website" && "(erforderlich)"}</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                required={formData.type === "website"}
                placeholder="https://..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddSheet(false)
                  resetForm()
                }}
              >
                Abbrechen
              </Button>
              <Button type="submit" disabled={loading}>
                {editingSource ? "Speichern" : "Hinzufügen"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <SourceList 
        sources={sources}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  )
} 