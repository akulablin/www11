import type { ContentItem } from "@/components/content-card"
import type { Comment } from "@/components/comment-section"

// Интерфейсы, чтобы страницы не ругались на типы данных
export interface ArtItem {
  id: string
  title: string
  imageUrl: string
  artist: string
  likes: number
}

export interface Genre {
  id: string
  name: string
  slug: string
}

// Тестовые данные (Сюда будешь вставлять свои аниме)
export const initialContentItems: ContentItem[] = [
  {
    id: "1",
    title: "Старое Аниме Тест",
    description: "Описание твоего первого крутого ретро-аниме.",
    thumbnailUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500",
    videoUrl: "ССЫЛКА_ИЗ_ТВОЕГО_БЛОКНОТА_НА_ТЕЛЕГРАМ", 
    downloadUrl: "ССЫЛКА_ИЗ_ТВОЕГО_БЛОКНОТА_НА_ТЕЛЕГРАМ",
    category: "Anime",
    year: "1998",
    rating: "9.2"
  }
]

export const initialComments: Record<string, Comment[]> = {}
export const initialArtItems: ArtItem[] = []
export const initialGenres: Genre[] = [
  { id: "1", name: "Киберпанк", slug: "cyberpunk" },
  { id: "2", name: "Меха", slug: "mecha" },
  { id: "3", name: "Ретро", slug: "retro" }
]

// Глобальная функция-заглушка, отдающая ВСЕ возможные переменные для v0
export const useTunaStore = () => {
  return {
    contentItems: initialContentItems,
    comments: initialComments,
    artItems: initialArtItems,
    genres: initialGenres,
    loading: false,
    error: null,
    // Пустые функции, чтобы страницы не ломались при кликах
    addComment: () => {},
    addArtItem: () => {},
    toggleLikeArtItem: () => {},
    fetchContentItems: () => {},
    fetchGenres: () => {},
    fetchComments: () => {},
    fetchArtItems: () => {},
  }
}
