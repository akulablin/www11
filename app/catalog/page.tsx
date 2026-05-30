"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContentGrid } from "@/components/content-card"
import { useTunaStore, GENRES } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"

type SortOption = "recent" | "views" | "rating"
type TypeFilter = "all" | "video" | "image"

export default function CatalogPage() {
  const { content, isBoss } = useTunaStore()
  const [search, setSearch] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>("recent")
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")
  const [showFilters, setShowFilters] = useState(false)

  // Filter and sort content
  let filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
    const matchesGenre = !selectedGenre || item.genre === selectedGenre
    const matchesType = typeFilter === "all" || item.type === typeFilter
    return matchesSearch && matchesGenre && matchesType
  })

  // Sort
  filteredContent = [...filteredContent].sort((a, b) => {
    switch (sortBy) {
      case "views":
        return b.views - a.views
      case "rating":
        const scoreA = (a.rating.head * 3 + a.rating.middle * 2 + a.rating.tail) / Math.max(1, a.rating.head + a.rating.middle + a.rating.tail)
        const scoreB = (b.rating.head * 3 + b.rating.middle * 2 + b.rating.tail) / Math.max(1, b.rating.head + b.rating.middle + b.rating.tail)
        return scoreB - scoreA
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const activeFiltersCount = [selectedGenre, typeFilter !== "all"].filter(Boolean).length

  return (
    <div className="min-h-screen flex flex-col">
      <Header isBoss={isBoss} />
      
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Каталог</h1>
            <p className="text-muted-foreground">
              {filteredContent.length} из {content.length} тайтлов
            </p>
          </div>

          {/* Search and filters */}
          <div className="space-y-4 mb-8">
            {/* Search bar */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск по названию..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className={cn(activeFiltersCount > 0 && "border-primary text-primary")}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Фильтры
                {activeFiltersCount > 0 && (
                  <span className="ml-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Filters panel */}
            {showFilters && (
              <div className="p-6 rounded-xl bg-card border border-border space-y-6">
                {/* Type filter */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Тип</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "all" as const, label: "Все" },
                      { value: "video" as const, label: "Видео" },
                      { value: "image" as const, label: "Фото" }
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setTypeFilter(type.value)}
                        className={cn(
                          "px-4 py-2 rounded-lg transition-colors",
                          typeFilter === type.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        )}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Сортировка</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "recent" as const, label: "Новые" },
                      { value: "views" as const, label: "Популярные" },
                      { value: "rating" as const, label: "По оценкам" }
                    ].map((sort) => (
                      <button
                        key={sort.value}
                        onClick={() => setSortBy(sort.value)}
                        className={cn(
                          "px-4 py-2 rounded-lg transition-colors",
                          sortBy === sort.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        )}
                      >
                        {sort.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Genre filter */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Жанр</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedGenre(null)}
                      className={cn(
                        "px-4 py-2 rounded-lg transition-colors",
                        !selectedGenre
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      )}
                    >
                      Все жанры
                    </button>
                    {GENRES.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        className={cn(
                          "px-4 py-2 rounded-lg transition-colors",
                          selectedGenre === genre
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        )}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear filters */}
                {activeFiltersCount > 0 && (
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setSelectedGenre(null)
                      setTypeFilter("all")
                    }}
                    className="text-muted-foreground"
                  >
                    Сбросить фильтры
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Content grid */}
          {filteredContent.length > 0 ? (
            <ContentGrid items={filteredContent} isBoss={isBoss} />
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                Ничего не найдено по вашему запросу
              </p>
              <Button variant="outline" onClick={() => {
                setSearch("")
                setSelectedGenre(null)
                setTypeFilter("all")
              }}>
                Сбросить фильтры
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
