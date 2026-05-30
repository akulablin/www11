"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { 
  Plus, Trash2, Settings, Image as ImageIcon, Film, 
  Save, LogOut, Eye, Home, LayoutGrid, Star, X,
  Lock, Palette, Hash, KeyRound
} from "lucide-react"
import { TunaLogo } from "@/components/tuna-logo"
import { useTunaStore, GENRES, POPULAR_TAGS, type ArtItem } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ContentItem } from "@/components/content-card"

type Tab = "content" | "arts" | "featured" | "settings"

export default function BossPage() {
  const router = useRouter()
  const { 
    isBoss, setBoss, bossLogin, bossPassword, setBossCredentials,
    content, addContent, removeContent,
    arts, addArt, removeArt,
    settings, updateSettings
  } = useTunaStore()
  
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<Tab>("content")
  const [showAddForm, setShowAddForm] = useState(false)
  const [showAddArtForm, setShowAddArtForm] = useState(false)
  const [newContent, setNewContent] = useState<Partial<ContentItem>>({
    type: "video",
    rating: { tail: 0, middle: 0, head: 0 },
    views: 0
  })
  const [newArt, setNewArt] = useState<Partial<ArtItem>>({
    tags: [],
    rating: { tail: 0, middle: 0, head: 0 },
    views: 0
  })
  const [newTag, setNewTag] = useState("")
  
  // Password change
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")

  // Login
  if (!isBoss) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md p-8 rounded-2xl bg-card border border-border">
          <div className="flex flex-col items-center mb-8">
            <TunaLogo className="w-20 h-20 mb-4" />
            <h1 className="text-2xl font-bold text-foreground">Панель Босса</h1>
            <p className="text-muted-foreground text-sm">Введите логин и пароль для доступа</p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault()
            if (login === bossLogin && password === bossPassword) {
              setBoss(true)
              setError("")
            } else {
              setError("Неверный логин или пароль")
            }
          }}>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Логин"
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />
            {error && (
              <p className="text-destructive text-sm mb-4">{error}</p>
            )}
            <Button type="submit" className="w-full" size="lg">
              Войти
            </Button>
          </form>

          <Link href="/">
            <Button variant="ghost" className="w-full mt-4">
              <Home className="w-4 h-4 mr-2" />
              Вернуться на главную
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleAddContent = () => {
    if (!newContent.title || !newContent.thumbnail) {
      alert("Заполните название и URL картинки")
      return
    }
    
    const item: ContentItem = {
      id: `content-${Date.now()}`,
      title: newContent.title || "",
      description: newContent.description,
      thumbnail: newContent.thumbnail || "",
      type: newContent.type || "video",
      genre: newContent.genre,
      episodes: newContent.episodes,
      views: 0,
      rating: { tail: 0, middle: 0, head: 0 },
      createdAt: new Date().toISOString()
    }
    
    addContent(item)
    setNewContent({
      type: "video",
      rating: { tail: 0, middle: 0, head: 0 },
      views: 0
    })
    setShowAddForm(false)
  }

  const handleAddArt = () => {
    if (!newArt.title || !newArt.imageUrl) {
      alert("Заполните название и URL картинки")
      return
    }
    
    const item: ArtItem = {
      id: `art-${Date.now()}`,
      title: newArt.title || "",
      imageUrl: newArt.imageUrl || "",
      tags: newArt.tags || [],
      views: 0,
      rating: { tail: 0, middle: 0, head: 0 },
      createdAt: new Date().toISOString()
    }
    
    addArt(item)
    setNewArt({
      tags: [],
      rating: { tail: 0, middle: 0, head: 0 },
      views: 0
    })
    setShowAddArtForm(false)
  }

  const addTagToArt = () => {
    if (!newTag.trim()) return
    const tag = newTag.trim().replace(/^#/, "")
    if (!newArt.tags?.includes(tag)) {
      setNewArt({ ...newArt, tags: [...(newArt.tags || []), tag] })
    }
    setNewTag("")
  }

  const removeTagFromArt = (tag: string) => {
    setNewArt({ ...newArt, tags: newArt.tags?.filter(t => t !== tag) })
  }

  const handlePasswordChange = () => {
    setPasswordError("")
    setPasswordSuccess("")
    
    if (currentPassword !== bossPassword) {
      setPasswordError("Неверный текущий пароль")
      return
    }
    if (newPassword.length < 4) {
      setPasswordError("Новый пароль должен быть минимум 4 символа")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Пароли не совпадают")
      return
    }
    
    setBossCredentials(bossLogin, newPassword)
    setPasswordSuccess("Пароль успешно изменён!")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setTimeout(() => {
      setShowPasswordChange(false)
      setPasswordSuccess("")
    }, 2000)
  }

  const toggleFeatured = (id: string) => {
    const currentFeatured = settings.featuredIds
    if (currentFeatured.includes(id)) {
      updateSettings({ featuredIds: currentFeatured.filter(fid => fid !== id) })
    } else {
      updateSettings({ featuredIds: [...currentFeatured, id] })
    }
  }

  const tabs = [
    { id: "content" as const, label: "Контент", icon: LayoutGrid },
    { id: "arts" as const, label: "Арты", icon: Palette },
    { id: "featured" as const, label: "Рекомендуемое", icon: Star },
    { id: "settings" as const, label: "Настройки", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Boss header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <TunaLogo className="w-10 h-10" />
                <span className="text-xl font-bold text-primary">ТУНЕЦ</span>
              </Link>
              <span className="px-3 py-1 rounded-full bg-tuna-orange/20 text-tuna-orange text-sm font-medium">
                Режим Босса
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Просмотр сайта
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setBoss(false)}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-16 flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-border p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Всего контента</p>
              <p className="text-2xl font-bold text-foreground">{content.length}</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Всего артов</p>
              <p className="text-2xl font-bold text-foreground">{arts.length}</p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 ml-64 p-8">
          {/* Content tab */}
          {activeTab === "content" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Управление контентом</h1>
                  <p className="text-muted-foreground">Добавляйте и удаляйте аниме</p>
                </div>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить
                </Button>
              </div>

              {/* Add form modal */}
              {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                  <div className="w-full max-w-2xl p-6 rounded-2xl bg-card border border-border shadow-xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">Добавить контент</h2>
                      <button onClick={() => setShowAddForm(false)}>
                        <X className="w-6 h-6 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Type */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Тип</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setNewContent({ ...newContent, type: "video" })}
                            className={cn(
                              "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors",
                              newContent.type === "video"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground"
                            )}
                          >
                            <Film className="w-4 h-4" />
                            Видео
                          </button>
                          <button
                            onClick={() => setNewContent({ ...newContent, type: "image" })}
                            className={cn(
                              "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors",
                              newContent.type === "image"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground"
                            )}
                          >
                            <ImageIcon className="w-4 h-4" />
                            Фото
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Название *</label>
                        <input
                          type="text"
                          value={newContent.title || ""}
                          onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                          placeholder="Название аниме"
                          className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Описание</label>
                        <textarea
                          value={newContent.description || ""}
                          onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                          placeholder="Описание"
                          rows={3}
                          className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        />
                      </div>

                      {/* Thumbnail URL */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">URL картинки *</label>
                        <input
                          type="text"
                          value={newContent.thumbnail || ""}
                          onChange={(e) => setNewContent({ ...newContent, thumbnail: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      {/* Genre */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Жанр</label>
                        <select
                          value={newContent.genre || ""}
                          onChange={(e) => setNewContent({ ...newContent, genre: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Выберите жанр</option>
                          {GENRES.map((genre) => (
                            <option key={genre} value={genre}>{genre}</option>
                          ))}
                        </select>
                      </div>

                      {/* Episodes */}
                      {newContent.type === "video" && (
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">Количество серий</label>
                          <input
                            type="number"
                            value={newContent.episodes || ""}
                            onChange={(e) => setNewContent({ ...newContent, episodes: parseInt(e.target.value) || undefined })}
                            placeholder="12"
                            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      )}

                      {/* Preview */}
                      {newContent.thumbnail && (
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">Превью</label>
                          <div className="relative aspect-video rounded-lg overflow-hidden bg-secondary">
                            <Image
                              src={newContent.thumbnail}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3 pt-4">
                        <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                          Отмена
                        </Button>
                        <Button onClick={handleAddContent} className="flex-1">
                          <Plus className="w-4 h-4 mr-2" />
                          Добавить
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Content list */}
              <div className="space-y-3">
                {content.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="relative w-32 h-20 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
                        <span className={cn(
                          "px-2 py-0.5 text-xs rounded-full",
                          item.type === "video"
                            ? "bg-primary/20 text-primary"
                            : "bg-tuna-orange/20 text-tuna-orange"
                        )}>
                          {item.type === "video" ? "Видео" : "Фото"}
                        </span>
                        {settings.featuredIds.includes(item.id) && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-tuna-gold/20 text-tuna-gold">
                            Рекомендуемое
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {item.genre} {item.views.toLocaleString()} просмотров
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/watch/${item.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleFeatured(item.id)}
                        className={settings.featuredIds.includes(item.id) ? "text-tuna-gold" : ""}
                      >
                        <Star className={cn(
                          "w-4 h-4",
                          settings.featuredIds.includes(item.id) && "fill-current"
                        )} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          if (confirm("Удалить этот контент?")) {
                            removeContent(item.id)
                          }
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Arts tab */}
          {activeTab === "arts" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Управление артами</h1>
                  <p className="text-muted-foreground">Добавляйте арты с хэштегами</p>
                </div>
                <Button onClick={() => setShowAddArtForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить арт
                </Button>
              </div>

              {/* Add art form modal */}
              {showAddArtForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                  <div className="w-full max-w-2xl p-6 rounded-2xl bg-card border border-border shadow-xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">Добавить арт</h2>
                      <button onClick={() => setShowAddArtForm(false)}>
                        <X className="w-6 h-6 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Title */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Название *</label>
                        <input
                          type="text"
                          value={newArt.title || ""}
                          onChange={(e) => setNewArt({ ...newArt, title: e.target.value })}
                          placeholder="Название арта"
                          className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      {/* Image URL */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">URL картинки *</label>
                        <input
                          type="text"
                          value={newArt.imageUrl || ""}
                          onChange={(e) => setNewArt({ ...newArt, imageUrl: e.target.value })}
                          placeholder="https://example.com/art.jpg"
                          className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Хэштеги</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTagToArt())}
                            placeholder="#Наруто"
                            className="flex-1 px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <Button onClick={addTagToArt}>
                            <Hash className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {/* Current tags */}
                        {newArt.tags && newArt.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {newArt.tags.map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-1 rounded-full bg-primary/20 text-primary text-sm flex items-center gap-1"
                              >
                                #{tag}
                                <button onClick={() => removeTagFromArt(tag)}>
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Popular tags */}
                        <div className="flex flex-wrap gap-1">
                          {POPULAR_TAGS.filter(t => !newArt.tags?.includes(t)).slice(0, 6).map(tag => (
                            <button
                              key={tag}
                              onClick={() => setNewArt({ ...newArt, tags: [...(newArt.tags || []), tag] })}
                              className="px-2 py-1 rounded-full bg-secondary text-muted-foreground text-xs hover:bg-primary/20 hover:text-primary"
                            >
                              +{tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Preview */}
                      {newArt.imageUrl && (
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">Превью</label>
                          <div className="relative aspect-square max-w-[300px] rounded-lg overflow-hidden bg-secondary">
                            <Image
                              src={newArt.imageUrl}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3 pt-4">
                        <Button variant="outline" onClick={() => setShowAddArtForm(false)} className="flex-1">
                          Отмена
                        </Button>
                        <Button onClick={handleAddArt} className="flex-1">
                          <Plus className="w-4 h-4 mr-2" />
                          Добавить
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Arts list */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {arts.map((art) => (
                  <div
                    key={art.id}
                    className="group relative rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={art.imageUrl}
                        alt={art.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-foreground text-sm truncate mb-1">{art.title}</h3>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {art.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs text-primary">#{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{art.views} просмотров</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            if (confirm("Удалить этот арт?")) {
                              removeArt(art.id)
                            }
                          }}
                          className="text-destructive hover:text-destructive h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Featured tab */}
          {activeTab === "featured" && (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">Рекомендуемое на главной</h1>
                <p className="text-muted-foreground">Выберите контент для показа в секции рекомендуемого</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.map((item) => {
                  const isFeatured = settings.featuredIds.includes(item.id)
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleFeatured(item.id)}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                        isFeatured
                          ? "bg-primary/10 border-primary"
                          : "bg-card border-border hover:border-primary/50"
                      )}
                    >
                      <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.genre}</p>
                      </div>
                      {isFeatured && (
                        <Star className="w-5 h-5 text-tuna-gold fill-current shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Settings tab */}
          {activeTab === "settings" && (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">Настройки сайта</h1>
                <p className="text-muted-foreground">Настройте внешний вид и безопасность</p>
              </div>

              <div className="max-w-2xl space-y-6">
                {/* Password change */}
                <div className="p-6 rounded-xl bg-card border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Lock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Безопасность</h3>
                        <p className="text-sm text-muted-foreground">Изменить пароль босса</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowPasswordChange(!showPasswordChange)}
                    >
                      <KeyRound className="w-4 h-4 mr-2" />
                      Изменить пароль
                    </Button>
                  </div>

                  {showPasswordChange && (
                    <div className="mt-4 pt-4 border-t border-border space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Текущий пароль</label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Введите текущий пароль"
                          className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Новый пароль</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Минимум 4 символа"
                          className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Подтвердите пароль</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Повторите новый пароль"
                          className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      {passwordError && (
                        <p className="text-destructive text-sm">{passwordError}</p>
                      )}
                      {passwordSuccess && (
                        <p className="text-green-500 text-sm">{passwordSuccess}</p>
                      )}
                      <Button onClick={handlePasswordChange}>
                        <Save className="w-4 h-4 mr-2" />
                        Сохранить пароль
                      </Button>
                    </div>
                  )}
                </div>

                {/* Left banner */}
                <div className="p-6 rounded-xl bg-card border border-border">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    URL баннера слева (необязательно)
                  </label>
                  <input
                    type="text"
                    value={settings.leftBannerUrl}
                    onChange={(e) => updateSettings({ leftBannerUrl: e.target.value })}
                    placeholder="https://example.com/banner-left.jpg"
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Right banner */}
                <div className="p-6 rounded-xl bg-card border border-border">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    URL баннера справа (необязательно)
                  </label>
                  <input
                    type="text"
                    value={settings.rightBannerUrl}
                    onChange={(e) => updateSettings({ rightBannerUrl: e.target.value })}
                    placeholder="https://example.com/banner-right.jpg"
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Info */}
                <div className="p-6 rounded-xl bg-secondary/50 border border-border">
                  <h3 className="font-semibold text-foreground mb-2">Информация</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Всего контента: {content.length}</p>
                    <p>Всего артов: {arts.length}</p>
                    <p>Рекомендуемых: {settings.featuredIds.length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
