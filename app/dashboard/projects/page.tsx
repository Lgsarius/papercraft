"use client"

import { useState, useEffect } from "react"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { db, auth } from "@/app/firebase/config"
import { useAuthState } from "react-firebase-hooks/auth"
import { Project } from "@/app/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  MoreVertical,
  Pencil,
  Trash2,
  Calendar,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { toast } from "sonner"
import { ProjectDetailsDialog } from "@/components/projects/ProjectDetailsDialog"

type ViewMode = "grid" | "list"
type SortField = "title" | "updatedAt" | "deadline"
type SortOrder = "asc" | "desc"

export default function ProjectsPage() {
  const [user] = useAuthState(auth)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortField, setSortField] = useState<SortField>("updatedAt")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return

      try {
        const projectsRef = collection(db, "projects")
        const projectsQuery = query(
          projectsRef,
          where("userId", "==", user.uid),
          orderBy(sortField, sortOrder)
        )
        const snapshot = await getDocs(projectsQuery)
        const projectsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
          updatedAt: doc.data().updatedAt.toDate(),
          deadline: doc.data().deadline?.toDate(),
        })) as Project[]

        setProjects(projectsData)
      } catch (error) {
        console.error("Error fetching projects:", error)
        toast.error("Fehler beim Laden der Projekte")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [user, sortField, sortOrder])

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const deleteProject = async (projectId: string) => {
    // Implement delete functionality
    toast.success("Projekt gelöscht")
  }

  if (loading) return <ProjectsSkeleton viewMode={viewMode} />

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projekte</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre akademischen Projekte
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            Neues Projekt
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Projekte durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={sortField}
          onValueChange={(value) => setSortField(value as SortField)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sortieren nach" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Titel</SelectItem>
            <SelectItem value="updatedAt">Zuletzt bearbeitet</SelectItem>
            <SelectItem value="deadline">Deadline</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? "↑" : "↓"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
        >
          {viewMode === "grid" ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
        </Button>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} onDelete={deleteProject} />
          ))}
        </div>
      ) : (
        <ProjectTable projects={filteredProjects} onDelete={deleteProject} />
      )}
    </div>
  )
}

function ProjectCard({ project, onDelete }: { project: Project; onDelete: (id: string) => void }) {
  const [showDetails, setShowDetails] = useState(false)
  const [currentProject, setCurrentProject] = useState(project)

  return (
    <>
      <div className="bg-card rounded-lg border p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Link 
              href={`/dashboard/projects/${currentProject.id}`}
              className="font-semibold hover:underline"
            >
              {currentProject.title}
            </Link>
            {currentProject.subject && (
              <p className="text-sm text-muted-foreground">
                {currentProject.subject}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowDetails(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Details bearbeiten
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/projects/${currentProject.id}`}>
                  <FileText className="mr-2 h-4 w-4" />
                  Inhalt bearbeiten
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => onDelete(currentProject.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Löschen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {currentProject.deadline ? (
              format(currentProject.deadline, "PPP", { locale: de })
            ) : (
              "Keine Deadline"
            )}
          </div>
          {currentProject.grade && (
            <div className="flex items-center gap-2">
              <span>Note: {currentProject.grade}</span>
            </div>
          )}
          <div>
            Zuletzt bearbeitet: {format(currentProject.updatedAt, "PPP", { locale: de })}
          </div>
        </div>
      </div>

      <ProjectDetailsDialog
        project={currentProject}
        open={showDetails}
        onOpenChange={setShowDetails}
        onUpdate={setCurrentProject}
      />
    </>
  )
}

function ProjectTable({ projects, onDelete }: { projects: Project[]; onDelete: (id: string) => void }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Titel</TableHead>
          <TableHead>Deadline</TableHead>
          <TableHead>Zuletzt bearbeitet</TableHead>
          <TableHead className="w-[100px]">Aktionen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map(project => (
          <TableRow key={project.id}>
            <TableCell>
              <Link 
                href={`/dashboard/projects/${project.id}`}
                className="font-medium hover:underline"
              >
                {project.title}
              </Link>
            </TableCell>
            <TableCell>
              {project.deadline ? (
                format(project.deadline, "PPP", { locale: de })
              ) : (
                "Keine Deadline"
              )}
            </TableCell>
            <TableCell>
              {format(project.updatedAt, "PPP", { locale: de })}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/projects/${project.id}`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Bearbeiten
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => onDelete(project.id)}
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
  )
}

function ProjectsSkeleton({ viewMode }: { viewMode: ViewMode }) {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>

      <div className="flex items-center gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-[180px]" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-[140px] rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}
    </div>
  )
} 