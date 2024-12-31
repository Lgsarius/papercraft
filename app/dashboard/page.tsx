"use client"

import { useEffect, useState } from "react"
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore"
import { db } from "@/app/firebase/config"
import { auth } from "@/app/firebase/config"
import { useAuthState } from "react-firebase-hooks/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Project } from "@/app/types"
import Link from "next/link"
import {
  Clock,
  FileText,
  FolderOpen,
  BarChart2,
  Calendar,
  AlertCircle,
} from "lucide-react"

export default function DashboardPage() {
  const [user] = useAuthState(auth)
  const [recentProjects, setRecentProjects] = useState<Project[]>([])
  const [stats, setStats] = useState({
    totalProjects: 0,
    projectsDueThisWeek: 0,
    totalWords: 0,
    averageWordsPerDay: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return

      try {
        // Fetch recent projects
        const projectsRef = collection(db, "projects")
        const projectsQuery = query(
          projectsRef,
          where("userId", "==", user.uid),
          orderBy("updatedAt", "desc"),
          limit(3)
        )
        const projectsSnap = await getDocs(projectsQuery)
        const projects = projectsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
          updatedAt: doc.data().updatedAt.toDate(),
          deadline: doc.data().deadline?.toDate(),
        })) as Project[]

        setRecentProjects(projects)

        // Calculate stats
        const now = new Date()
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        
        const dueThisWeek = projects.filter(
          project => project.deadline && project.deadline <= nextWeek
        ).length

        setStats({
          totalProjects: projects.length,
          projectsDueThisWeek: dueThisWeek,
          totalWords: projects.reduce((acc, project) => 
            acc + (project.content?.split(/\s+/).length || 0), 0
          ),
          averageWordsPerDay: 500, // This could be calculated from historical data
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Willkommen zurück, {user?.displayName}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects/new">
            <FileText className="mr-2 h-4 w-4" />
            Neues Projekt
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projekte</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              Aktive Projekte
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fällig</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.projectsDueThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              Diese Woche fällig
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wörter</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWords}</div>
            <p className="text-xs text-muted-foreground">
              Insgesamt geschrieben
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Durchschnitt</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageWordsPerDay}</div>
            <p className="text-xs text-muted-foreground">
              Wörter pro Tag
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Letzte Projekte</CardTitle>
            <CardDescription>
              Ihre zuletzt bearbeiteten Projekte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map(project => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <Link 
                      href={`/dashboard/projects/${project.id}`}
                      className="font-medium hover:underline"
                    >
                      {project.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      Zuletzt bearbeitet: {project.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                  {project.deadline && (
                    <div className="text-sm text-muted-foreground">
                      Fällig: {project.deadline.toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Kalender</CardTitle>
            <CardDescription>
              Anstehende Deadlines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects
                .filter(project => project.deadline)
                .sort((a, b) => a.deadline!.getTime() - b.deadline!.getTime())
                .map(project => (
                  <div
                    key={project.id}
                    className="flex items-center space-x-4 p-2 border-l-4 border-primary"
                  >
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {project.deadline?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px]" />
              <Skeleton className="h-4 w-[120px] mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-4 w-[200px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-[100px]" />
            <Skeleton className="h-4 w-[150px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 