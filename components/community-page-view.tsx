"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type CommunityGeneration } from "@/app/actions"
import { type ToneType } from "@/lib/utils"
import { Copy, ArrowLeft, Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useState } from "react"

interface CommunityPageViewProps {
    generations: CommunityGeneration[]
}

export function CommunityPageView({ generations }: CommunityPageViewProps) {
    const { toast } = useToast()
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [sharedId, setSharedId] = useState<string | null>(null)

    async function copyToClipboard(text: string, id: string) {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedId(id)
            toast({
                title: "Copied!",
                description: "The text has been copied to your clipboard",
            })
            // Reset the copied state after 2 seconds
            setTimeout(() => setCopiedId(null), 2000)
        } catch (err) {
            toast({
                title: "Failed to copy",
                description: "Please try again",
                variant: "destructive",
            })
        }
    }

    async function shareTransformation(text: string, tone: ToneType, id: string) {
        try {
            const url = new URL(window.location.origin)
            url.searchParams.set("text", text)
            url.searchParams.set("tone", tone)

            await navigator.clipboard.writeText(url.toString())
            setSharedId(id)
            toast({
                title: "Link copied!",
                description: "Share link has been copied to your clipboard",
            })
            // Reset the shared state after 2 seconds
            setTimeout(() => setSharedId(null), 2000)
        } catch (err) {
            toast({
                title: "Failed to share",
                description: "Please try again",
                variant: "destructive",
            })
        }
    }

    function getToneColor(tone: ToneType): string {
        const colors: Record<ToneType, string> = {
            "gen-z": "bg-pink-500",
            shakespeare: "bg-purple-500",
            pirate: "bg-amber-500",
            corporate: "bg-blue-500",
            yoda: "bg-green-500",
            baby: "bg-rose-300",
            cat: "bg-orange-400",
            dog: "bg-yellow-500",
            drunk: "bg-red-400",
            angry: "bg-red-600",
            "valley-girl": "bg-pink-400",
            cowboy: "bg-brown-500",
            anime: "bg-indigo-500",
            superhero: "bg-sky-500"
        }
        return colors[tone]
    }

    function formatToneLabel(tone: ToneType): string {
        const labels: Record<ToneType, string> = {
            "gen-z": "Gen Z",
            shakespeare: "Shakespearean",
            pirate: "Pirate",
            corporate: "Corporate",
            yoda: "Yoda",
            baby: "Baby Talk",
            cat: "Cat",
            dog: "Excited Dog",
            drunk: "Tipsy",
            angry: "Angry",
            "valley-girl": "Valley Girl",
            cowboy: "Cowboy",
            anime: "Anime",
            superhero: "Superhero"
        }
        return labels[tone]
    }

    return (
        <div className="container py-8">
            <div className="mb-4">
                <Link href="/">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Community Transformations</CardTitle>
                    <CardDescription>All community text transformations</CardDescription>
                </CardHeader>
                <CardContent>
                    {generations.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No community generations yet. Be the first!</p>
                    ) : (
                        <div className="space-y-4">
                            {generations.map((gen) => (
                                <Card key={gen.id} className="overflow-hidden">
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="outline" className={`${getToneColor(gen.tone)} text-white`}>
                                                {formatToneLabel(gen.tone)}
                                            </Badge>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => copyToClipboard(gen.transformedText, gen.id)}
                                                >
                                                    {copiedId === gen.id ? (
                                                        <Check className="h-4 w-4" />
                                                    ) : (
                                                        <Copy className="h-4 w-4" />
                                                    )}
                                                    <span className="sr-only">Copy</span>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => shareTransformation(gen.originalText, gen.tone, gen.id)}
                                                >
                                                    {sharedId === gen.id ? (
                                                        <Check className="h-4 w-4" />
                                                    ) : (
                                                        <Share2 className="h-4 w-4" />
                                                    )}
                                                    <span className="sr-only">Share</span>
                                                </Button>
                                            </div>
                                        </div>
                                        <Tabs defaultValue="transformed">
                                            <TabsList className="mb-2">
                                                <TabsTrigger value="transformed">Transformed</TabsTrigger>
                                                <TabsTrigger value="original">Original</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="transformed" className="mt-0">
                                                <p className="text-sm whitespace-pre-wrap">{gen.transformedText}</p>
                                            </TabsContent>
                                            <TabsContent value="original" className="mt-0">
                                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{gen.originalText}</p>
                                            </TabsContent>
                                        </Tabs>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}