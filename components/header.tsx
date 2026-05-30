"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Settings, Heart } from "lucide-react"
import { TunaLogo } from "./tuna-logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeaderProps {
  isBoss?: boolean
}

export function Header({ isBoss }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { label: "Главная", href: "/" },
    { label: "Каталог", href: "/catalog" },
    { label: "Галерея", href: "/gallery" },
    { label: "Жанры", href: "/genres" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <TunaLogo className="w-10 h-10 transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold text-primary">ТУНЕЦ</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link href="/donate">
              <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2 text-tuna-orange hover:text-tuna-orange">
                <Heart className="w-4 h-4" />
                Поддержать
              </Button>
            </Link>
            
            {isBoss && (
              <Link href="/boss">
                <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Панель Босса
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "md:hidden overflow-hidden transition-all duration-300 border-t border-border",
        isMenuOpen ? "max-h-64" : "max-h-0"
      )}>
        <nav className="flex flex-col p-4 gap-2 bg-background">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/donate"
            onClick={() => setIsMenuOpen(false)}
            className="px-4 py-3 rounded-lg text-tuna-orange hover:bg-secondary transition-colors flex items-center gap-2"
          >
            <Heart className="w-4 h-4" />
            Поддержать
          </Link>
          {isBoss && (
            <Link
              href="/boss"
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-3 rounded-lg text-primary hover:bg-secondary transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Панель Босса
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
