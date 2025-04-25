import { fetchCommunityGenerations } from "@/app/actions"
import { CommunityPageView } from "@/components/community-page-view"

export default async function CommunityPage() {
    const generations = await fetchCommunityGenerations()
    return <CommunityPageView generations={generations} />
}