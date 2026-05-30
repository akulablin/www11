"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TunaLogo } from "@/components/tuna-logo"
import { useTunaStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Heart, Copy, Check, Coffee, Zap, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const DONATION_OPTIONS = [
  { amount: 100, label: "Рыбка", icon: "🐟", description: "Маленькая поддержка" },
  { amount: 500, label: "Тунец", icon: "🐠", description: "Средняя поддержка" },
  { amount: 1000, label: "Кит", icon: "🐋", description: "Большая поддержка" },
  { amount: 5000, label: "Океан", icon: "🌊", description: "Огромная поддержка" },
]

export default function DonatePage() {
  const { isBoss } = useTunaStore()
  const [selectedAmount, setSelectedAmount] = useState(500)
  const [customAmount, setCustomAmount] = useState("")
  const [copied, setCopied] = useState(false)

  const walletAddress = "4276 1234 5678 9012" // Пример номера карты

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress.replace(/\s/g, ""))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount

  return (
    <div className="min-h-screen flex flex-col">
      <Header isBoss={isBoss} />
      
      <main className="flex-1 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <TunaLogo className="w-24 h-24" />
                <Heart className="absolute -bottom-2 -right-2 w-10 h-10 text-tuna-orange fill-current" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Поддержите ТУНЕЦ
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Ваша поддержка помогает нам продолжать работу над сайтом, 
              добавлять новый контент и улучшать сервис.
            </p>
          </div>

          {/* Why donate */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-xl bg-card border border-border text-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Быстрые серверы</h3>
              <p className="text-sm text-muted-foreground">
                На поддержку серверов и быструю загрузку контента
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border text-center">
              <div className="w-12 h-12 rounded-full bg-tuna-orange/20 flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-tuna-orange" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Новый контент</h3>
              <p className="text-sm text-muted-foreground">
                Больше аниме, быстрее релизы
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border text-center">
              <div className="w-12 h-12 rounded-full bg-tuna-gold/20 flex items-center justify-center mx-auto mb-4">
                <Coffee className="w-6 h-6 text-tuna-gold" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Без рекламы</h3>
              <p className="text-sm text-muted-foreground">
                Сохраняем сайт без надоедливой рекламы
              </p>
            </div>
          </div>

          {/* Donation form */}
          <div className="p-8 rounded-2xl bg-card border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
              Выберите сумму
            </h2>

            {/* Preset amounts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {DONATION_OPTIONS.map((option) => (
                <button
                  key={option.amount}
                  onClick={() => {
                    setSelectedAmount(option.amount)
                    setCustomAmount("")
                  }}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all text-center",
                    selectedAmount === option.amount && !customAmount
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="text-3xl mb-2 block">{option.icon}</span>
                  <span className="font-semibold text-foreground block">{option.amount} RUB</span>
                  <span className="text-xs text-muted-foreground">{option.label}</span>
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div className="mb-6">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Или введите свою сумму
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Введите сумму"
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  RUB
                </span>
              </div>
            </div>

            {/* Payment info */}
            <div className="p-4 rounded-lg bg-secondary mb-6">
              <p className="text-sm text-muted-foreground mb-2">Номер карты для перевода:</p>
              <div className="flex items-center gap-3">
                <code className="flex-1 px-4 py-3 rounded-lg bg-background text-foreground font-mono text-lg">
                  {walletAddress}
                </code>
                <Button onClick={handleCopy} variant="outline" size="icon">
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Summary */}
            <div className="text-center p-4 rounded-lg bg-primary/10 mb-6">
              <p className="text-sm text-muted-foreground mb-1">Итого к переводу</p>
              <p className="text-3xl font-bold text-primary">{finalAmount || 0} RUB</p>
            </div>

            {/* Note */}
            <p className="text-sm text-center text-muted-foreground">
              После перевода напишите нам в комментариях к любому посту - мы скажем спасибо! 
            </p>
          </div>

          {/* Thank you note */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              Спасибо, что поддерживаете ТУНЕЦ!
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
