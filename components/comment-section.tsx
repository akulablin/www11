"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import { MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface Comment {
  id: string
  author: string
  text: string
  createdAt: string
}

interface CommentSectionProps {
  comments: Comment[]
  onAddComment?: (text: string, author: string) => void
}

export function CommentSection({ comments, onAddComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [author, setAuthor] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    onAddComment?.(newComment.trim(), author.trim() || "Аноним")
    setNewComment("")
  }

  const displayedComments = isExpanded ? comments : comments.slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">
          Комментарии ({comments.length})
        </h3>
      </div>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Ваше имя (необязательно)"
          className="w-full px-4 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Напишите комментарий..."
            rows={3}
            className="flex-1 px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <Button type="submit" size="icon" className="self-end h-12 w-12">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {displayedComments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
        
        {comments.length > 3 && !isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Показать ещё {comments.length - 3} комментариев
          </button>
        )}
        
        {comments.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            Пока нет комментариев. Будь первым!
          </p>
        )}
      </div>
    </div>
  )
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-3 p-4 rounded-lg bg-secondary/50 border border-border">
      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
        <span className="text-primary font-semibold text-sm">
          {comment.author.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-foreground">{comment.author}</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.createdAt), { 
              addSuffix: true,
              locale: ru 
            })}
          </span>
        </div>
        <p className="text-muted-foreground text-sm">{comment.text}</p>
      </div>
    </div>
  )
}
