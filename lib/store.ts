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

// Константа Жанров большими буквами (v0 часто её требует)
export const GENRES = ["Киберпанк", "Меха", "Ретро", "Боевик", "Фантастика", "Драма"]

// Тестовые данные твоего аниме
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

// Главный хук, отдающий ВСЁ, что могут искать разные страницы
export const useTunaStore = () => {
  return {
    contentItems: initialContentItems,
    filteredContent: initialContentItems, // на случай если страница ищет отфильтрованный контент напрямую
    comments: initialComments,
    artItems: initialArtItems,
    genres: initialGenres,
    GENRES: GENRES,
    loading: false,
    error: null,
    isBoss: false,
    
    // Функции-заглушки
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

// Экспорт по умолчанию, если какая-то страница импортирует без фигурных скобок
export default useTunaStore
