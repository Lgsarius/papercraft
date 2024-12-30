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
    <div className="h-full flex">
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b bg-background sticky top-0 z-10">
          <div className="flex items-center justify-between p-2">
            <div className="flex flex-wrap gap-1">
              {/* Text Style */}
              <Select
                value={editor.isActive('heading') ? `h${editor.getAttributes('heading').level}` : 'p'}
                onValueChange={(value) => {
                  if (value === 'p') {
                    editor.chain().focus().setParagraph().run()
                  } else {
                    editor.chain().focus().toggleHeading({
                      level: parseInt(value.replace('h', ''))
                    }).run()
                  }
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Absatzformat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="p">Normal</SelectItem>
                  <SelectItem value="h1">Überschrift 1</SelectItem>
                  <SelectItem value="h2">Überschrift 2</SelectItem>
                  <SelectItem value="h3">Überschrift 3</SelectItem>
                </SelectContent>
              </Select>

              <div className="w-px h-6 bg-border mx-1" />

              {/* Basic Formatting */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className={cn(editor.isActive('bold') && 'bg-muted')}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Fett (Strg+B)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn(editor.isActive('italic') && 'bg-muted')}
              >
                <Italic className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-border mx-1" />

              {/* Lists */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn(editor.isActive('bulletList') && 'bg-muted')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn(editor.isActive('orderedList') && 'bg-muted')}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-border mx-1" />

              {/* Alignment */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={cn(editor.isActive({ textAlign: 'left' }) && 'bg-muted')}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={cn(editor.isActive({ textAlign: 'center' }) && 'bg-muted')}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={cn(editor.isActive({ textAlign: 'right' }) && 'bg-muted')}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className={cn(editor.isActive({ textAlign: 'justify' }) && 'bg-muted')}
              >
                <AlignJustify className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-border mx-1" />

              {/* Insert */}
              <Button
                variant="ghost"
                size="sm"
                onClick={addImage}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}
              >
                <TableIcon className="h-4 w-4" />
              </Button>

              {/* Text Formatting */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={cn(editor.isActive('underline') && 'bg-muted')}
              >
                <UnderlineIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={cn(editor.isActive('strike') && 'bg-muted')}
              >
                <Strikethrough className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleSuperscript().run()}
                className={cn(editor.isActive('superscript') && 'bg-muted')}
              >
                <SuperscriptIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleSubscript().run()}
                className={cn(editor.isActive('subscript') && 'bg-muted')}
              >
                <SubscriptIcon className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-border mx-1" />

              {/* Task Lists */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleTaskList().run()}
                className={cn(editor.isActive('taskList') && 'bg-muted')}
              >
                <CheckSquare className="h-4 w-4" />
              </Button>

              {/* Quote */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={cn(editor.isActive('blockquote') && 'bg-muted')}
              >
                <Quote className="h-4 w-4" />
              </Button>

              {/* Link */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const url = window.prompt('URL')
                  if (url) {
                    editor.chain().focus().setLink({ href: url }).run()
                  }
                }}
                className={cn(editor.isActive('link') && 'bg-muted')}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>
            <StatusIndicator saving={saving} error={error} />
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-auto bg-muted/10">
          <div className="max-w-[210mm] mx-auto bg-white shadow-lg my-8">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
      <EditorSidebar 
        text={editor?.getText() || ""} 
        sources={sources}
        onSourcesChange={handleSourcesChange}
      />
    </div>
  )
} 