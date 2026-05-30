"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Download, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { RatingDisplay } from "./fish-rating"

export interface ContentItem {
  id: string
  title: string
  description?: string
  thumbnail: string
  type: "video" | "image"
  genre?: string
  episodes?: number
  views: number
  rating: { tail: number; middle: number; head: number }
  createdAt: string
}

interface ContentCardProps {
  content: ContentItem
  isBoss?: boolean
  onDelete?: (id: string) => void
}

export function ContentCard({ content, isBoss, onDelete }: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={`/watch/${content.id}`}>
      <article
        className={cn(
          "group relative rounded-xl overflow-hidden bg-card border border-border",
          "transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10",
          "hover:-translate-y-1"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={content.thumbnail}
            alt={content.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent",
            "transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-60"
          )} />
          
          {/* Play button */}
          {content.type === "video" && (
            <div className={cn(
              "absolute inset-0 flex items-center justify-center",
              "transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}>
              <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
              </div>
            </div>
          )}

          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <span className={cn(
              "px-2 py-1 text-xs font-medium rounded-md",
              content.type === "video" 
                ? "bg-primary text-primary-foreground" 
                : "bg-tuna-orange text-background"
            )}>
              {content.type === "video" ? "Видео" : "Фото"}
            </span>
          </div>

          {/* Genre badge */}
          {content.genre && (
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 text-xs font-medium rounded-md bg-secondary/80 text-secondary-foreground">
                {content.genre}
              </span>
            </div>
          )}

          {/* Episodes count */}
          {content.episodes && (
            <div className="absolute bottom-3 right-3">
              <span className="px-2 py-1 text-xs font-medium rounded-md bg-background/80 text-foreground">
                {content.episodes} серий
              </span>
            </div>
          )}
        </div>

        {/* Content info */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-1 mb-2 group-hover:text-primary transition-colors">
            {content.title}
          </h3>
          
          {content.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {content.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <RatingDisplay rating={content.rating} />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span>{content.views.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Boss delete button */}
        {isBoss && onDelete && (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDelete(content.id)
            }}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        )}
      </article>
    </Link>
  )
}

export function ContentGrid({ 
  items, 
  isBoss,
  onDelete 
}: { 
  items: ContentItem[]
  isBoss?: boolean
  onDelete?: (id: string) => void 
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <ContentCard 
          key={item.id} 
          content={item} 
          isBoss={isBoss}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
