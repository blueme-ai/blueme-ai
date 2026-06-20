"use client"

import { useEffect } from "react"
import { CollectibleItem, ReviewLink } from "@/lib/data"
import { X, ExternalLink, PlayCircle, BookOpen, Tag, Ruler, Calendar, DollarSign, Box } from "lucide-react"

const langLabel: Record<ReviewLink["lang"], string> = {
  zh: "中文",
  ja: "日文",
  en: "English",
}

export default function ItemModal({ item, onClose }: { item: CollectibleItem; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-zinc-900 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto border border-zinc-700 shadow-2xl"
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
                      <span className="truncate">{r.title}</span>
                      <ExternalLink size={12} className="shrink-0 text-zinc-600" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {item.youtube.length > 0 && (
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 font-medium flex items-center gap-1.5">
                  <PlayCircle size={13} className="text-red-500" /> YouTube 開箱
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
                      <span className="truncate">{y.title}</span>
                      <ExternalLink size={12} className="shrink-0 text-zinc-600" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 font-medium flex items-center gap-1.5">
                <Tag size={13} /> 標籤
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-full px-2.5 py-0.5"
                  >
                    {tag}
                  </span>
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
