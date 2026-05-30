import Link from "next/link"
import { TunaLogo } from "./tuna-logo"
import { Heart, Mail, MessageCircle } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <TunaLogo className="w-12 h-12" />
              <span className="text-2xl font-bold text-primary">ТУНЕЦ</span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              Твой любимый аниме-портал. Смотри аниме онлайн бесплатно в хорошем качестве.
              Без регистрации и СМС!
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Навигация</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Главная
              </Link>
              <Link href="/catalog" className="text-muted-foreground hover:text-primary transition-colors">
                Каталог
              </Link>
              <Link href="/genres" className="text-muted-foreground hover:text-primary transition-colors">
                Жанры
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Поддержка</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/donate" className="text-muted-foreground hover:text-tuna-orange transition-colors flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Донат
              </Link>
              <a href="mailto:support@tunec.anime" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Написать нам
              </a>
            </nav>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} ТУНЕЦ. Все права защищены (или нет).
          </p>
          <p className="text-xs text-muted-foreground">
            Сделано с 🐟 для любителей аниме
          </p>
        </div>
      </div>
    </footer>
  )
}
