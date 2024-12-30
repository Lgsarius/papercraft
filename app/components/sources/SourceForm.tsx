"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface SourceFormData {
  type: "book" | "article" | "website"
  title: string
  authors: string
  year: string
  source: string
  url?: string
  pages?: string
}

interface SourceFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  formData: SourceFormData
  setFormData: (data: SourceFormData) => void
  onSubmit: () => void
  title: string
}

export function SourceForm({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  title,
}: SourceFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange} modal>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="type">Typ</Label>
            <Select
              value={formData.type}
              onValueChange={(value: SourceFormData['type']) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Typ auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="book">Buch</SelectItem>
                <SelectItem value="article">Artikel</SelectItem>
                <SelectItem value="website">Webseite</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titel</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Titel der Quelle"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="authors">Autoren</Label>
            <Input
              id="authors"
              value={formData.authors}
              onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
              placeholder="Autor 1, Autor 2, ..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Jahr</Label>
            <Input
              id="year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              placeholder="Erscheinungsjahr"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Quelle/Verlag</Label>
            <Input
              id="source"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              placeholder="Quelle oder Verlag"
            />
          </div>

          {formData.type === "website" && (
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="pages">Seiten</Label>
            <Input
              id="pages"
              value={formData.pages}
              onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
              placeholder="z.B. 123-145"
            />
          </div>

          <Button type="submit" className="w-full">
            Speichern
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
} 