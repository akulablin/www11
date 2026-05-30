import type { ContentItem } from "@/components/content-card"
import type { Comment } from "@/components/comment-section"

export interface ArtItem {
  id: string
  title: string
  imageUrl: string
  artist: string
  likes: number
  created_at?: string
  createdAt?: string
  views?: number
  tags?: string[]
}

export interface Genre {
  id: string
  name: string
  slug: string
}

export const GENRES = ["Киберпанк", "Меха", "Ретро", "Боевик", "Фантастика", "Драма"]
export const POPULAR_TAGS = ["Retro", "Sci-Fi", "Cyberpunk", "Classic", "90s", "80s"]

export const initialContentItems: ContentItem[] = [
  {
    id: "1",
    title: "Старое Аниме Тест",
    description: "Описание твоего первого крутого ретро-аниме.",
    thumbnailUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500",
    videoUrl: "https://t.me/your_telegram_video_link", 
    downloadUrl: "https://t.me/your_telegram_download_link",
    category: "Anime",
    year: "1998",
    rating: "9.2",
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    date: "1998-01-01"
  }
]

export const initialComments: Record<string, Comment[]> = {}
export const initialArtItems: ArtItem[] = [
  {
    id: "1",
    title: "Ретро Арт Тест",
    imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500",
    artist: "Admin",
    likes: 12,
    views: 100,
    tags: ["Retro", "Cyberpunk"],
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
]

export const initialGenres: Genre[] = [
  { id: "1", name: "Киберпанк", slug: "cyberpunk" },
  { id: "2", name: "Меха", slug: "mecha" },
  { id: "3", name: "Ретро", slug: "retro" }
]

// Тотальная заглушка. Что бы страницы ни просили, они получат массив и не упадут
export const useTunaStore = () => {
  return {
    contentItems: initialContentItems,
    filteredContent: initialContentItems,
    comments: initialComments,
    artItems: initialArtItems,
    genres: initialGenres,
    GENRES: GENRES,
    POPULAR_TAGS: POPULAR_TAGS,
    loading: false,
    error: null,
    isBoss: false,
    
    // Возвращаем пустые массивы на случай если код вызовет .filter() или .map() напрямую из функций
    addComment: () => [],
    addArtItem: () => [],
    toggleLikeArtItem: () => [],
    fetchContentItems: () => initialContentItems,
    fetchGenres: () => initialGenres,
    fetchComments: () => initialComments,
    fetchArtItems: () => initialArtItems,
    setSearch: () => [],
    setSelectedGenre: () => [],
    setTypeFilter: () => [],
  }
}

export default useTunaStore
