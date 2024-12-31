"use client"

import { Source } from "@/app/types"
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
import { Button } from "@/components/ui/button"
import { Book, FileText, Link as LinkIcon, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { de } from "date-fns/locale"

interface SourceListProps {
  sources: Source[]
  onEdit: (source: Source) => void
  onDelete: (sourceId: string) => void
}

export function SourceList({ sources, onEdit, onDelete }: SourceListProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30px]"></TableHead>
            <TableHead>Titel</TableHead>
            <TableHead>Autoren</TableHead>
            <TableHead>Jahr</TableHead>
            <TableHead>Typ</TableHead>
            <TableHead className="w-[100px]">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sources.map(source => (
            <TableRow key={source.id}>
              <TableCell>
                {source.type === "book" ? (
                  <Book className="h-4 w-4" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
              </TableCell>
              <TableCell className="font-medium">{source.title}</TableCell>
              <TableCell>{source.authors.join(", ")}</TableCell>
              <TableCell>{source.year}</TableCell>
              <TableCell>
                {source.type === "book" ? "Buch" : 
                 source.type === "article" ? "Artikel" : "Webseite"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(source)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Bearbeiten
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(source.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
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
  )
} 