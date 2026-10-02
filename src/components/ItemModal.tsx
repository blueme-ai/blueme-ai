"use client"

import { useEffect, useRef, useState } from "react"
import { CollectibleItem, ReviewLink } from "@/lib/data"
import { isBoxTag } from "@/lib/tags"
import { distinctNameJa } from "@/lib/insights"
import { X, ExternalLink, PlayCircle, BookOpen, Tag, Ruler, Calendar, DollarSign, Box, ShoppingCart, Loader2, Package, ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"

type SecondhandData = {
  yahoo: { price: string; url: string } | null
  madarake: { price: string; url: string } | null
  surugaya: { price: string; url: string } | null
  searchUrls: { yahoo: string; madarake: string; surugaya: string }
}

const langLabel: Record<ReviewLink["lang"], string> = {
  zh: "中文",
  ja: "日文",
  en: "English",
}

type Props = {
  item: CollectibleItem
  onClose: () => void
  onTagClick?: (tag: string) => void
  onPrev?: () => void
  onNext?: () => void
  position?: { index: number; total: number }
}

export default function ItemModal({ item, onClose, onTagClick, onPrev, onNext, position }: Props) {
  const [secondhand, setSecondhand] = useState<SecondhandData | null>(null)
  const [loadingSecondhand, setLoadingSecondhand] = useState(false)
  const [shown, setShown] = useState(0)
  const [itemId, setItemId] = useState(item.id)
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const photos = [item.imageUrl, ...(item.images ?? [])]
  const nameJa = distinctNameJa(item)

  // New item: reset per-item state and scroll back to the top.
  if (itemId !== item.id) {
    setItemId(item.id)
    setShown(0)
    setSecondhand(null)
  }
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 })
  }, [item.id])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      else if (e.key === "ArrowLeft") onPrev?.()
      else if (e.key === "ArrowRight") onNext?.()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus({ preventScroll: true })
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // Horizontal swipe on touch screens moves between items.
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current
    touch.current = null
    if (!start) return
    const dx = e.changedTouches[0].clientX - start.x
    const dy = e.changedTouches[0].clientY - start.y
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    if (dx < 0) onNext?.()
    else onPrev?.()
  }

  async function checkSecondhand() {
    const keyword = item.nameJa ?? item.name
    setLoadingSecondhand(true)
    setSecondhand(null)
    try {
      const res = await fetch(`/api/secondhand?q=${encodeURIComponent(keyword)}`)
      const data = await res.json()
      setSecondhand(data)
    } catch {
      setSecondhand(null)
    } finally {
      setLoadingSecondhand(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
    >
      <div
        ref={panelRef}
        className="relative bg-zinc-900 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto border border-zinc-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Sticky bar so close / prev / next stay reachable while scrolling a long record. */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-2 px-3 py-2 bg-zinc-900/90 backdrop-blur border-b border-zinc-800">
          <div className="flex items-center gap-1">
            <NavButton label="上一件" onClick={onPrev}><ChevronLeft size={18} /></NavButton>
            <NavButton label="下一件" onClick={onNext}><ChevronRight size={18} /></NavButton>
            {position && (
              <span className="ml-1 text-xs text-zinc-500 tabular-nums">
                {position.index + 1} / {position.total}
              </span>
            )}
          </div>
          <button
            ref={closeRef}
            type="button"
            aria-label="關閉"
            className="flex items-center gap-1 text-sm text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-full pl-3 pr-2.5 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            onClick={onClose}
          >
            關閉 <X size={16} />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-80 shrink-0 bg-zinc-800 flex flex-col sm:rounded-bl-2xl">
            <div className="flex-1 flex items-center justify-center min-h-64">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={photos[shown]}
                src={photos[shown]}
                alt={item.name}
                className="w-full sm:h-full object-contain max-h-[50vh] sm:max-h-[75vh]"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src =
                    "https://placehold.co/300x400/18181b/52525b?text=No+Image"
                }}
              />
            </div>
            {photos.length > 1 && (
              <div className="flex gap-2 p-2 overflow-x-auto">
                {photos.map((src, i) => (
                  <button
                    key={`${i}-${src}`}
                    type="button"
                    onClick={() => setShown(i)}
                    aria-label={`第 ${i + 1} 張照片`}
                    aria-current={i === shown}
                    className={`shrink-0 size-14 rounded-lg overflow-hidden border-2 ${i === shown ? "border-indigo-400" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 p-6 flex flex-col gap-4">
            <div>
              <p className="text-xs text-indigo-400 font-medium mb-1 flex items-center gap-2">
                {item.series}
                {item.favorite && (
                  <span className="shrink-0 whitespace-nowrap inline-flex items-center gap-1 text-[11px] bg-amber-400 text-zinc-950 rounded-full px-2 py-0.5">
                    <Star size={10} fill="currentColor" /> 本命
                  </span>
                )}
              </p>
              <h2 className="text-xl font-bold text-white leading-tight">{item.name}</h2>
              {nameJa && <p className="text-sm text-zinc-500 mt-0.5">{nameJa}</p>}
            </div>

            {item.note && (
              <blockquote className="relative rounded-xl bg-amber-500/10 border border-amber-500/30 px-4 py-3 text-sm text-amber-100 leading-relaxed">
                <Quote size={14} className="absolute -top-2 left-3 text-amber-400 bg-zinc-900" />
                {item.note}
              </blockquote>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoRow icon={<Box size={14} />} label="廠商" value={item.manufacturer} />
              <InfoRow icon={<Ruler size={14} />} label="比例" value={item.scale} />
              <InfoRow icon={<DollarSign size={14} />} label="定價" value={item.price} />
              <InfoRow icon={<Calendar size={14} />} label="發售日" value={item.releaseDate} />
              {item.height && (
                <InfoRow icon={<Ruler size={14} className="rotate-90" />} label="全高" value={item.height} />
              )}
            </div>

            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 font-medium">介紹</p>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.description}</p>
            </div>

            {item.officialUrl && (
              <div>
                <a
                  href={item.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <ExternalLink size={14} />
                  官方商品頁面
                </a>
              </div>
            )}

            {item.manualUrl && (
              <div>
                <a
                  href={item.manualUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <BookOpen size={14} />
                  說明書 / 組裝手冊
                </a>
              </div>
            )}


            {item.reviews && item.reviews.length > 0 && (
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 font-medium flex items-center gap-1.5">
                  <BookOpen size={13} className="text-emerald-500" /> 開箱文
                </p>
                <div className="flex flex-col gap-1.5">
                  {item.reviews.map((r, i) => (
                    <a
                      key={i}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors"
                    >
                      <span className="text-xs bg-zinc-700 text-zinc-400 rounded px-1.5 py-0.5 shrink-0">
                        {langLabel[r.lang]}
                      </span>
                      <span className="break-words min-w-0 leading-snug">{r.title}</span>
                      <ExternalLink size={12} className="shrink-0 text-zinc-600" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {item.youtube.length > 0 && (
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 font-medium flex items-center gap-1.5">
                  <PlayCircle size={13} className="text-red-500" /> 影片開箱
                </p>
                <div className="flex flex-col gap-1.5">
                  {item.youtube.map((y, i) => (
                    <a
                      key={i}
                      href={y.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors"
                    >
                      <span className="text-xs bg-zinc-700 text-zinc-400 rounded px-1.5 py-0.5 shrink-0">
                        {langLabel[y.lang]}
                      </span>
                      <span className="break-words min-w-0 leading-snug">{y.title}</span>
                      <ExternalLink size={12} className="shrink-0 text-zinc-600" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 font-medium flex items-center gap-1.5">
                <ShoppingCart size={13} className="text-yellow-500" /> 二手市場
              </p>
              {!secondhand && !loadingSecondhand && (
                <button
                  onClick={checkSecondhand}
                  className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg px-3 py-1.5 hover:bg-zinc-700 hover:text-white transition-colors"
                >
                  查詢二手價格
                </button>
              )}
              {loadingSecondhand && (
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Loader2 size={14} className="animate-spin" />
                  查詢中…
                </div>
              )}
              {secondhand && (
                <div className="grid grid-cols-3 gap-2">
                  <SecondhandCard
                    site="ヤフオク"
                    result={secondhand.yahoo}
                    searchUrl={secondhand.searchUrls.yahoo}
                    color="text-red-400"
                  />
                  <SecondhandCard
                    site="まんだらけ"
                    result={secondhand.madarake}
                    searchUrl={secondhand.searchUrls.madarake}
                    color="text-pink-400"
                  />
                  <SecondhandCard
                    site="駿河屋"
                    result={secondhand.surugaya}
                    searchUrl={secondhand.searchUrls.surugaya}
                    color="text-orange-400"
                  />
                </div>
              )}
            </div>

            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 font-medium flex items-center gap-1.5">
                <Tag size={13} /> 標籤
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) =>
                  isBoxTag(tag) ? (
                    <button
                      key={tag}
                      onClick={() => onTagClick?.(tag)}
                      className="inline-flex items-center gap-1 text-xs bg-amber-900/30 border border-amber-600/60 text-amber-300 rounded-full px-2.5 py-0.5 hover:bg-amber-600 hover:border-amber-500 hover:text-white transition-colors cursor-pointer"
                    >
                      <Package size={11} />
                      {tag}
                    </button>
                  ) : (
                    <button
                      key={tag}
                      onClick={() => onTagClick?.(tag)}
                      className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-full px-2.5 py-0.5 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NavButton({ label, onClick, children }: { label: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={!onClick}
      className="grid place-items-center size-9 rounded-full text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
    >
      {children}
    </button>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs text-zinc-500 flex items-center gap-1">
        {icon} {label}
      </p>
      <p className="text-white font-medium text-sm">{value}</p>
    </div>
  )
}

function SecondhandCard({
  site,
  result,
  searchUrl,
  color,
}: {
  site: string
  result: { price: string; url: string } | null
  searchUrl: string
  color: string
}) {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 flex flex-col gap-1.5">
      <p className={`text-xs font-semibold ${color}`}>{site}</p>
      {result ? (
        <>
          <p className="text-white font-bold text-sm">{result.price}</p>
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            商品頁面 <ExternalLink size={10} />
          </a>
        </>
      ) : (
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          搜尋結果 <ExternalLink size={10} />
        </a>
      )}
    </div>
  )
}
