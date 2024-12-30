import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"
import { NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Configure safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
]

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()
    
    // Use Gemini-Pro model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      safetySettings,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    })

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Du bist ein akademischer Schreibassistent. Hilf mir beim Verfassen wissenschaftlicher Arbeiten." }],
        },
        {
          role: "model",
          parts: [{ text: "Ich unterstütze Sie gerne beim akademischen Schreiben. Ich kann bei der Strukturierung, Formulierung und Recherche helfen. Was möchten Sie bearbeiten?" }],
        },
      ],
    })

    const result = await chat.sendMessage([{ text: prompt }])
    const response = await result.response
    const text = response.text()
    
    return NextResponse.json({ response: text })
  } catch (error) {
    console.error('AI Error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    )
  }
} 