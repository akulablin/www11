"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type Rating = "tail" | "middle" | "head" | null

interface FishRatingProps {
  initialRating?: Rating
  onRate?: (rating: Rating) => void
  readonly?: boolean
  counts?: { tail: number; middle: number; head: number }
}

export function FishRating({ initialRating = null, onRate, readonly = false, counts }: FishRatingProps) {
  const [rating, setRating] = useState<Rating>(initialRating)
  const [hoveredRating, setHoveredRating] = useState<Rating>(null)

  const handleRate = (newRating: Rating) => {
    if (readonly) return
    const finalRating = rating === newRating ? null : newRating
    setRating(finalRating)
    onRate?.(finalRating)
  }

  const ratingOptions = [
    { key: "tail" as const, label: "Хвост", emoji: "🐟", description: "Плохо", color: "text-destructive" },
    { key: "middle" as const, label: "Середина", emoji: "🐠", description: "Средняк", color: "text-tuna-gold" },
    { key: "head" as const, label: "Голова", emoji: "🎏", description: "Супер!", color: "text-primary" },
  ]

  return (
    <div className="flex items-center gap-4">
      {ratingOptions.map((option) => {
        const isActive = rating === option.key
        const isHovered = hoveredRating === option.key
        
        return (
          <button
            key={option.key}
            onClick={() => handleRate(option.key)}
            onMouseEnter={() => !readonly && setHoveredRating(option.key)}
            onMouseLeave={() => setHoveredRating(null)}
            disabled={readonly}
            className={cn(
              "flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200",
              !readonly && "hover:bg-secondary cursor-pointer",
              isActive && "bg-secondary ring-2 ring-primary",
              readonly && "cursor-default"
            )}
          >
            <span 
              className={cn(
                "text-3xl transition-transform duration-200",
                (isActive || isHovered) && "scale-125"
              )}
            >
              {option.emoji}
            </span>
            <span className={cn(
              "text-xs font-medium",
              isActive ? option.color : "text-muted-foreground"
            )}>
              {option.description}
            </span>
            {counts && (
              <span className="text-xs text-muted-foreground">
                {counts[option.key]}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function RatingDisplay({ rating }: { rating: { tail: number; middle: number; head: number } }) {
  const total = rating.tail + rating.middle + rating.head
  if (total === 0) return <span className="text-muted-foreground text-sm">Нет оценок</span>
  
  const score = (rating.head * 3 + rating.middle * 2 + rating.tail) / total
  const emoji = score >= 2.5 ? "🎏" : score >= 1.5 ? "🐠" : "🐟"
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-xl">{emoji}</span>
      <span className="text-sm text-muted-foreground">{score.toFixed(1)}/3</span>
      <span className="text-xs text-muted-foreground">({total})</span>
    </div>
  )
}
