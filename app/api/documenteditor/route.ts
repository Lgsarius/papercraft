import { NextRequest, NextResponse } from 'next/server'
import {
  SpellChecker,
  DocumentEditorSpellChecker,
} from '@syncfusion/ej2-documenteditor'

SpellChecker.languageID = 1031 // German

export async function POST(req: NextRequest) {
  const body = await req.json()
  
  switch (body.action) {
    case 'SpellCheck':
      const spellChecker = new DocumentEditorSpellChecker()
      const result = spellChecker.checkSpelling(body.text)
      return NextResponse.json(result)
      
    case 'RestrictEditing':
      // Implement if needed
      return NextResponse.json({})
      
    default:
      return NextResponse.json({
        error: 'Invalid action'
      })
  }
} 