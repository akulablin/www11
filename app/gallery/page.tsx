"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Hash, Eye, X, MessageCircle, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FishRating } from "@/components/fish-rating"
import { useTunaStore, POPULAR_TAGS, type ArtItem } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"

export default function GalleryPage() {
  const { arts, isBoss, rateArt, artComments, addArtComment, incrementArtViews } = useTunaStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedArt, setSelectedArt] = useState<ArtItem | null>(null)
  const [comment, setComment] = useState("")
  const [author, setAuthor] = useState("")

  // Get all unique tags from arts
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    arts.forEach(art => art.tags.forEach(tag => tags.add(tag)))
    return Array.from(tags)
  }, [arts])

  // Filter arts by search and tags
  const filteredArts = useMemo(() => {
    return arts.filter(art => {
      const matchesSearch = searchQuery === "" || 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.every(tag => art.tags.includes(tag))
      
      return matchesSearch && matchesTags
    })
  }, [arts, searchQuery, selectedTags])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const openArt = (art: ArtItem) => {
    setSelectedArt(art)
    incrementArtViews(art.id)
  }

  const handleAddComment = () => {
    if (!comment.trim() || !selectedArt) return
    addArtComment(selectedArt.id, {
      id: `comment-${Date.now()}`,
      author: author.trim() || "Аноним",
      text: comment.trim(),
      createdAt: new Date().toISOString()
    })
    setComment("")
  }

  const currentIndex = selectedArt ? filteredArts.findIndex(a => a.id === selectedArt.id) : -1
  
  const goToNext = () => {
    if (currentIndex < filteredArts.length - 1) {
      openArt(filteredArts[currentIndex + 1])
    }
  }
  
  const goToPrev = () => {
    if (currentIndex > 0) {
      openArt(filteredArts[currentIndex - 1])
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedArt) return
      if (e.key === "ArrowRight") goToNext()
      if (e.key === "ArrowLeft") goToPrev()
      if (e.key === "Escape") setSelectedArt(null)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedArt, currentIndex])

  return (
    <div className="min-h-screen bg-background">
      <Header isBoss={isBoss} />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Галерея Артов
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Коллекция фан-артов аниме персонажей. Используй хэштеги для поиска любимых героев!
            </p>
          </div>

          {/* Search and filters */}
          <div className="mb-8 space-y-4">
            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию или тегам..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Popular tags */}
            <div className="flex flex-wrap justify-center gap-2">
              {POPULAR_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm transition-colors flex items-center gap-1",
                    selectedTags.includes(tag)
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                  )}
                >
                  <Hash className="w-3 h-3" />
                  {tag}
                </button>
              ))}
            </div>

            {/* Selected tags */}
            {selectedTags.length > 0 && (
              <div className="flex justify-center items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Выбрано:</span>
                {selectedTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="px-2 py-1 rounded-full bg-primary/20 text-primary text-sm flex items-center gap-1"
                  >
                    #{tag}
                    <X className="w-3 h-3" />
                  </button>
                ))}
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Сбросить
                </button>
              </div>
            )}
          </div>

          {/* Results count */}
          <p className="text-muted-foreground mb-6">
            Найдено: {filteredArts.length} {filteredArts.length === 1 ? "арт" : filteredArts.length < 5 ? "арта" : "артов"}
          </p>

          {/* Gallery grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredArts.map(art => (
              <button
                key={art.id}
                onClick={() => openArt(art)}
                className="group relative aspect-square rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all"
              >
                <Image
                  src={art.imageUrl}
                  alt={art.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                  <h3 className="text-white font-medium text-sm truncate">{art.title}</h3>
                  <div className="flex items-center gap-2 text-white/70 text-xs mt-1">
                    <Eye className="w-3 h-3" />
                    {art.views.toLocaleString()}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredArts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">Ничего не найдено</p>
              <p className="text-muted-foreground text-sm mt-2">Попробуйте изменить поисковый запрос или теги</p>
            </div>
          )}
        </div>
      </main>

      {/* Art viewer modal */}
      {selectedArt && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex">
          {/* Close button */}
          <button
            onClick={() => setSelectedArt(null)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation */}
          {currentIndex > 0 && (
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {currentIndex < filteredArts.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground md:right-[340px]"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Image */}
          <div className="flex-1 flex items-center justify-center p-4 md:pr-[340px]">
            <div className="relative max-w-full max-h-full">
              <Image
                src={selectedArt.imageUrl}
                alt={selectedArt.title}
                width={1200}
                height={1200}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden md:block fixed right-0 top-0 bottom-0 w-[320px] bg-card border-l border-border overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-2">{selectedArt.title}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {formatDistanceToNow(new Date(selectedArt.createdAt), { locale: ru, addSuffix: true })}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {selectedArt.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {selectedArt.views.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {(artComments[selectedArt.id] || []).length}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-foreground mb-2">Оценить</h3>
                <FishRating
                  rating={selectedArt.rating}
                  onRate={(type) => rateArt(selectedArt.id, type)}
                />
              </div>

              {/* Download */}
              <a
                href={selectedArt.imageUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mb-6 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                Скачать
              </a>

              {/* Comments */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Комментарии</h3>
                
                {/* Add comment */}
                <div className="mb-4 space-y-2">
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Ваше имя (необязательно)"
                    className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Напишите комментарий..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                  <Button size="sm" onClick={handleAddComment} disabled={!comment.trim()}>
                    Отправить
                  </Button>
                </div>

                {/* Comments list */}
                <div className="space-y-3">
                  {(artComments[selectedArt.id] || []).map(c => (
                    <div key={c.id} className="p-3 rounded-lg bg-secondary">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-foreground">{c.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(c.createdAt), { locale: ru, addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{c.text}</p>
                    </div>
                  ))}
                  {(artComments[selectedArt.id] || []).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">Пока нет комментариев</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
