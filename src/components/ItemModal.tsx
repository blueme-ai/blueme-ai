"use client"

import { useEffect, useState } from "react"
import { CollectibleItem, ReviewLink } from "@/lib/data"
import { X, ExternalLink, PlayCircle, BookOpen, Tag, Ruler, Calendar, DollarSign, Box, ShoppingCart, Loader2 } from "lucide-react"

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

export default function ItemModal({ item, onClose, onTagClick }: { item: CollectibleItem; onClose: () => void; onTagClick?: (tag: string) => void }) {
  const [secondhand, setSecondhand] = useState<SecondhandData | null>(null)
  const [loadingSecondhand, setLoadingSecondhand] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-zinc-900 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto border border-zinc-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 z-10 text-zinc-400 hover:text-white transition-colors bg-zinc-800/80 rounded-full p-1.5"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-72 shrink-0 bg-zinc-800 flex items-center justify-center rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none min-h-64">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full sm:h-full object-contain rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none max-h-[50vh] sm:max-h-[85vh]"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src =
                  "https://placehold.co/300x400/18181b/52525b?text=No+Image"
              }}
            />
          </div>

          <div className="flex-1 p-6 flex flex-col gap-4">
            <div>
              <p className="text-xs text-indigo-400 font-medium mb-1">{item.series}</p>
              <h2 className="text-xl font-bold text-white leading-tight">{item.name}</h2>
              {item.nameJa && (
                <p className="text-sm text-zinc-500 mt-0.5">{item.nameJa}</p>
              )}
            </div>

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
                {item.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onTagClick?.(tag)}
                    className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-full px-2.5 py-0.5 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
