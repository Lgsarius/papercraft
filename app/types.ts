export interface Project {
  id: string
  title: string
  content?: string
  subject?: string
  grade?: number
  deadline?: Date
  createdAt: Date
  updatedAt: Date
  userId: string
  sources?: string[]
}

export interface Source {
  id: string
  title: string
  authors: string[]
  year: string
  type: "book" | "article" | "website"
  url?: string
  pages?: string
  publisher?: string
  journal?: string
  volume?: string
  issue?: string
  doi?: string
  isbn?: string
  userId: string
  createdAt: Date
  updatedAt: Date
  projects?: string[] // IDs of projects using this source
} 