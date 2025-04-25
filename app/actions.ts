"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { type ToneType } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

export interface CommunityGeneration {
  id: string
  originalText: string
  transformedText: string
  tone: ToneType
  createdAt: string
}

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

// Function to get the prompt based on the selected tone
function getPromptForTone(text: string, tone: ToneType): string {
  const prompts = {
    "gen-z": `Rewrite the following text in Gen Z slang. Use current slang terms, abbreviations, and emoji where appropriate. Make it sound authentic to how Gen Z communicates online: "${text}"`,
    shakespeare: `Rewrite the following text as if William Shakespeare wrote it. Use Early Modern English, Shakespearean vocabulary, iambic pentameter where possible, and his characteristic style: "${text}"`,
    pirate: `Rewrite the following text as if a stereotypical pirate is speaking. Use pirate slang, terminology, and speech patterns: "${text}"`,
    corporate: `Rewrite the following text using excessive corporate jargon, buzzwords, and business speak. Make it sound like the most stereotypical corporate communication possible: "${text}"`,
    yoda: `Rewrite the following text in Yoda's speech pattern from Star Wars. Rearrange sentence structure with object-subject-verb order where appropriate and use his characteristic speaking style: "${text}"`,
    baby: `Rewrite the following text as if a baby or toddler is speaking. Use simple words, baby talk, cute mispronunciations, and repetitive patterns: "${text}"`,
    cat: `Rewrite the following text as if a cat is speaking. Include cat-like behaviors, meows, references to cat activities, and a feline perspective: "${text}"`,
    dog: `Rewrite the following text as if an excited dog is speaking. Include lots of enthusiasm, references to treats, walks, belly rubs, and typical dog behaviors: "${text}"`,
    drunk: `Rewrite the following text as if someone who is tipsy is speaking. Include slight word slurring, meandering thoughts, and overly friendly tone (but keep it family-friendly): "${text}"`,
    angry: `Rewrite the following text as if someone is really frustrated and angry (but keep it clean). Use ALL CAPS where appropriate, lots of exclamation marks, and exaggerated expressions of frustration: "${text}"`,
    "valley-girl": `Rewrite the following text in valley girl speak. Use "like", "totally", "oh my god", and other valley girl expressions. Make it sound stereotypically valley girl: "${text}"`,
    cowboy: `Rewrite the following text as if a stereotypical cowboy from the Old West is speaking. Use Western slang, "yeehaw", and cowboy expressions: "${text}"`,
    anime: `Rewrite the following text as if an over-the-top anime character is speaking. Include anime expressions, references to power levels, and dramatic declarations: "${text}"`,
    superhero: `Rewrite the following text as if a classic superhero is speaking. Use noble, dramatic language with superhero catchphrases and references to justice and heroic deeds: "${text}"`
  }

  return prompts[tone]
}

// Use Gemini 1.5 Flash as the primary model
const MODEL_NAME = "gemini-1.5-flash"

export async function transformText(text: string, tone: ToneType) {
  // Input validation
  if (!text.trim()) {
    return { error: "Please enter some text to transform" }
  }

  try {
    console.log(`Using model: ${MODEL_NAME}`)

    // Get the model - using the specific model name
    const model = genAI.getGenerativeModel({ model: MODEL_NAME })

    // Generate the prompt based on the tone
    const prompt = getPromptForTone(text, tone)

    // Generate content
    const result = await model.generateContent(prompt)
    const response = await result.response
    const transformedText = response.text()

    // Store the transformation in the database
    await storeTransformation(text, transformedText, tone)

    return { transformedText }
  } catch (error) {
    console.error(`Error with model ${MODEL_NAME}:`, error)
    return {
      error: "Failed to transform text. The AI model might be temporarily unavailable. Please try again later.",
    }
  }
}

// Function to store transformations in the database
async function storeTransformation(originalText: string, transformedText: string, tone: ToneType) {
  try {
    const { data, error } = await supabase
      .from('transformations')
      .insert([
        {
          original_text: originalText,
          transformed_text: transformedText,
          tone,
          created_at: new Date().toISOString(),
        }
      ])
      .select()

    if (error) {
      throw error
    }

    return data[0]
  } catch (error) {
    console.error("Error storing transformation:", error)
    // Continue execution even if storage fails
    return null
  }
}

// Function to fetch community generations
export async function fetchCommunityGenerations(): Promise<CommunityGeneration[]> {
  try {
    const { data: transformations, error } = await supabase
      .from('transformations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      throw error
    }

    return transformations.map(t => ({
      id: t.id.toString(),
      originalText: t.original_text,
      transformedText: t.transformed_text,
      tone: t.tone,
      createdAt: t.created_at
    }))
  } catch (error) {
    console.error("Error fetching community generations:", error)
    return []
  }
}
