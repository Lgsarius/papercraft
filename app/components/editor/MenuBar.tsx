"use client"

import { Editor } from '@tiptap/react'
import {
  Bold, Italic, List, ListOrdered, Quote, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Image as ImageIcon, Table as TableIcon,
  Underline as UnderlineIcon, Strikethrough, 
  Superscript as SuperscriptIcon, 
  Subscript as SubscriptIcon, 
  Link as LinkIcon, 
  CheckSquare
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
import { cn } from '@/lib/utils'

interface MenuBarProps {
  editor: Editor
}

export function MenuBar({ editor }: MenuBarProps) {
  const addImage = () => {
    const url = window.prompt('URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="flex items-center justify-between">
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
    </div>
  )
} 