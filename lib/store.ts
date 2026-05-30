import type { ContentItem } from "@/components/content-card"
import type { Comment } from "@/components/comment-section"

// Интерфейсы для типов данных
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

// Константы, которые так яростно требуют страницы каталога, галереи и админки
export const GENRES = ["Киберпанк", "Меха", "Ретро", "Боевик", "Фантастика", "Драма"]
export const POPULAR_TAGS = ["Retro", "Sci-Fi", "Cyberpunk", "Classic", "90s", "80s"]

// Тестовые данные твоего аниме
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

// Главный хук, отдающий ВСЁ, что ищут разные файлы
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
    
    // Функции-заглушки, чтобы ничего не падало при кликах
    addComment: () => {},
    addArtItem: () => {},
    toggleLikeArtItem: () => {},
    fetchContentItems: () => {},
    fetchGenres: () => {},
    fetchComments: () => {},
    fetchArtItems: () => {},
    setSearch: () => {},
    setSelectedGenre: () => {},
    setTypeFilter: () => {},
  }
}

// Экспорт по умолчанию
export default useTunaStore
