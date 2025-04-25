"use client"

import { useState, useCallback } from "react"
import { transformText } from "./actions"
import { type ToneType } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Share2, RefreshCw, AlertCircle, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { useUrlParams } from "@/hooks/use-url-params"
import { CommunityGenerations } from "@/components/community-generations"
import { Footer } from "@/components/footer"
import { ImageTransition } from "@/components/image-carousel"

const toneOptions = [
  { value: "gen-z", label: "Gen Z Slang" },
  { value: "shakespeare", label: "Shakespearean" },
  { value: "pirate", label: "Pirate" },
  { value: "corporate", label: "Corporate BS" },
  { value: "yoda", label: "Yoda Speak" },
  { value: "baby", label: "Baby Talk" },
  { value: "cat", label: "Cat" },
  { value: "dog", label: "Excited Dog" },
  { value: "drunk", label: "Tipsy" },
  { value: "angry", label: "Angry" },
  { value: "valley-girl", label: "Valley Girl" },
  { value: "cowboy", label: "Cowboy" },
  { value: "anime", label: "Anime" },
  { value: "superhero", label: "Superhero" }
]

export default function Home() {
  const [inputText, setInputText] = useState("")
  const [tone, setTone] = useState<ToneType>("gen-z")
  const [transformedText, setTransformedText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const [isShared, setIsShared] = useState(false)
  const { toast } = useToast()

  const handleTransform = useCallback(async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to transform")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await transformText(inputText, tone)

      if (result.error) {
        setError(result.error)
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else if (result.transformedText) {
        setTransformedText(result.transformedText)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again."
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [inputText, tone, toast])

  // Use the URL params hook to handle shared links
  useUrlParams(setInputText, setTone, handleTransform)

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(transformedText)
      setIsCopied(true)
      toast({
        title: "Copied!",
        description: "The transformed text has been copied to your clipboard",
      })
      // Reset the copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  async function shareResult() {
    try {
      const url = new URL(window.location.href)
      url.searchParams.set("text", inputText)
      url.searchParams.set("tone", tone)

      await navigator.clipboard.writeText(url.toString())
      setIsShared(true)
      toast({
        title: "Link copied!",
        description: "Share link has been copied to your clipboard",
      })
      // Reset the shared state after 2 seconds
      setTimeout(() => setIsShared(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to share",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="container mx-auto px-4 py-8 max-w-4xl flex-1">
        <div className="flex justify-between items-center mb-[365px] relative">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-black to-gray-500 dark:from-white dark:to-gray-500 bg-clip-text text-transparent">
            Language Buddy
          </h1>
          <ThemeToggle />
          <div className="absolute top-48 left-0 right-0 h-[250px]">
            <ImageTransition />
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="input-text" className="block text-sm font-medium mb-2">
                  Enter your formal text
                </label>
                <Textarea
                  id="input-text"
                  placeholder="Type or paste your text here..."
                  className="min-h-[120px]"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="tone-select" className="block text-sm font-medium mb-2">
                  Select a tone
                </label>
                <Select value={tone} onValueChange={(value) => setTone(value as ToneType)}>
                  <SelectTrigger id="tone-select" className="w-full">
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {toneOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleTransform} disabled={isLoading || !inputText.trim()} className="w-full">
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Transforming...
                  </>
                ) : (
                  "Transform Text"
                )}
              </Button>

              {error && (
                <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-destructive">{error}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {transformedText && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Transformed Text</h2>
                <div className="bg-muted p-4 rounded-md whitespace-pre-wrap mb-4">{transformedText}</div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    {isCopied ? (
                      <Check className="mr-2 h-4 w-4" />
                    ) : (
                      <Copy className="mr-2 h-4 w-4" />
                    )}
                    {isCopied ? "Copied!" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleTransform}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate Again
                  </Button>
                  <Button variant="outline" size="sm" onClick={shareResult}>
                    {isShared ? (
                      <Check className="mr-2 h-4 w-4" />
                    ) : (
                      <Share2 className="mr-2 h-4 w-4" />
                    )}
                    {isShared ? "Shared!" : "Share"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="about">
                <TabsList className="mb-4">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="examples">Examples</TabsTrigger>
                </TabsList>
                <TabsContent value="about">
                  <div className="prose dark:prose-invert">
                    <h3>About Language Buddy</h3>
                    <p>
                      Language Buddy uses Google's Gemini 1.5 Flash AI to transform formal text into various slang
                      styles. Simply enter your text, select a tone, and see the magic happen!
                    </p>
                    <p>
                      This tool is perfect for creative writing, social media posts, or just having fun with language
                      transformation.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="examples">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Original</h3>
                      <p className="text-sm text-muted-foreground">
                        I would appreciate your assistance with this matter at your earliest convenience.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Gen Z</h3>
                      <p className="text-sm text-muted-foreground">ngl could use ur help with this asap, no cap 😩✨</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Shakespearean</h3>
                      <p className="text-sm text-muted-foreground">
                        Pray thee, lend thy gracious aid in this affair, with all due haste that thou canst muster.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <CommunityGenerations />
        </div>
      </main>

      <Footer />
    </div>
  )
}
