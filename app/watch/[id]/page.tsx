"use client"

import { use, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, Eye, ChevronDown, Play } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FishRating } from "@/components/fish-rating"
import { CommentSection, Comment } from "@/components/comment-section"
import { useTunaStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WatchPageProps {
  params: Promise<{ id: string }>
}

const QUALITY_OPTIONS = [
  { label: "360p", value: "360" },
  { label: "720p", value: "720" },
  { label: "1080p", value: "1080" },
]

export default function WatchPage({ params }: WatchPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { content, isBoss, comments, rateContent, addComment, incrementViews } = useTunaStore()
  const [selectedQuality, setSelectedQuality] = useState("1080")
  const [showQualityMenu, setShowQualityMenu] = useState(false)
  const [watchQuality, setWatchQuality] = useState("1080")
  const [showWatchQualityMenu, setShowWatchQualityMenu] = useState(false)
  const [userRating, setUserRating] = useState<"tail" | "middle" | "head" | null>(null)

  const item = content.find(c => c.id === id)
  const contentComments = comments[id] || []

  useEffect(() => {
    if (item) {
      incrementViews(id)
    }
  }, [id])

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isBoss={isBoss} />
        <main className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Контент не найден</h1>
            <Link href="/">
              <Button>Вернуться на главную</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleRate = (rating: "tail" | "middle" | "head" | null) => {
    if (rating && rating !== userRating) {
      rateContent(id, rating)
      setUserRating(rating)
    }
  }

  const handleAddComment = (text: string, author: string) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      author,
      text,
      createdAt: new Date().toISOString()
    }
    addComment(id, newComment)
  }

  const handleDownload = () => {
    // In a real app, this would trigger actual file download
    alert(`Скачивание в качестве ${selectedQuality}p начнётся автоматически...`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isBoss={isBoss} />
      
      <main className="flex-1 pt-16">
        {/* Back button */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </button>
        </div>

        {/* Video/Image Player Area */}
        <div className="bg-card">
          <div className="max-w-7xl mx-auto">
            <div className="relative aspect-video bg-background">
              {item.type === "video" ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover opacity-50"
                  />
                  <div className="relative z-10 text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center mb-4 mx-auto cursor-pointer hover:scale-110 transition-transform">
                      <svg className="w-10 h-10 text-primary-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <p className="text-foreground/80 mb-4">Нажмите для воспроизведения</p>
                    
                    {/* Watch quality selector */}
                    <div className="relative inline-block">
                      <button
                        onClick={() => setShowWatchQualityMenu(!showWatchQualityMenu)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/80 text-foreground hover:bg-secondary transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        <span>Качество: {watchQuality}p</span>
                        <ChevronDown className={cn(
                          "w-4 h-4 transition-transform",
                          showWatchQualityMenu && "rotate-180"
                        )} />
                      </button>
                      
                      {showWatchQualityMenu && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 rounded-lg bg-popover border border-border shadow-lg z-20 overflow-hidden min-w-32">
                          {QUALITY_OPTIONS.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setWatchQuality(option.value)
                                setShowWatchQualityMenu(false)
                              }}
                              className={cn(
                                "w-full px-4 py-2 text-left hover:bg-secondary transition-colors",
                                watchQuality === option.value && "bg-primary/20 text-primary"
                              )}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-contain"
                />
              )}
            </div>
          </div>
        </div>

        {/* Content Info */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title and meta */}
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  {item.genre && (
                    <span className="px-3 py-1 text-sm rounded-full bg-primary/20 text-primary">
                      {item.genre}
                    </span>
                  )}
                  {item.type === "video" && item.episodes && (
                    <span className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground">
                      {item.episodes} серий
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-4">{item.title}</h1>
                {item.description && (
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span>{item.views.toLocaleString()} просмотров</span>
                </div>
              </div>

              {/* Rating section */}
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-4">Оцените контент</h3>
                <FishRating 
                  initialRating={userRating}
                  onRate={handleRate}
                  counts={item.rating}
                />
                {userRating && (
                  <p className="text-sm text-primary mt-4">
                    Спасибо за оценку!
                  </p>
                )}
              </div>

              {/* Comments */}
              <div className="p-6 rounded-xl bg-card border border-border">
                <CommentSection 
                  comments={contentComments}
                  onAddComment={handleAddComment}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Download card */}
              <div className="p-6 rounded-xl bg-card border border-border sticky top-20">
                <h3 className="font-semibold text-foreground mb-4">Скачать</h3>
                
                {/* Quality selector */}
                <div className="relative mb-4">
                  <button
                    onClick={() => setShowQualityMenu(!showQualityMenu)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                  >
                    <span>Качество: {selectedQuality}p</span>
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform",
                      showQualityMenu && "rotate-180"
                    )} />
                  </button>
                  
                  {showQualityMenu && (
                    <div className="absolute top-full left-0 right-0 mt-2 rounded-lg bg-popover border border-border shadow-lg z-10 overflow-hidden">
                      {QUALITY_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSelectedQuality(option.value)
                            setShowQualityMenu(false)
                          }}
                          className={cn(
                            "w-full px-4 py-3 text-left hover:bg-secondary transition-colors",
                            selectedQuality === option.value && "bg-primary/20 text-primary"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

<Button onClick={handleDownload} className="w-full" size="lg">
  <Download className="w-5 h-5 mr-2" />
  Скачать {selectedQuality}p
  </Button>
  </div>

              {/* Related content placeholder */}
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-4">Похожее</h3>
                <div className="space-y-3">
                  {content.filter(c => c.id !== id && c.genre === item.genre).slice(0, 3).map((related) => (
                    <Link key={related.id} href={`/watch/${related.id}`}>
                      <div className="flex gap-3 p-2 rounded-lg hover:bg-secondary transition-colors">
                        <div className="relative w-20 h-12 rounded overflow-hidden shrink-0">
                          <Image
                            src={related.thumbnail}
                            alt={related.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-medium text-sm text-foreground line-clamp-1">
                            {related.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {related.views.toLocaleString()} просмотров
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
