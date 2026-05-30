"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useTunaStore, GENRES } from "@/lib/store"
import { Film, Image as ImageIcon, ChevronRight } from "lucide-react"

export default function GenresPage() {
  const { content, isBoss } = useTunaStore()

  const genreStats = GENRES.map(genre => {
    const items = content.filter(c => c.genre === genre)
    const videos = items.filter(c => c.type === "video").length
    const images = items.filter(c => c.type === "image").length
    const totalViews = items.reduce((sum, c) => sum + c.views, 0)
    return { genre, count: items.length, videos, images, totalViews }
  }).filter(g => g.count > 0)

  return (
    <div className="min-h-screen flex flex-col">
      <Header isBoss={isBoss} />
      
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Жанры</h1>
            <p className="text-muted-foreground">
              Выберите жанр чтобы найти аниме по душе
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {genreStats.map(({ genre, count, videos, images, totalViews }) => (
              <Link key={genre} href={`/catalog?genre=${genre}`}>
                <div className="p-6 rounded-xl bg-card border border-border hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {genre}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{count} тайтлов</span>
                    {videos > 0 && (
                      <span className="flex items-center gap-1">
                        <Film className="w-4 h-4" />
                        {videos}
                      </span>
                    )}
                    {images > 0 && (
                      <span className="flex items-center gap-1">
                        <ImageIcon className="w-4 h-4" />
                        {images}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-3 text-xs text-muted-foreground">
                    {totalViews.toLocaleString()} просмотров
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {genreStats.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                Пока нет контента с жанрами
              </p>
            </div>
          )}

          {/* All genres list */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-foreground mb-4">Все жанры</h2>
            <div className="flex flex-wrap gap-3">
              {GENRES.map((genre) => {
                const hasContent = content.some(c => c.genre === genre)
                return (
                  <Link key={genre} href={`/catalog?genre=${genre}`}>
                    <div className={`px-4 py-2 rounded-full transition-colors ${
                      hasContent 
                        ? "bg-secondary hover:bg-primary hover:text-primary-foreground cursor-pointer"
                        : "bg-secondary/50 text-muted-foreground cursor-default"
                    }`}>
                      {genre}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
