import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ContentItem } from "@/components/content-card"
import type { Comment } from "@/components/comment-section"
import { supabase } from "./supabase"

// Art item for gallery
export interface ArtItem {
  id: string
  title: string
  imageUrl: string
  tags: string[] // hashtags like #Naruto, #Sasuke, etc.
  views: number
  rating: { tail: number; middle: number; head: number }
  createdAt: string
}

interface SiteSettings {
  leftBannerUrl: string
  rightBannerUrl: string
  featuredIds: string[]
}

interface TunaStore {
  // Boss authentication
  isBoss: boolean
  setBoss: (value: boolean) => void
  bossLogin: string
  bossPassword: string
  setBossCredentials: (login: string, password: string) => void

  // Content management
  content: ContentItem[]
  addContent: (item: ContentItem) => void
  removeContent: (id: string) => void
  updateContent: (id: string, updates: Partial<ContentItem>) => void

  // Arts gallery
  arts: ArtItem[]
  addArt: (item: ArtItem) => void
  removeArt: (id: string) => void
  updateArt: (id: string, updates: Partial<ArtItem>) => void

  // Art comments
  artComments: Record<string, Comment[]>
  addArtComment: (artId: string, comment: Comment) => void

  // Art ratings
  rateArt: (artId: string, rating: "tail" | "middle" | "head") => void

  // Comments
  comments: Record<string, Comment[]>
  addComment: (contentId: string, comment: Comment) => void

  // Ratings
  rateContent: (contentId: string, rating: "tail" | "middle" | "head") => void

  // Site settings
  settings: SiteSettings
  updateSettings: (updates: Partial<SiteSettings>) => void

  // Views
  incrementViews: (contentId: string) => void
  incrementArtViews: (artId: string) => void

  // Database Sync
  fetchFromDb: () => Promise<void>
}

const initialContent: ContentItem[] = [
  {
    id: "1",
    title: "Атака Титанов",
    description: "Человечество живёт в страхе перед гигантскими людоедами - Титанами. Последние люди укрылись за высокими стенами.",
    thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80",
    type: "video",
    genre: "Экшен",
    episodes: 87,
    views: 15234,
    rating: { tail: 5, middle: 23, head: 156 },
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2", 
    title: "Наруто",
    description: "История о молодом ниндзя Наруто Узумаки, который мечтает стать Хокаге - главой своей деревни.",
    thumbnail: "https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?w=800&q=80",
    type: "video",
    genre: "Сёнен",
    episodes: 720,
    views: 28471,
    rating: { tail: 12, middle: 45, head: 234 },
    createdAt: "2024-02-20T14:30:00Z"
  },
  {
    id: "3",
    title: "Твоё имя",
    description: "Двое подростков обнаруживают, что они магическим образом меняются телами.",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
    type: "video",
    genre: "Романтика",
    episodes: 1,
    views: 8923,
    rating: { tail: 2, middle: 15, head: 189 },
    createdAt: "2024-03-10T09:15:00Z"
  },
  {
    id: "4",
    title: "Ван Пис",
    description: "Монки Д. Луффи и его команда пиратов ищут величайшее сокровище - One Piece.",
    thumbnail: "https://images.unsplash.com/photo-1544986581-efac024faf62?w=800&q=80",
    type: "video",
    genre: "Приключения",
    episodes: 1100,
    views: 45892,
    rating: { tail: 8, middle: 67, head: 412 },
    createdAt: "2024-01-05T18:45:00Z"
  },
  {
    id: "5",
    title: "Клинок, рассекающий демонов",
    description: "Тандзиро отправляется в опасное путешествие, чтобы найти способ вернуть сестру-демона в человека.",
    thumbnail: "https://images.unsplash.com/photo-1569701813229-33284b643e3c?w=800&q=80",
    type: "video",
    genre: "Фэнтези",
    episodes: 55,
    views: 31456,
    rating: { tail: 3, middle: 28, head: 287 },
    createdAt: "2024-04-01T12:00:00Z"
  }
]

const initialArts: ArtItem[] = [
  {
    id: "art-1",
    title: "Эрен Йегер - Финальная форма",
    imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80",
    tags: ["АтакаТитанов", "Эрен", "Титан", "Фанарт"],
    views: 5234,
    rating: { tail: 2, middle: 15, head: 89 },
    createdAt: "2024-04-15T16:20:00Z"
  },
  {
    id: "art-2",
    title: "Наруто и Саске - Вечные соперники",
    imageUrl: "https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?w=800&q=80",
    tags: ["Наруто", "Саске", "Коноха", "Ниндзя", "Фанарт"],
    views: 8912,
    rating: { tail: 5, middle: 23, head: 156 },
    createdAt: "2024-04-20T10:30:00Z"
  },
  {
    id: "art-3",
    title: "Зеро Ту - Дорогой во Франксе",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
    tags: ["ZeroTwo", "DarlingInTheFranxx", "Вайфу", "Аниме"],
    views: 12456,
    rating: { tail: 1, middle: 8, head: 234 },
    createdAt: "2024-05-01T14:00:00Z"
  },
  {
    id: "art-4",
    title: "Луффи Gear 5",
    imageUrl: "https://images.unsplash.com/photo-1544986581-efac024faf62?w=800&q=80",
    tags: ["OnePiece", "Луффи", "Gear5", "Пираты"],
    views: 15678,
    rating: { tail: 3, middle: 12, head: 312 },
    createdAt: "2024-05-10T09:00:00Z"
  }
]

