'use client'

import { useState, useEffect } from 'react'
import { fetchCommunityGenerations } from "@/app/actions"
import { CommunityPageView } from "@/components/community-page-view"
import type { CommunityGeneration } from "@/app/actions"

export default function CommunityPage() {
    const [generations, setGenerations] = useState<CommunityGeneration[]>([])

    const loadGenerations = async () => {
        const data = await fetchCommunityGenerations()
        setGenerations(data)
    }

    // Initial load
    useEffect(() => {
        loadGenerations()
    }, [])

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(loadGenerations, 30000)
        return () => clearInterval(interval)
    }, [])

    return <CommunityPageView generations={generations} />
}