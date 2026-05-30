import type { ContentItem } from "@/components/content-card"
import type { Comment } from "@/components/comment-section"

// Art item for gallery
export interface ArtItem {
  id: string
  title: string
  imageUrl: string
  artist: string
  likes: number
}

// Простой список аниме прямо в коде (вместо Supabase)
export const initialContentItems: ContentItem[] = [
  {
    id: "1",
    title: "Старое Аниме Тест",
    description: "Описание твоего первого крутого ретро-аниме.",
    thumbnailUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500",
    videoUrl: "https://t.me/anime_vse_317/8", 
    downloadUrl: "https://t.me/anime_vse_317/8",
    category: "Anime",
    year: "1998",
    rating: "9.2"
  }
]

export const initialComments: Record<string, Comment[]> = {}
export const initialArtItems: ArtItem[] = []
