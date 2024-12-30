"use client"

import { useState } from "react"
import { Source } from "@/app/dashboard/sources/page"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Book, Edit2, MoreVertical, Search, Trash2 } from "lucide-react"
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { db, auth } from "@/app/firebase/config"
import { SourceForm } from "./SourceForm"

interface SourceFormData {
  type: Source['type']
  title: string
  authors: string
  year: string
  source: string
  url?: string
  pages?: string
}

interface SourceManagerProps {
  sources: Source[]
  showAddSheet: boolean
  setShowAddSheet: (show: boolean) => void
}

export function SourceManager({ sources, showAddSheet, setShowAddSheet }: SourceManagerProps) {
  const [search, setSearch] = useState("")
  const [showEditSheet, setShowEditSheet] = useState(false)
  const [editingSource, setEditingSource] = useState<Source | null>(null)
  const [formData, setFormData] = useState<SourceFormData>({
    type: "book",
    title: "",
    authors: "",
    year: "",
    source: "",
    url: "",
    pages: "",
  })

  const handleSubmit = async (isEditing: boolean) => {
    const user = auth.currentUser
    if (!user) return

    const sourceData = {
      type: formData.type,
      title: formData.title.trim(),
      authors: formData.authors.split(",").map(a => a.trim()).filter(Boolean),
      year: formData.year.trim(),
      source: formData.source.trim(),
      url: formData.url?.trim(),
      pages: formData.pages?.trim(),
      userId: user.uid,
      projects: [],
    }

    try {
      if (isEditing && editingSource) {
        await updateDoc(doc(db, "sources", editingSource.id), {
          ...sourceData,
          updatedAt: serverTimestamp(),
        })
      } else {
        await addDoc(collection(db, "sources"), {
          ...sourceData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      }

      resetForm()
      setShowAddSheet(false)
      setShowEditSheet(false)
    } catch (error) {
      console.error("Error saving source:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "sources", id))
    } catch (error) {
      console.error("Error deleting source:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      type: "book",
      title: "",
      authors: "",
      year: "",
      source: "",
      url: "",
      pages: "",
    })
    setEditingSource(null)
  }

  const filteredSources = sources.filter(source =>
    source.title.toLowerCase().includes(search.toLowerCase()) ||
    source.authors.join(", ").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Quellen durchsuchen..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Typ</TableHead>
              <TableHead>Titel</TableHead>
              <TableHead>Autoren</TableHead>
              <TableHead>Jahr</TableHead>
              <TableHead>Quelle</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSources.map((source) => (
              <TableRow key={source.id}>
                <TableCell>
                  <Book className="h-4 w-4" />
                </TableCell>
                <TableCell>{source.title}</TableCell>
                <TableCell>{source.authors.join(", ")}</TableCell>
                <TableCell>{source.year}</TableCell>
                <TableCell>{source.source}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setEditingSource(source)
                        setFormData({
                          type: source.type,
                          title: source.title,
                          authors: source.authors.join(", "),
                          year: source.year,
                          source: source.source,
                          url: source.url,
                          pages: source.pages,
                        })
                        setShowEditSheet(true)
                      }}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Bearbeiten
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(source.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Löschen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <SourceForm 
        isOpen={showAddSheet}
        onOpenChange={setShowAddSheet}
        formData={formData}
        setFormData={setFormData}
        onSubmit={() => handleSubmit(false)}
        title="Neue Quelle"
      />

      <SourceForm 
        isOpen={showEditSheet}
        onOpenChange={setShowEditSheet}
        formData={formData}
        setFormData={setFormData}
        onSubmit={() => handleSubmit(true)}
        title="Quelle bearbeiten"
      />
    </div>
  )
} 