"use client"

import Link from "next/link"
import { TunaLogo } from "@/components/tuna-logo"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContentGrid } from "@/components/content-card"
import { useTunaStore, GENRES } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ChevronRight, Sparkles, TrendingUp, Film, Image } from "lucide-react"
import { useEffect } from "react"

export default function HomePage() {
  const { content, isBoss, settings, fetchFromDb } = useTunaStore()

  useEffect(() => {
    fetchFromDb()
  }, [fetchFromDb])
  
  const featuredContent = content.filter(c => settings.featuredIds.includes(c.id))
  const recentContent = content.slice(0, 8)
  const topRated = [...content].sort((a, b) => {
    const scoreA = (a.rating.head * 3 + a.rating.middle * 2 + a.rating.tail) / Math.max(1, a.rating.head + a.rating.middle + a.rating.tail)
    const scoreB = (b.rating.head * 3 + b.rating.middle * 2 + b.rating.tail) / Math.max(1, b.rating.head + b.rating.middle + b.rating.tail)
    return scoreB - scoreA
  }).slice(0, 4)

  return (
    <div className="min-h-screen flex flex-col">
      <Header isBoss={isBoss} />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
          
          {/* Animated fish background */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`
                }}
              >
                <TunaLogo className="w-24 h-24" />
              </div>
            ))}
          </div>

          <div className="relative max-w-7xl mx-auto px-4 text-center">
            {/* Tuna mascot */}
            <div className="flex justify-center mb-6">
              <TunaLogo className="w-24 h-24 md:w-32 md:h-32 animate-bounce" />
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-primary mb-4 tracking-tight">
              ТУНЕЦ
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
              Смотри аниме онлайн бесплатно. Без регистрации. Без рекламы. Только рыба и аниме!
            </p>

            {/* CTA */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/catalog">
                <Button size="lg" className="text-lg px-8">
                  <Film className="w-5 h-5 mr-2" />
                  Смотреть
                </Button>
              </Link>
              <Link href="/genres">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Жанры
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{content.length}</div>
                <div className="text-sm text-muted-foreground">Тайтлов</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-tuna-orange">
                  {content.reduce((sum, c) => sum + c.views, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Просмотров</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-tuna-gold">{GENRES.length}</div>
                <div className="text-sm text-muted-foreground">Жанров</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Section */}
        {featuredContent.length > 0 && (
          <section className="py-12 px-4 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-tuna-gold" />
                <h2 className="text-2xl font-bold text-foreground">Рекомендуем</h2>
              </div>
              {isBoss && (
                <Link href="/boss">
                  <Button variant="ghost" size="sm" className="text-primary">
                    + Изменить
                  </Button>
                </Link>
              )}
            </div>
            <ContentGrid items={featuredContent} isBoss={isBoss} />
          </section>
        )}

        {/* Top Rated */}
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Топ по оценкам</h2>
            </div>
            <Link href="/catalog?sort=rating">
              <Button variant="ghost" size="sm">
                Посмотреть все <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <ContentGrid items={topRated} isBoss={isBoss} />
        </section>

        {/* Recent Content */}
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Film className="w-6 h-6 text-tuna-orange" />
              <h2 className="text-2xl font-bold text-foreground">Последние добавления</h2>
            </div>
            <Link href="/catalog">
              <Button variant="ghost" size="sm">
                Посмотреть все <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <ContentGrid items={recentContent} isBoss={isBoss} />
        </section>

        {/* Genres Preview */}
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Жанры</h2>
            <Link href="/genres">
              <Button variant="ghost" size="sm">
                Все жанры <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {GENRES.slice(0, 8).map((genre) => (
              <Link key={genre} href={`/catalog?genre=${genre}`}>
                <div className="px-4 py-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                  {genre}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