const initialComments: Record<string, Comment[]> = {
  "1": [
    { id: "c1", author: "АнимеФан2024", text: "Лучшее аниме ever! Эрен - топ персонаж!", createdAt: "2024-04-10T15:30:00Z" },
    { id: "c2", author: "Аноним", text: "Концовка конечно спорная, но в целом шедевр", createdAt: "2024-04-12T09:15:00Z" },
  ],
  "2": [
    { id: "c3", author: "Наруто_Фанат", text: "Датебайо! Классика навсегда!", createdAt: "2024-03-20T14:00:00Z" },
  ]
}

const initialArtComments: Record<string, Comment[]> = {
  "art-1": [
    { id: "ac1", author: "АртФан", text: "Невероятная детализация! Эрен выглядит эпично!", createdAt: "2024-04-16T10:00:00Z" }
  ]
}

export const useTunaStore = create<TunaStore>()(
  persist(
    (set, get) => ({
      // Boss auth
      isBoss: false,
      setBoss: (value) => set({ isBoss: value }),
      bossLogin: "tunec-anime/admin",
      bossPassword: "KIANABESTWAIFU",
      setBossCredentials: (login, password) => set({ bossLogin: login, bossPassword: password }),

      // Content
      content: initialContent,
      addContent: async (item) => {
        set((state) => ({ 
          content: [item, ...state.content] 
        }))

        // Sync with Supabase
        try {
          await supabase.from('anime').insert([{
            id: item.id,
            title: item.title,
            description: item.description,
            thumbnail: item.thumbnail,
            genre: item.genre,
            episodes: item.episodes,
            views: item.views,
            rating_head: item.rating.head,
            rating_middle: item.rating.middle,
            rating_tail: item.rating.tail,
          }])
        } catch (e) {
          console.error('Failed to sync new anime to Supabase:', e)
        }
      },
      removeContent: (id) => set((state) => ({ 
        content: state.content.filter(c => c.id !== id) 
      })),
      updateContent: (id, updates) => set((state) => ({
        content: state.content.map(c => 
          c.id === id ? { ...c, ...updates } : c
        )
      })),

      // Arts
      arts: initialArts,
      addArt: (item) => set((state) => ({
        arts: [item, ...state.arts]
      })),
      removeArt: (id) => set((state) => ({
        arts: state.arts.filter(a => a.id !== id)
      })),
      updateArt: (id, updates) => set((state) => ({
        arts: state.arts.map(a =>
          a.id === id ? { ...a, ...updates } : a
        )
      })),

      // Art comments
      artComments: initialArtComments,
      addArtComment: (artId, comment) => set((state) => ({
        artComments: {
          ...state.artComments,
          [artId]: [...(state.artComments[artId] || []), comment]
        }
      })),

      // Art ratings
      rateArt: (artId, rating) => set((state) => ({
        arts: state.arts.map(a => {
          if (a.id !== artId) return a
          return {
            ...a,
            rating: {
              ...a.rating,
              [rating]: a.rating[rating] + 1
            }
          }
        })
      })),

      // Comments
      comments: initialComments,
      addComment: (contentId, comment) => set((state) => ({
        comments: {
          ...state.comments,
          [contentId]: [...(state.comments[contentId] || []), comment]
        }
      })),

      // Ratings
      rateContent: (contentId, rating) => set((state) => ({
        content: state.content.map(c => {
          if (c.id !== contentId) return c
          return {
            ...c,
            rating: {
              ...c.rating,
              [rating]: c.rating[rating] + 1
            }
          }
        })
      })),

      // Settings
      settings: {
        leftBannerUrl: "",
        rightBannerUrl: "",
        featuredIds: ["1", "2", "3", "4"]
      },
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),

      // Views
      incrementViews: (contentId) => set((state) => ({
        content: state.content.map(c =>
          c.id === contentId ? { ...c, views: c.views + 1 } : c
        )
      })),
      incrementArtViews: (artId) => set((state) => ({
        arts: state.arts.map(a =>
          a.id === artId ? { ...a, views: a.views + 1 } : a
        )
      })),

      // Database Sync
      fetchFromDb: async () => {
        try {
          const { data, error } = await supabase
            .from('anime')
            .select('*')
            .order('created_at', { ascending: false })
          
          if (data && !error) {
            const formattedContent: ContentItem[] = data.map(item => ({
              id: item.id,
              title: item.title,
              description: item.description || "",
              thumbnail: item.thumbnail,
              type: "video",
              genre: item.genre || "Разное",
              episodes: item.episodes || 1,
              views: item.views,
              rating: {
                head: item.rating_head,
                middle: item.rating_middle,
                tail: item.rating_tail
              },
              createdAt: item.created_at
            }))
            set({ content: formattedContent })
          }
        } catch (e) {
          console.error('Failed to fetch from Supabase:', e)
        }
      }
    }),
    {
      name: "tuna-storage"
    }
  )
)

// Genre helpers
export const GENRES = [
  "Экшен", "Романтика", "Комедия", "Драма", "Фэнтези", 
  "Сёнен", "Сёдзё", "Меха", "Хоррор", "Приключения"
]

// Popular art tags
export const POPULAR_TAGS = [
  "Наруто", "Саске", "Эрен", "Луффи", "ZeroTwo", 
  "АтакаТитанов", "OnePiece", "Фанарт", "Вайфу", "Аниме"
]
