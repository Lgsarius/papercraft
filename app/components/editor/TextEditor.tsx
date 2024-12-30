"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Underline from '@tiptap/extension-underline'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import Link from '@tiptap/extension-link'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import { useCallback, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import {
  Bold, Italic, List, ListOrdered, Quote, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Image as ImageIcon, Table as TableIcon,
  Type, Heading1, Heading2, Heading3,
  PaintBucket, FileText, Settings,
  Underline as UnderlineIcon, Strikethrough, Superscript as SuperscriptIcon, 
  Subscript as SubscriptIcon, Link as LinkIcon, CheckSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/app/firebase/config'
import { useDebounce } from 'use-debounce'
import { TableOfContents } from './extensions/table-of-contents'
import { StatusIndicator } from './StatusIndicator'
import { EditorSidebar } from "./EditorSidebar"

interface TextEditorProps {
  content: string
  onChange: (content: string) => void
  projectId: string
  sources: string[]
}

function useAutoSave(content: string, projectId: string) {
  const [debouncedContent] = useDebounce(content, 1000)

  useEffect(() => {
    if (!projectId || !debouncedContent) return

    const saveContent = async () => {
      try {
        const projectRef = doc(db, 'projects', projectId)
        await updateDoc(projectRef, {
          content: debouncedContent,
          updatedAt: serverTimestamp(),
        })
      } catch (error) {
        console.error('Error saving content:', error)
      }
    }

    saveContent()
  }, [debouncedContent, projectId])
}

export function TextEditor({ content, onChange, projectId, sources }: TextEditorProps) {
  const [selectedColor, setSelectedColor] = useState('#000000')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(false)
  const [editorContent, setEditorContent] = useState(content)
  useAutoSave(editorContent, projectId)

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      Superscript,
      Subscript,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Highlight,
      Typography,
      TableOfContents,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[297mm] p-[20mm]',
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Tab') {
          event.preventDefault()
          if (event.shiftKey) {
            view.dispatch(view.state.tr.insertText('\t'))
            return true
          }
          return false
        }
        return false
      },
    },
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML()
      setEditorContent(newContent)
      onChange(newContent)
    },
  })

  const addImage = useCallback(() => {
    const url = window.prompt('URL')
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const handleSourcesChange = (newSources: string[]) => {
    const updateSources = async () => {
      try {
        const projectRef = doc(db, 'projects', projectId)
        await updateDoc(projectRef, {
          sources: newSources,
          updatedAt: serverTimestamp(),
        })
      } catch (error) {
        console.error('Error updating sources:', error)
      }
    }
    updateSources()
  }

  if (!editor) return null

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-none border-b bg-background p-2">
          <MenuBar editor={editor} />
        </div>
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-[210mm] mx-auto bg-white shadow-lg my-8 min-h-[297mm]">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      <EditorSidebar 
        text={editor?.getText() || ""} 
        onCite={(citation) => {
          // Handle citation
        }}
      />
    </div>
  )
} 