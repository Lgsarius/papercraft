"use client"

import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/app/firebase/config"
import { Source } from "@/app/dashboard/sources/page"

export function Bibliography({ sources }: { sources: string[] }) {
  const [bibliography, setBibliography] = useState<Source[]>([])

  useEffect(() => {
    const fetchSources = async () => {
      const sourceDocs = await Promise.all(
        sources.map(id => getDoc(doc(db, "sources", id)))
      )
      
      const sourceData = sourceDocs
        .filter(doc => doc.exists())
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Source[]

      // Sort by author's last name
      sourceData.sort((a, b) => {
        const aName = a.authors[0].split(" ").pop() || ""
        const bName = b.authors[0].split(" ").pop() || ""
        return aName.localeCompare(bName)
      })

      setBibliography(sourceData)
    }

    if (sources.length > 0) {
      fetchSources()
    }
  }, [sources])

  if (bibliography.length === 0) {
    return null
  }

  return (
    <div className="mt-16 page-break-before-always">
      <h2 className="text-2xl font-bold mb-8">Literaturverzeichnis</h2>
      <div className="space-y-4">
        {bibliography.map(source => (
          <div key={source.id} className="text-sm pl-8 -indent-8 leading-relaxed">
            {formatBibliographyEntry(source)}
          </div>
        ))}
      </div>
    </div>
  )
}

function formatBibliographyEntry(source: Source): string {
  const authors = formatAuthors(source.authors)
  
  switch (source.type) {
    case "book":
      return `${authors} (${source.year}): ${source.title}. ${source.source}.`
    case "article":
      return `${authors} (${source.year}): ${source.title}. In: ${source.source}${source.pages ? `, S. ${source.pages}` : ""}.`
    case "website":
      return `${authors} (${source.year}): ${source.title}. ${source.source}. URL: ${source.url} [Stand: ${formatDate(new Date())}].`
    default:
      return `${authors} (${source.year}): ${source.title}.`
  }
}

function formatAuthors(authors: string[]): string {
  if (authors.length === 1) {
    return authors[0]
  }
  if (authors.length === 2) {
    return `${authors[0]}/​${authors[1]}`
  }
  return `${authors[0]} et al.`
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
} 