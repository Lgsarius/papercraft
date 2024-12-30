import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Editor } from '@tiptap/react'

interface PageSetupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editor: Editor | null
}

export function PageSetupDialog({ open, onOpenChange, editor }: PageSetupDialogProps) {
  if (!editor) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Seite einrichten</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Seitenformat</Label>
            <RadioGroup
              defaultValue="A4"
              onValueChange={(value) => {
                editor.chain().focus().setPageSize(value as any).run()
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="A4" id="A4" />
                <Label htmlFor="A4">A4</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Letter" id="Letter" />
                <Label htmlFor="Letter">Letter</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Legal" id="Legal" />
                <Label htmlFor="Legal">Legal</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Ausrichtung</Label>
            <RadioGroup
              defaultValue="portrait"
              onValueChange={(value) => {
                editor.chain().focus().setOrientation(value as 'portrait' | 'landscape').run()
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="portrait" id="portrait" />
                <Label htmlFor="portrait">Hochformat</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="landscape" id="landscape" />
                <Label htmlFor="landscape">Querformat</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Seitenränder</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Oben</Label>
                <Input
                  type="number"
                  min="0"
                  defaultValue="20"
                  onChange={(e) => {
                    editor.chain().focus().setMargins({ top: `${e.target.value}mm` }).run()
                  }}
                />
              </div>
              <div>
                <Label>Unten</Label>
                <Input
                  type="number"
                  min="0"
                  defaultValue="20"
                  onChange={(e) => {
                    editor.chain().focus().setMargins({ bottom: `${e.target.value}mm` }).run()
                  }}
                />
              </div>
              <div>
                <Label>Links</Label>
                <Input
                  type="number"
                  min="0"
                  defaultValue="20"
                  onChange={(e) => {
                    editor.chain().focus().setMargins({ left: `${e.target.value}mm` }).run()
                  }}
                />
              </div>
              <div>
                <Label>Rechts</Label>
                <Input
                  type="number"
                  min="0"
                  defaultValue="20"
                  onChange={(e) => {
                    editor.chain().focus().setMargins({ right: `${e.target.value}mm` }).run()
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 